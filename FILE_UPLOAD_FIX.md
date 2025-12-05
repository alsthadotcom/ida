# Quick Fix: Enable File Upload

## Add these lines to SubmitIdea.tsx:

### 1. Add imports at the top (after line 4):
```tsx
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
```

### 2. Add X icon import (in the lucide-react imports around line 21):
```tsx
  X,
```

### 3. Add state variables (after line 42, inside the component):
```tsx
const { user } = useAuth();
const { toast } = useToast();
const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; size: number; file: File }>>([]);
const [uploading, setUploading] = useState(false);
```

### 4. Add file upload handler (before handleSubmitIdea):
```tsx
const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (!files || files.length === 0) return;

  const validTypes = [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/pdf",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "video/mp4",
    "audio/mpeg",
    "text/plain",
    "application/zip",
    "application/x-zip-compressed",
  ];

  const maxSize = 50 * 1024 * 1024; // 50MB

  try {
    setUploading(true);
    const newFiles: Array<{ name: string; size: number; file: File }> = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not supported`,
          variant: "destructive",
        });
        continue;
      }

      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds 50MB`,
          variant: "destructive",
        });
        continue;
      }

      newFiles.push({
        name: file.name,
        size: file.size,
        file: file,
      });
    }

    setUploadedFiles([...uploadedFiles, ...newFiles]);
    toast({
      title: "Files Ready",
      description: `${newFiles.length} file(s) ready for GitHub`,
    });
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to process files",
      variant: "destructive",
    });
  } finally {
    setUploading(false);
    e.target.value = "";
  }
};

const handleRemoveFile = (index: number) => {
  setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  toast({
    title: "File removed",
  });
};
```

### 5. Update handleSubmitIdea (replace the existing one):
```tsx
const handleSubmitIdea = async () => {
  try {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to submit",
        variant: "destructive",
      });
      return;
    }

    let githubRepoUrl = '';
    let githubFileUrls: string[] = [];

    // Upload files to GitHub
    if (uploadedFiles.length > 0) {
      toast({
        title: "Uploading to GitHub",
        description: "Please wait...",
      });

      try {
        const { uploadMVPFilesToGitHub } = await import('@/services/githubService');
        
        const result = await uploadMVPFilesToGitHub(
          user.id,
          formData.title,
          uploadedFiles.map(f => f.file)
        );

        githubRepoUrl = result.repoUrl;
        githubFileUrls = result.fileUrls;

        toast({
          title: "Upload Complete!",
        });
      } catch (error: any) {
        toast({
          title: "Upload Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
    }

    const ideaData = {
      title: formData.title,
      description: formData.longDescription,
      price: formData.price,
      category: formData.category,
      targetAudience: formData.targetAudience,
      uniqueness: aiValidation.score,
      executionReadiness: formData.executionReadiness,
      clarityScore: aiValidation.clarityScore,
      hasMVP: formData.hasMVP,
      isRawIdea: formData.isRawIdea,
      hasDetailedRoadmap: formData.hasDetailedRoadmap,
      regionFeasibility: formData.regionFeasibility,
      marketPotential: formData.marketPotential,
      investmentReady: formData.investmentReady,
      lookingForPartner: formData.lookingForPartner,
      typeOfTopic: formData.typeOfTopic,
      evidenceNote: formData.evidenceNote,
      githubRepoUrl: githubRepoUrl,
      mvpFileUrls: githubFileUrls.join(','),
    };
    
    await createIdea(ideaData);
    
    toast({
      title: "Success!",
      description: "Idea submitted!",
    });
    
    setTimeout(() => {
      window.location.href = "/marketplace";
    }, 1500);
  } catch (error: any) {
    toast({
      title: "Failed",
      description: error.message,
      variant: "destructive",
    });
  }
};
```

### 6. Find the "Browse Files" button (around line 290) and replace it with:
```tsx
<div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
  <Upload className="w-10 h-10 mx-auto text-primary mb-3" />
  <p className="text-foreground font-medium">Upload Project Files</p>
  <p className="text-muted-foreground text-sm mt-1">ZIP, PDF, DOCX, MP4 (max 50MB)</p>
  <input
    id="file-upload"
    type="file"
    multiple
    accept=".docx,.pdf,.ppt,.pptx,.mp4,.mp3,.txt,.zip"
    className="hidden"
    onChange={handleFileUpload}
  />
  <Button 
    variant="outline" 
    className="mt-4" 
    disabled={uploading}
    type="button"
    onClick={() => document.getElementById('file-upload')?.click()}
  >
    {uploading ? "Uploading..." : "Browse Files"}
  </Button>
</div>

{uploadedFiles.length > 0 && (
  <div className="space-y-2 mt-4">
    <p className="text-sm font-medium">Selected Files:</p>
    {uploadedFiles.map((file, index) => (
      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border">
        <div className="flex items-center gap-2">
          <File className="w-4 h-4" />
          <span className="text-sm">{file.name}</span>
          <span className="text-xs text-muted-foreground">
            ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleRemoveFile(index)}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    ))}
  </div>
)}
```

---

**This will enable file browsing and GitHub upload!** 🚀
