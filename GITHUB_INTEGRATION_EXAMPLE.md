# 📝 How to Integrate GitHub MVP Upload

## Quick Example: Adding GitHub Upload to SubmitIdea Page

### Option 1: Replace Current File Upload

In `src/pages/SubmitIdea.tsx`, replace the Supabase file upload with GitHub upload:

```typescript
import { uploadMVPFilesToGitHub } from '@/services/githubService';

// Change handleFileUpload to use GitHub instead of Supabase
const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (!files || files.length === 0) return;

  try {
    setUploading(true);
    
    // Store files temporarily (don't upload yet)
    const fileArray = Array.from(files);
    setUploadedFiles(fileArray.map(f => ({ 
      name: f.name, 
      size: f.size,
      file: f // Store actual file object
    })));
    
    toast.success(`${files.length} file(s) ready to upload`);
  } catch (error) {
    toast.error("Failed to process files");
  } finally {
    setUploading(false);
  }
};

// Update handleSubmitIdea to upload to GitHub
const handleSubmitIdea = async () => {
  try {
    if (!user) throw new Error('Must be logged in');
    
    let githubRepoUrl = '';
    let githubFileUrls: string[] = [];

    // Upload MVP files to GitHub if any
    if (uploadedFiles.length > 0) {
      toast.info('Uploading MVP files to GitHub...');
      
      const result = await uploadMVPFilesToGitHub(
        user.id,  // User UID as repo name
        formData.title,
        uploadedFiles.map(f => f.file)  // Actual File objects
      );
      
      githubRepoUrl = result.repoUrl;
      githubFileUrls = result.fileUrls;
      
      toast.success('Files uploaded to GitHub!');
    }

    // Create idea with GitHub URLs
    const ideaData = {
      title: formData.title,
      description: formData.longDescription,
      price: formData.price,
      category: formData.category,
      // ... other fields ...
      github_repo_url: githubRepoUrl,
      mvp_file_urls: githubFileUrls.join(','),
    };

    await createIdea(ideaData);
    
    toast.success('Idea submitted successfully!');
    navigate('/marketplace');
  } catch (error: any) {
    toast.error(error.message || 'Failed to submit idea');
  }
};
```

### Option 2: Dual Upload (Small files → Supabase, Large files → GitHub)

```typescript
const handleSubmitIdea = async () => {
  try {
    if (!user) throw new Error('Must be logged in');
    
    // Separate files by size (50MB threshold)
    const smallFiles = uploadedFiles.filter(f => f.size < 50 * 1024 * 1024);
    const largeFiles = uploadedFiles.filter(f => f.size >= 50 * 1024 * 1024);

    let githubRepoUrl = '';
    let supabaseFileUrls: string[] = [];

    // Upload large files to GitHub
    if (largeFiles.length > 0) {
      toast.info('Uploading large files to GitHub...');
      const result = await uploadMVPFilesToGitHub(
        user.id,
        formData.title,
        largeFiles.map(f => f.file)
      );
      githubRepoUrl = result.repoUrl;
    }

    // Upload small files to Supabase
    if (smallFiles.length > 0) {
      toast.info('Uploading evidence files...');
      for (const file of smallFiles) {
        const path = `evidence/${user.id}/${Date.now()}-${file.name}`;
        const { data } = await supabase.storage
          .from('idea-files')
          .upload(path, file.file);
        
        if (data) {
          const { data: { publicUrl } } = supabase.storage
            .from('idea-files')
            .getPublicUrl(path);
          
          supabaseFileUrls.push(publicUrl);
        }
      }
    }

    // Create idea with both URLs
    const ideaData = {
      // ... other fields ...
      github_repo_url: githubRepoUrl,
      evidence_files: supabaseFileUrls.join(','),
    };

    await createIdea(ideaData);
  } catch (error: any) {
    toast.error(error.message);
  }
};
```

---

## Update ideaService.ts

Add GitHub URL fields:

```typescript
// In createIdea function
const idea = {
  // ... existing fields ...
  github_repo_url: ideaData.github_repo_url || '',
  mvp_file_urls: ideaData.mvp_file_urls || '',
};
```

---

## Display GitHub Repo Link in Marketplace

```tsx
// In IdeaCard or IdeaDetail component
{idea.github_repo_url && (
  <a 
    href={idea.github_repo_url}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 text-primary hover:underline"
  >
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
    View MVP on GitHub
  </a>
)}
```

---

## 🎯 Recommended Approach

**Use GitHub for ALL MVP files** (simplest):
1. Remove Supabase file upload entirely
2. All MVP files go to GitHub
3. One repo per user (named with UID)
4. Each idea's files go in a subfolder: `/ideas/idea-slug/`

This way you get:
- ✅ Unlimited storage (effectively)
- ✅ Version control for free
- ✅ Easy file browsing
- ✅ Simple to implement
