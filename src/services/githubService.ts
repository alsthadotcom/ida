import { Octokit } from '@octokit/rest';

// GitHub configuration
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const GITHUB_OWNER = 'idaaz'; // Your GitHub username

const octokit = new Octokit({
    auth: GITHUB_TOKEN,
});

/**
 * Create a GitHub repository for an idea
 * @param repoName - Name of the repository (user UID)
 * @param description - Repository description
 */
export async function createGitHubRepo(repoName: string, description: string): Promise<string> {
    try {
        const { data } = await octokit.repos.createForAuthenticatedUser({
            name: repoName,
            description: description,
            private: false, // Set to true if you want private repos
            auto_init: true, // Initialize with README
        });

        console.log('GitHub repo created:', data.html_url);
        return data.html_url;
    } catch (error: any) {
        if (error.status === 422) {
            // Repo already exists, return the URL
            return `https://github.com/${GITHUB_OWNER}/${repoName}`;
        }
        console.error('Error creating GitHub repo:', error);
        throw new Error(`Failed to create GitHub repository: ${error.message}`);
    }
}

/**
 * Upload a file to a GitHub repository
 * @param repoName - Repository name
 * @param filePath - Path where the file should be stored in the repo
 * @param content - File content (base64 encoded for binary files)
 * @param commitMessage - Commit message
 */
export async function uploadFileToGitHub(
    repoName: string,
    filePath: string,
    content: string,
    commitMessage: string = 'Add file'
): Promise<string> {
    try {
        const { data } = await octokit.repos.createOrUpdateFileContents({
            owner: GITHUB_OWNER,
            repo: repoName,
            path: filePath,
            message: commitMessage,
            content: content, // Must be base64 encoded
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
            // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
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
    files: File[]
): Promise<{ repoUrl: string; fileUrls: string[] }> {
    try {
        // Create repo with user UID as name
        const repoName = userUid;
        const description = `MVP files for: ${ideaTitle}`;
        const repoUrl = await createGitHubRepo(repoName, description);

        // Upload each file
        const fileUrls: string[] = [];
        for (const file of files) {
            const base64Content = await fileToBase64(file);
            const filePath = `mvp-files/${file.name}`;
            const commitMessage = `Add MVP file: ${file.name}`;

            const fileUrl = await uploadFileToGitHub(
                repoName,
                filePath,
                base64Content,
                commitMessage
            );
            fileUrls.push(fileUrl);
        }

        return { repoUrl, fileUrls };
    } catch (error) {
        console.error('Error uploading MVP files to GitHub:', error);
        throw error;
    }
}
