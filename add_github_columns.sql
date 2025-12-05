-- Add GitHub Repository URL column to ideas table
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS github_repo_url TEXT;

-- Add MVP file URLs column (comma-separated GitHub file URLs)
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS mvp_file_urls TEXT;

-- Add comment for documentation
COMMENT ON COLUMN ideas.github_repo_url IS 'GitHub repository URL for MVP files (repo named with user UID)';
COMMENT ON COLUMN ideas.mvp_file_urls IS 'Comma-separated list of GitHub file URLs for MVP files';
