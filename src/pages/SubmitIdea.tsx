import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { createIdea, fetchIdeaById, updateIdea } from "@/services/ideaService";
import { validateIdea } from "@/services/aiService";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import {
  ArrowLeft,
  ArrowRight,
  Lightbulb,
  FileText,
  Tag,
  Upload,
  Sparkles,
  Check,
  AlertCircle,
  Trash2,
  DollarSign,
  BarChart,
  Globe,
  Target,
  Handshake,
  X,
  Zap,
  File,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { CATEGORIES, TOPIC_TYPES, TARGET_AUDIENCES, REGIONS } from "@/constants/marketplace";

const SubmitIdea = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; size: number; file: File }>>([]);
  const [uploading, setUploading] = useState(false);
  const [step, setStep] = useState(1);
  const [platformToken, setPlatformToken] = useState("");
  const [searchParams] = useSearchParams();
  const ideaId = searchParams.get("id");
  const mode = searchParams.get("mode");
  const isEditing = !!ideaId;
  const isReviewMode = mode === 'review';
  const [existingFiles, setExistingFiles] = useState<Array<{ name: string; url: string }>>([]);


  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    longDescription: "",
    targetAudience: "",
    problem: "",
    solution: "",
    category: "",
    price: "",
    executionReadiness: 50,
    hasMVP: false,
    isRawIdea: false,
    hasDetailedRoadmap: false,
    regionFeasibility: "",
    marketPotential: "",
    investmentReady: false,
    lookingForPartner: false,
    typeOfTopic: "",
    evidenceNote: "",
  });
  const [aiValidation, setAiValidation] = useState<{
    status: "idle" | "validating" | "passed" | "failed";
    score: number;
    clarityScore: number;
    feedback: string[];
    aiScores?: any;
  }>({
    status: "idle",
    score: 0,
    clarityScore: 0,
    feedback: [],
    aiScores: null,
  });

  const handleInputChange = (field: string, value: any) => {
    if (isReviewMode) return; // Prevent changes in review mode
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      if ((field === "hasMVP" && value) || (field === "hasDetailedRoadmap" && value)) {
        newData.isRawIdea = false;
      }
      return newData;
    });
  };

  const calculateCompleteness = () => {
    const { evidenceNote, ...required } = formData;
    const values = Object.values(required);
    const filled = values.filter((v) => (typeof v === "string" ? v.length > 0 : true)).length;
    return Math.round((filled / values.length) * 100);
  };

  const handleValidate = async () => {
    console.log("Starting AI validation with NVIDIA NIM...");
    setAiValidation({ status: "validating", score: 0, clarityScore: 0, feedback: [], aiScores: null });

    try {
      const result = await validateIdea(formData);
      console.log("AI Result:", result);

      // Store the full AI result for later saving to DB with defensive checks
      const aiScores = {
        ...(result.metrics || {}),
        ...(result.problem_solution || {}),
        market_potential: result.market_validation?.potential || 'Unknown',
        market_saturation_percentage: result.market_validation?.market_saturation_percentage || 0,
        market_saturation_description: result.market_validation?.market_saturation_description || 'N/A',
        price_validation: result.market_validation?.price_validation || 'N/A',
        summary: result.summary || 'No summary available',
        recommended_category: result.category?.recommended || formData.category,
        validated_at: new Date().toISOString()
      };

      // Update form fields with AI suggestions (only if values exist)
      setFormData(prev => ({
        ...prev,
        category: result.category?.recommended || prev.category,
        marketPotential: result.market_validation?.potential || prev.marketPotential,
        // Extract first number from price range for the price field
        price: result.market_validation?.price_validation?.match(/\$?(\d+)/)?.[1] || prev.price
      }));

      // Update validation state for UI display
      const score = result.metrics?.uniqueness || 0;
      const clarity = result.metrics?.clarity || 0;

      setAiValidation({
        status: "passed",
        score,
        clarityScore: clarity,
        feedback: [
          result.summary || 'Analysis complete',
          `Market Potential: ${result.market_validation?.potential || 'Unknown'}`,
          `Market Saturation: ${result.market_validation?.market_saturation_percentage || 0}% (${result.market_validation?.market_saturation_description || 'N/A'})`,
          `Feasibility: ${result.metrics?.feasibility || 0}%`,
          `Recommended Category: ${result.category?.recommended || formData.category}`
        ],
        aiScores // Store for DB save
      });

      toast({ title: "AI Validation Complete" });
    } catch (error: any) {
      console.error(error);
      setAiValidation({
        status: "failed",
        score: 0,
        clarityScore: 0,
        feedback: ["Validation failed. Please ensure NVIDIA API Key is set in .env.local"]
      });
      toast({
        title: "Validation Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    const fetchPlatformToken = async () => {
      try {
        const { data, error } = await supabase
          .from('platform_settings')
          .select('value')
          .eq('key', 'github_token')
          .single();

        if (data?.value) {
          setPlatformToken(data.value);
        }
      } catch (err) {
        console.error("Failed to fetch platform token", err);
      }
    };
    fetchPlatformToken();
  }, []);

  useEffect(() => {
    if (ideaId) {
      const loadIdea = async () => {
        try {
          const idea = await fetchIdeaById(ideaId);
          if (idea) {
            setFormData({
              title: idea.title || "",
              shortDescription: idea.description ? idea.description.substring(0, 200) : "", // simple fallback
              longDescription: idea.description || "",
              targetAudience: idea.target_audience || "",
              problem: "", // Not stored explicitly?
              solution: "", // Not stored explicitly?
              category: idea.category || "",
              price: idea.price ? idea.price.replace('$', '') : "",
              executionReadiness: idea.execution_readiness || 50,
              hasMVP: idea.has_mvp || false,
              isRawIdea: idea.is_raw_idea || false,
              hasDetailedRoadmap: idea.has_detailed_roadmap || false,
              regionFeasibility: idea.region_feasibility || "",
              marketPotential: idea.market_potential || "",
              investmentReady: idea.investment_ready || false,
              lookingForPartner: idea.looking_for_partner || false,
              typeOfTopic: idea.type_of_topic || "",
              evidenceNote: idea.evidence_note || "",
            });

            // Parse existing files
            if (idea.mvp_file_urls) {
              const urls = idea.mvp_file_urls.split(',').filter((u: string) => u);
              const files = urls.map((url: string) => {
                // Extract filename from URL (GitHub raw/blob URL structure assumed)
                // e.g., .../mvp-files/filename.ext
                const parts = url.split('/');
                const name = decodeURIComponent(parts[parts.length - 1]);
                return { name, url };
              });
              setExistingFiles(files);
            }

            // Pre-calculate score for existing ideas
            setAiValidation({
              status: "passed",
              score: idea.uniqueness || 85,
              clarityScore: idea.clarity_score || 90,
              feedback: ["Idea loaded from database"]
            });
          }
        } catch (error) {
          console.error("Error loading idea:", error);
          toast({
            title: "Error",
            description: "Failed to load idea details",
            variant: "destructive"
          });
        }
      };
      loadIdea();
    }
  }, [ideaId]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isReviewMode) return;
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
    if (isReviewMode) return;
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
    toast({
      title: "File removed",
    });
  };

  const handleDeleteExistingFile = async (index: number) => {
    if (isReviewMode || !user || !ideaId) return;
    const file = existingFiles[index];

    if (confirm(`Are you sure you want to delete ${file.name} from GitHub? This cannot be undone.`)) {
      try {
        toast({ title: "Deleting file..." });
        const { deleteFileFromGitHub, getAuthenticatedUser } = await import('@/services/githubService');

        // Get correct GitHub username (owner)
        const owner = await getAuthenticatedUser(platformToken);

        // Repo name is user ID (UUID), path is mvp-files/filename
        await deleteFileFromGitHub(owner, user.id, `mvp-files/${file.name}`, 'Deleted via Edit', platformToken);

        const newFiles = existingFiles.filter((_, i) => i !== index);
        setExistingFiles(newFiles);

        toast({ title: "File deleted from GitHub" });
      } catch (error: any) {
        console.error("Delete error", error);
        toast({
          title: "Delete Failed",
          description: error.message,
          variant: "destructive"
        });
      }
    }
  };

  const handleSubmitIdea = async () => {
    if (isReviewMode) return;
    try {
      if (!user) {
        toast({
          title: "Login Required",
          description: "Please log in to submit",
          variant: "destructive",
        });
        return;
      }

      let githubRepoUrl = formData['githubRepoUrl'] || '';

      let allFileUrls: string[] = existingFiles.map(f => f.url);

      // Upload NEW files to GitHub
      if (uploadedFiles.length > 0) {
        toast({
          title: "Uploading new files to GitHub",
          description: "Please wait...",
        });

        try {
          const { uploadMVPFilesToGitHub } = await import('@/services/githubService');

          const result = await uploadMVPFilesToGitHub(
            user.id,
            formData.title,
            uploadedFiles.map(f => f.file),
            platformToken
          );

          if (!githubRepoUrl) githubRepoUrl = result.repoUrl;

          // Add new file URLs to the list
          allFileUrls = [...allFileUrls, ...result.fileUrls];

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
        mvpFileUrls: allFileUrls.join(','),
      };

      if (isEditing && ideaId) {
        await updateIdea(ideaId, ideaData);
        toast({
          title: "Success!",
          description: "Idea updated successfully!",
        });
      } else {
        await createIdea(ideaData);
        toast({
          title: "Success!",
          description: "Idea submitted!",
        });
      }

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

  const completeness = calculateCompleteness();
  const showEvidence = formData.hasMVP || formData.hasDetailedRoadmap;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Link to={isReviewMode ? "/admin" : "/marketplace"} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to {isReviewMode ? "Admin Dashboard" : "Marketplace"}
            </Link>
            <h1 className="text-3xl md:text-4xl font-outfit font-bold text-foreground mb-2">
              {isReviewMode ? "Review Idea" : (isEditing ? "Edit Your Idea" : "Submit Your Idea")}
            </h1>
            <p className="text-muted-foreground">
              {isReviewMode ? "Review idea details and attached files." : (isEditing ? "Update your idea details and manage files." : "Share your unique business idea and start earning.")}
            </p>
          </motion.div>

          {/* Progress */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-xl p-4 mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">Idea Completeness</span>
              <span className="text-sm text-primary font-semibold">{completeness}%</span>
            </div>
            <Progress value={completeness} className="h-2" />
          </motion.div>

          {/* Step indicators */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-center justify-center gap-4 mb-8">
            {[
              { num: 1, label: "Basic Info", icon: Lightbulb },
              { num: 2, label: "Details", icon: FileText },
              { num: 3, label: "Market & Feasibility", icon: BarChart },
              { num: 4, label: "Validate", icon: Sparkles },
            ].map((s) => (
              <div key={s.num} className="flex items-center">
                <button
                  onClick={() => setStep(s.num)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${step === s.num
                    ? "bg-primary text-primary-foreground"
                    : step > s.num
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                    }`}
                >
                  <s.icon className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm font-medium">{s.label}</span>
                </button>
                {s.num < 4 && (
                  <div className={`w-8 h-0.5 mx-2 ${step > s.num ? "bg-primary" : "bg-border"}`} />
                )}
              </div>
            ))}
          </motion.div>

          {/* Form steps */}
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass-card rounded-2xl p-6 md:p-8">
            {step === 1 && (
              <div className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-foreground flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-primary" /> Idea Title
                  </Label>
                  <Input id="title" disabled={isReviewMode} placeholder="e.g., AI‑Powered Customer Onboarding System" value={formData.title} onChange={(e) => handleInputChange("title", e.target.value)} className="h-12 bg-muted/50 border-border/50" />
                </div>
                {/* Short description */}
                <div className="space-y-2">
                  <Label htmlFor="shortDescription" className="text-foreground flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" /> Short Description
                  </Label>
                  <Textarea id="shortDescription" disabled={isReviewMode} placeholder="A brief summary (max 200 chars)" maxLength={200} value={formData.shortDescription} onChange={(e) => handleInputChange("shortDescription", e.target.value)} className="bg-muted/50 border-border/50 min-h-[100px]" />
                  <p className="text-xs text-muted-foreground text-right">{formData.shortDescription.length}/200</p>
                </div>
                {/* Topic Type (Badge) */}

                {/* Category & Topic Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-foreground flex items-center gap-2">
                      <Tag className="w-4 h-4 text-primary" /> Category
                    </Label>
                    <Select disabled={isReviewMode} value={formData.category} onValueChange={(v) => handleInputChange("category", v)}>
                      <SelectTrigger className="h-12 bg-muted/50 border-border/50"><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>{CATEGORIES.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="typeOfTopic" className="text-foreground flex items-center gap-2">
                      <Zap className="w-4 h-4 text-accent" /> Topic Type
                    </Label>
                    <Select disabled={isReviewMode} value={formData.typeOfTopic} onValueChange={(v) => handleInputChange("typeOfTopic", v)}>
                      <SelectTrigger className="h-12 bg-muted/50 border-border/50"><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>{TOPIC_TYPES.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}</SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-6">
                {/* Long description */}
                <div className="space-y-2">
                  <Label htmlFor="longDescription" className="text-foreground">Full Description</Label>
                  <Textarea id="longDescription" disabled={isReviewMode} placeholder="Detailed explanation..." value={formData.longDescription} onChange={(e) => handleInputChange("longDescription", e.target.value)} className="bg-muted/50 border-border/50 min-h-[150px]" />
                </div>
                {/* Problem & Solution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="problem" className="text-foreground">Problem</Label>
                    <Textarea id="problem" disabled={isReviewMode} placeholder="What problem does this idea solve?" value={formData.problem} onChange={(e) => handleInputChange("problem", e.target.value)} className="bg-muted/50 border-border/50 min-h-[100px]" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="solution" className="text-foreground">Solution</Label>
                    <Textarea id="solution" disabled={isReviewMode} placeholder="How does your idea solve this problem?" value={formData.solution} onChange={(e) => handleInputChange("solution", e.target.value)} className="bg-muted/50 border-border/50 min-h-[100px]" />
                  </div>
                </div>
                {/* Project status */}
                <div className="space-y-4 pt-4 border-t border-border/50">
                  <h3 className="font-semibold text-foreground">Project Status</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
                      <Label htmlFor="hasMVP" className="cursor-pointer">Has MVP?</Label>
                      <Switch id="hasMVP" disabled={isReviewMode} checked={formData.hasMVP} onCheckedChange={(c) => handleInputChange("hasMVP", c)} />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
                      <Label htmlFor="hasDetailedRoadmap" className="cursor-pointer">Has Detailed Roadmap?</Label>
                      <Switch id="hasDetailedRoadmap" disabled={isReviewMode} checked={formData.hasDetailedRoadmap} onCheckedChange={(c) => handleInputChange("hasDetailedRoadmap", c)} />
                    </div>
                    <div className={`flex items-center justify-between p-4 rounded-xl border border-border/50 ${showEvidence ? "bg-muted/10 opacity-50 cursor-not-allowed" : "bg-muted/30"}`}>
                      <Label htmlFor="isRawIdea" className={`cursor-pointer ${showEvidence ? "cursor-not-allowed" : ""}`}>Is Raw Idea?</Label>
                      <Switch id="isRawIdea" checked={formData.isRawIdea} disabled={showEvidence || isReviewMode} onCheckedChange={(c) => handleInputChange("isRawIdea", c)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Execution Readiness ({formData.executionReadiness}%)</Label>
                      <Slider disabled={isReviewMode} value={[formData.executionReadiness]} onValueChange={(v) => handleInputChange("executionReadiness", v[0])} max={100} step={5} />
                    </div>
                  </div>
                </div>
                {/* Evidence section */}
                {showEvidence && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-4 pt-4 border-t border-border/50">
                    <h3 className="font-semibold text-foreground flex items-center gap-2"><File className="w-5 h-5 text-primary" /> Evidence & Documentation</h3>
                    <div className="p-6 rounded-xl border-2 border-dashed border-primary/20 bg-primary/5">
                      {!isReviewMode && (
                        <div className="text-center mb-6">
                          <Upload className="w-10 h-10 mx-auto text-primary mb-3" />
                          <p className="text-foreground font-medium">Upload Project Files</p>
                          <p className="text-muted-foreground text-sm mt-1">DOCX, PDF, PPT, MP4, MP3, TXT (max 50MB)</p>
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
                      )}

                      {existingFiles.length > 0 && (
                        <div className="mb-6 space-y-2">
                          <p className="text-sm font-medium">Existing Files (GitHub):</p>
                          {existingFiles.map((file, index) => (
                            <div key={`existing-${index}`} className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                              <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-500" />
                                <span className="text-sm font-medium">{file.name}</span>
                                <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">View</a>
                              </div>
                              {!isReviewMode && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  type="button"
                                  onClick={() => handleDeleteExistingFile(index)}
                                  className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {uploadedFiles.length > 0 && (
                        <div className="mb-6 space-y-2">
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
                              {!isReviewMode && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  type="button"
                                  onClick={() => handleRemoveFile(index)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="evidenceNote">Additional Notes</Label>
                        <Textarea id="evidenceNote" disabled={isReviewMode} placeholder="Describe MVP features, roadmap milestones..." value={formData.evidenceNote} onChange={(e) => handleInputChange("evidenceNote", e.target.value)} className="bg-background/50" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
            {step === 3 && (
              <div className="space-y-6">
                {/* Region & Market */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="regionFeasibility" className="text-foreground flex items-center gap-2"><Globe className="w-4 h-4 text-primary" /> Region Feasibility</Label>
                    <Select disabled={isReviewMode} value={formData.regionFeasibility} onValueChange={(v) => handleInputChange("regionFeasibility", v)}>
                      <SelectTrigger className="h-12 bg-muted/50 border-border/50"><SelectValue placeholder="Select region" /></SelectTrigger>
                      <SelectContent>{REGIONS.map((r) => (<SelectItem key={r} value={r}>{r}</SelectItem>))}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="marketPotential" className="text-foreground flex items-center gap-2"><BarChart className="w-4 h-4 text-primary" /> Market Potential</Label>
                    <Input id="marketPotential" disabled={isReviewMode} placeholder="e.g., High ($10B+), Niche ($1M+)" value={formData.marketPotential} onChange={(e) => handleInputChange("marketPotential", e.target.value)} className="h-12 bg-muted/50 border-border/50" />
                  </div>
                </div>
                {/* Target audience */}
                <div className="space-y-2">
                  <Label htmlFor="targetAudience" className="text-foreground flex items-center gap-2"><Target className="w-4 h-4 text-primary" /> Target Audience</Label>
                  <Select disabled={isReviewMode} value={formData.targetAudience} onValueChange={(v) => handleInputChange("targetAudience", v)}>
                    <SelectTrigger className="h-12 bg-muted/50 border-border/50"><SelectValue placeholder="Select audience" /></SelectTrigger>
                    <SelectContent>{TARGET_AUDIENCES.map((a) => (<SelectItem key={a} value={a}>{a}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                {/* Price */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-foreground flex items-center gap-2"><DollarSign className="w-4 h-4 text-primary" /> Price (USD)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input id="price" type="number" disabled={isReviewMode} placeholder="299" value={formData.price} onChange={(e) => handleInputChange("price", e.target.value)} className="h-12 pl-10 bg-muted/50 border-border/50" />
                    </div>
                  </div>
                </div>
                {/* Investment & Partnership */}
                <div className="space-y-4 pt-4 border-t border-border/50">
                  <h3 className="font-semibold text-foreground">Investment & Partnership</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
                      <Label htmlFor="investmentReady" className="cursor-pointer">Investment Ready?</Label>
                      <Switch id="investmentReady" disabled={isReviewMode} checked={formData.investmentReady} onCheckedChange={(c) => handleInputChange("investmentReady", c)} />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
                      <Label htmlFor="lookingForPartner" className="cursor-pointer flex items-center gap-2"><Handshake className="w-4 h-4" /> Looking for Partner?</Label>
                      <Switch id="lookingForPartner" disabled={isReviewMode} checked={formData.lookingForPartner} onCheckedChange={(c) => handleInputChange("lookingForPartner", c)} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {step === 4 && (
              <div className="space-y-6">
                <div className="text-center py-8">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center"><Sparkles className="w-10 h-10 text-primary" /></div>
                  <h2 className="text-2xl font-outfit font-bold text-foreground mb-2">AI Validation</h2>
                  <p className="text-muted-foreground max-w-md mx-auto">Our AI will analyze your idea for uniqueness, market potential, and execution readiness.</p>
                </div>
                {aiValidation.status === "idle" && (
                  <div className="text-center">
                    <Button variant="hero" size="xl" onClick={handleValidate} disabled={(!isEditing && completeness < 50) || isReviewMode}>
                      <Sparkles className="w-5 h-5 mr-2" /> {isReviewMode ? "Validation Status" : "Validate My Idea"}
                    </Button>
                    {!isReviewMode && !isEditing && completeness < 50 && <p className="text-sm text-muted-foreground mt-3">Complete at least 50% of the form to validate</p>}
                  </div>
                )}
                {aiValidation.status === "validating" && (
                  <div className="text-center py-8"><div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-primary/20 border-t-primary animate-spin" /><p className="text-muted-foreground">Analyzing your idea...</p></div>
                )}
                {(aiValidation.status === "passed" || aiValidation.status === "failed") && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`rounded-xl p-6 text-center ${aiValidation.status === "passed" ? "bg-primary/10" : "bg-destructive/10"}`}>
                        <div className="text-sm text-muted-foreground mb-1">Uniqueness Score</div>
                        <div className="text-5xl font-outfit font-bold mb-2" style={{ color: aiValidation.status === "passed" ? "hsl(var(--primary))" : "hsl(var(--destructive))" }}>{aiValidation.score}%</div>
                      </div>
                      <div className="rounded-xl p-6 text-center bg-accent/10">
                        <div className="text-sm text-muted-foreground mb-1">Clarity Score</div>
                        <div className="text-5xl font-outfit font-bold mb-2 text-accent">{aiValidation.clarityScore}%</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      {aiValidation.status === "passed" ? (<><Check className="w-5 h-5 text-primary" /><span className="text-primary font-medium">Validation Passed</span></>) : (<><AlertCircle className="w-5 h-5 text-destructive" /><span className="text-destructive font-medium">Needs Improvement</span></>)}
                    </div>
                    <div className="space-y-3"><h3 className="font-medium text-foreground">AI Feedback:</h3>{aiValidation.feedback.map((f, i) => (<div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"><Check className="w-5 h-5 text-primary mt-0.5 shrink-0" /><span className="text-muted-foreground text-sm">{f}</span></div>))}</div>
                    {!isReviewMode && (
                      <div className="flex flex-col gap-3">
                        <Button variant="outline" size="xl" className="w-full" onClick={handleValidate}>
                          <Sparkles className="w-5 h-5 mr-2" /> Validate Again
                        </Button>
                        {aiValidation.status === "passed" && (
                          <Button variant="hero" size="xl" className="w-full" onClick={handleSubmitIdea}>
                            {isEditing ? "Update Idea" : "Submit to Marketplace"}
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </Button>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/50">
            <Button variant="ghost" onClick={() => setStep(step - 1)} disabled={step === 1}><ArrowLeft className="w-4 h-4 mr-2" />Previous</Button>
            {step < 4 && (<Button variant="default" onClick={() => setStep(step + 1)}>Next<ArrowRight className="w-4 h-4 ml-2" /></Button>)}
            {step === 4 && !isReviewMode && (
              <Button variant="default" onClick={handleSubmitIdea} className="bg-gradient-to-r from-primary to-secondary">
                <Sparkles className="w-4 h-4 mr-2" />
                {isEditing ? "Update Idea" : "Submit Idea to Marketplace"}
              </Button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SubmitIdea;
