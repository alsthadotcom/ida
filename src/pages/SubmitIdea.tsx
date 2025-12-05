import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createIdea } from "@/services/ideaService";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
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
  const [aiValidation, setAiValidation] = useState({
    status: "idle" as "idle" | "validating" | "passed" | "failed",
    score: 0,
    clarityScore: 0,
    feedback: [] as string[],
  });

  const handleInputChange = (field: string, value: any) => {
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

  const handleValidate = () => {
    setAiValidation({ status: "validating", score: 0, clarityScore: 0, feedback: [] });
    setTimeout(() => {
      const score = Math.floor(Math.random() * 20) + 80;
      const clarity = Math.floor(Math.random() * 15) + 85;
      setAiValidation({
        status: score >= 70 ? "passed" : "failed",
        score,
        clarityScore: clarity,
        feedback: [
          "High originality detected - no similar ideas found",
          "Clear problem‑solution framework",
          "Target audience well‑defined",
          "Execution roadmap could be more detailed",
        ],
      });
    }, 2000);
  };
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

  const completeness = calculateCompleteness();
  const showEvidence = formData.hasMVP || formData.hasDetailedRoadmap;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Link to="/marketplace" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Marketplace
            </Link>
            <h1 className="text-3xl md:text-4xl font-outfit font-bold text-foreground mb-2">Submit Your Idea</h1>
            <p className="text-muted-foreground">Share your unique business idea and start earning.</p>
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
                  <Input id="title" placeholder="e.g., AI‑Powered Customer Onboarding System" value={formData.title} onChange={(e) => handleInputChange("title", e.target.value)} className="h-12 bg-muted/50 border-border/50" />
                </div>
                {/* Short description */}
                <div className="space-y-2">
                  <Label htmlFor="shortDescription" className="text-foreground flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" /> Short Description
                  </Label>
                  <Textarea id="shortDescription" placeholder="A brief summary (max 200 chars)" maxLength={200} value={formData.shortDescription} onChange={(e) => handleInputChange("shortDescription", e.target.value)} className="bg-muted/50 border-border/50 min-h-[100px]" />
                  <p className="text-xs text-muted-foreground text-right">{formData.shortDescription.length}/200</p>
                </div>
                {/* Topic Type (Badge) */}
                <div className="space-y-2">
                  <Label htmlFor="typeOfTopic" className="text-foreground flex items-center gap-2">
                    <Zap className="w-4 h-4 text-accent" /> Topic Type
                  </Label>
                  <Select value={formData.typeOfTopic} onValueChange={(v) => handleInputChange("typeOfTopic", v)}>
                    <SelectTrigger className="h-12 bg-muted/50 border-border/50"><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>{TOPIC_TYPES.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                {/* Category & Topic Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-foreground flex items-center gap-2">
                      <Tag className="w-4 h-4 text-primary" /> Category
                    </Label>
                    <Select value={formData.category} onValueChange={(v) => handleInputChange("category", v)}>
                      <SelectTrigger className="h-12 bg-muted/50 border-border/50"><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>{CATEGORIES.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="typeOfTopic" className="text-foreground flex items-center gap-2">
                      <Zap className="w-4 h-4 text-accent" /> Topic Type
                    </Label>
                    <Select value={formData.typeOfTopic} onValueChange={(v) => handleInputChange("typeOfTopic", v)}>
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
                  <Textarea id="longDescription" placeholder="Detailed explanation..." value={formData.longDescription} onChange={(e) => handleInputChange("longDescription", e.target.value)} className="bg-muted/50 border-border/50 min-h-[150px]" />
                </div>
                {/* Problem & Solution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="problem" className="text-foreground">Problem</Label>
                    <Textarea id="problem" placeholder="What problem does this idea solve?" value={formData.problem} onChange={(e) => handleInputChange("problem", e.target.value)} className="bg-muted/50 border-border/50 min-h-[100px]" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="solution" className="text-foreground">Solution</Label>
                    <Textarea id="solution" placeholder="How does your idea solve this problem?" value={formData.solution} onChange={(e) => handleInputChange("solution", e.target.value)} className="bg-muted/50 border-border/50 min-h-[100px]" />
                  </div>
                </div>
                {/* Project status */}
                <div className="space-y-4 pt-4 border-t border-border/50">
                  <h3 className="font-semibold text-foreground">Project Status</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
                      <Label htmlFor="hasMVP" className="cursor-pointer">Has MVP?</Label>
                      <Switch id="hasMVP" checked={formData.hasMVP} onCheckedChange={(c) => handleInputChange("hasMVP", c)} />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
                      <Label htmlFor="hasDetailedRoadmap" className="cursor-pointer">Has Detailed Roadmap?</Label>
                      <Switch id="hasDetailedRoadmap" checked={formData.hasDetailedRoadmap} onCheckedChange={(c) => handleInputChange("hasDetailedRoadmap", c)} />
                    </div>
                    <div className={`flex items-center justify-between p-4 rounded-xl border border-border/50 ${showEvidence ? "bg-muted/10 opacity-50 cursor-not-allowed" : "bg-muted/30"}`}>
                      <Label htmlFor="isRawIdea" className={`cursor-pointer ${showEvidence ? "cursor-not-allowed" : ""}`}>Is Raw Idea?</Label>
                      <Switch id="isRawIdea" checked={formData.isRawIdea} onCheckedChange={(c) => handleInputChange("isRawIdea", c)} disabled={showEvidence} />
                    </div>
                    <div className="space-y-2">
                      <Label>Execution Readiness ({formData.executionReadiness}%)</Label>
                      <Slider value={[formData.executionReadiness]} onValueChange={(v) => handleInputChange("executionReadiness", v[0])} max={100} step={5} />
                    </div>
                  </div>
                </div>
                {/* Evidence section */}
                {showEvidence && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-4 pt-4 border-t border-border/50">
                    <h3 className="font-semibold text-foreground flex items-center gap-2"><File className="w-5 h-5 text-primary" /> Evidence & Documentation</h3>
                    <div className="p-6 rounded-xl border-2 border-dashed border-primary/20 bg-primary/5">
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
                              <Button
                                variant="ghost"
                                size="sm"
                                type="button"
                                onClick={() => handleRemoveFile(index)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="evidenceNote">Additional Notes</Label>
                        <Textarea id="evidenceNote" placeholder="Describe MVP features, roadmap milestones..." value={formData.evidenceNote} onChange={(e) => handleInputChange("evidenceNote", e.target.value)} className="bg-background/50" />
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
                    <Select value={formData.regionFeasibility} onValueChange={(v) => handleInputChange("regionFeasibility", v)}>
                      <SelectTrigger className="h-12 bg-muted/50 border-border/50"><SelectValue placeholder="Select region" /></SelectTrigger>
                      <SelectContent>{REGIONS.map((r) => (<SelectItem key={r} value={r}>{r}</SelectItem>))}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="marketPotential" className="text-foreground flex items-center gap-2"><BarChart className="w-4 h-4 text-primary" /> Market Potential</Label>
                    <Input id="marketPotential" placeholder="e.g., High ($10B+), Niche ($1M+)" value={formData.marketPotential} onChange={(e) => handleInputChange("marketPotential", e.target.value)} className="h-12 bg-muted/50 border-border/50" />
                  </div>
                </div>
                {/* Target audience */}
                <div className="space-y-2">
                  <Label htmlFor="targetAudience" className="text-foreground flex items-center gap-2"><Target className="w-4 h-4 text-primary" /> Target Audience</Label>
                  <Select value={formData.targetAudience} onValueChange={(v) => handleInputChange("targetAudience", v)}>
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
                      <Input id="price" type="number" placeholder="299" value={formData.price} onChange={(e) => handleInputChange("price", e.target.value)} className="h-12 pl-10 bg-muted/50 border-border/50" />
                    </div>
                  </div>
                </div>
                {/* Investment & Partnership */}
                <div className="space-y-4 pt-4 border-t border-border/50">
                  <h3 className="font-semibold text-foreground">Investment & Partnership</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
                      <Label htmlFor="investmentReady" className="cursor-pointer">Investment Ready?</Label>
                      <Switch id="investmentReady" checked={formData.investmentReady} onCheckedChange={(c) => handleInputChange("investmentReady", c)} />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
                      <Label htmlFor="lookingForPartner" className="cursor-pointer flex items-center gap-2"><Handshake className="w-4 h-4" /> Looking for Partner?</Label>
                      <Switch id="lookingForPartner" checked={formData.lookingForPartner} onCheckedChange={(c) => handleInputChange("lookingForPartner", c)} />
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
                    <Button variant="hero" size="xl" onClick={handleValidate} disabled={completeness < 50}>
                      <Sparkles className="w-5 h-5 mr-2" /> Validate My Idea
                    </Button>
                    {completeness < 50 && <p className="text-sm text-muted-foreground mt-3">Complete at least 50% of the form to validate</p>}
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
                    {aiValidation.status === "passed" && (<Button variant="hero" size="xl" className="w-full" onClick={handleSubmitIdea}>Submit to Marketplace<ArrowRight className="w-5 h-5 ml-2" /></Button>)}
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/50">
            <Button variant="ghost" onClick={() => setStep(step - 1)} disabled={step === 1}><ArrowLeft className="w-4 h-4 mr-2" />Previous</Button>
            {step < 4 && (<Button variant="default" onClick={() => setStep(step + 1)}>Next<ArrowRight className="w-4 h-4 ml-2" /></Button>)}
            {step === 4 && (<Button variant="default" onClick={handleSubmitIdea} className="bg-gradient-to-r from-primary to-secondary"><Sparkles className="w-4 h-4 mr-2" />Submit Idea to Marketplace</Button>)}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SubmitIdea;
