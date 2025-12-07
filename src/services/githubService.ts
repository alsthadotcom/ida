import { Octokit } from '@octokit/rest';

// GitHub configuration
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
console.log('[GithubService] Token available:', !!GITHUB_TOKEN); // Debug log

const octokit = new Octokit({
    auth: GITHUB_TOKEN,
});

/**
 * Get an authenticated Octokit client
 * (Uses override token if provided, otherwise falls back to env var)
 */
const getClient = (tokenOverride?: string) => {
    if (tokenOverride) {
        return new Octokit({ auth: tokenOverride });
    }
    return octokit;
};

/**
 * Get the authenticated user's details
 */
export async function getAuthenticatedUser(tokenOverride?: string) {
    try {
        const client = getClient(tokenOverride);
        const { data } = await client.users.getAuthenticated();
        return data.login;
    } catch (error) {
        console.error('Error fetching authenticated user:', error);
        throw new Error('Failed to authenticate with GitHub. Please check your token.');
    }
}

/**
 * Create a GitHub repository for an idea (under specific owner)
 */
export async function createGitHubRepo(
    repoName: string,
    description: string,
    owner: string,
    tokenOverride?: string
): Promise<string> {
    try {
        const client = getClient(tokenOverride);
        // Use createForAuthenticatedUser to create repo under the user's account
        const { data } = await client.repos.createForAuthenticatedUser({
            name: repoName,
            description: description,
            private: true,
            auto_init: true,
        });

        console.log('GitHub repo created:', data.html_url);
        return data.html_url;
    } catch (error: any) {
        if (error.status === 422) {
            // Repo already exists, return the URL
            return `https://github.com/${owner}/${repoName}`;
        }
        console.error('Error creating GitHub repo:', error);
        throw new Error(`Failed to create GitHub repository: ${error.message}`);
    }
}

/**
 * Upload a file to a GitHub repository
 */
export async function uploadFileToGitHub(
    owner: string,
    repoName: string,
    filePath: string,
    content: string,
    commitMessage: string = 'Add file',
    tokenOverride?: string
): Promise<string> {
    try {
        const client = getClient(tokenOverride);

        // Check if file exists to get SHA
        let sha: string | undefined;
        try {
            const { data } = await client.repos.getContent({
                owner: owner,
                repo: repoName,
                path: filePath,
            });
            if (!Array.isArray(data) && 'sha' in data) {
                sha = data.sha;
            }
        } catch (e) {
            // File doesn't exist, ignore error
        }

        const { data } = await client.repos.createOrUpdateFileContents({
            owner: owner,
            repo: repoName,
            path: filePath,
            message: commitMessage,
            content: content,
            sha: sha, // Include SHA if updating
        });

        console.log('File uploaded to GitHub:', data.content?.html_url);
        return data.content?.html_url || '';
    } catch (error: any) {
        console.error('Error uploading file to GitHub:', error);
        throw new Error(`Failed to upload file: ${error.message}`);
    }
}

/**
 * Convert File to base64 for GitHub upload
 */
export function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // Remove the data URL prefix
            const base64 = result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = (error) => reject(error);
    });
}

/**
 * Upload multiple files to GitHub repository
 */
export async function uploadMVPFilesToGitHub(
    userUid: string,
    ideaTitle: string,
    files: File[],
    tokenOverride?: string
): Promise<{ repoUrl: string; fileUrls: string[] }> {
    try {
        // 1. Get authenticated user login (owner)
        const owner = await getAuthenticatedUser(tokenOverride);
        console.log('Authenticated as GitHub user:', owner);

        // 2. Create repo with user UID as name
        const repoName = userUid;
        const description = `MVP files for: ${ideaTitle}`;

        const repoUrl = await createGitHubRepo(repoName, description, owner, tokenOverride);

        // 3. Upload each file
        const fileUrls: string[] = [];
        for (const file of files) {
            const base64Content = await fileToBase64(file);
            const filePath = `mvp-files/${file.name}`;
            const commitMessage = `Add MVP file: ${file.name}`;

            const fileUrl = await uploadFileToGitHub(
                owner,
                repoName,
                filePath,
                base64Content,
                commitMessage,
                tokenOverride
            );
            fileUrls.push(fileUrl);
        }

        return { repoUrl, fileUrls };
    } catch (error) {
        console.error('Error uploading MVP files to GitHub:', error);
        throw error;
    }
}

/**
 * Delete a file from GitHub repository
 */
export async function deleteFileFromGitHub(
    owner: string,
    repoName: string,
    filePath: string,
    message: string = 'Delete file via Idea Canvas',
    tokenOverride?: string
): Promise<void> {
    try {
        const client = getClient(tokenOverride);

        // 1. Get the file's SHA
        let sha: string;
        try {
            const { data } = await client.repos.getContent({
                owner,
                repo: repoName,
                path: filePath,
            });

            if (Array.isArray(data) || !('sha' in data)) {
                throw new Error('Path is a directory or invalid');
            }
            sha = data.sha;
        } catch (e: any) {
            console.error('File not found for deletion:', e);
            return; // File probably already deleted or doesn't exist
        }

        // 2. Delete the file
        await client.repos.deleteFile({
            owner,
            repo: repoName,
            path: filePath,
            message,
            sha,
        });

        console.log(`File deleted from GitHub: ${filePath}`);
    } catch (error: any) {
        console.error('Error deleting file from GitHub:', error);
        throw new Error(`Failed to delete file: ${error.message}`);
    }
}
