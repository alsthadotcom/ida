import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { validateIdea } from "@/services/aiService";
import { createIdea, fetchIdeaById, updateIdea } from "@/services/ideaService";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Sparkles, ArrowRight, ArrowLeft, Upload, Check, AlertCircle, Trash2, FileText, Zap, DollarSign, X, CheckCircle2, Link2, Plus, Package, Monitor } from "lucide-react";
import { CATEGORIES, TOPIC_TYPES, TARGET_AUDIENCES, REGIONS } from "@/constants/marketplace";
import PuterLogin from "@/components/auth/PuterLogin";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CategoryDropdown } from "@/components/ui/CategoryDropdown";
import { suggestCategory } from "@/services/aiService";

// --- Types ---
interface FormData {
  title: string;
  category: string;
  shortDescription: string;
  longDescription: string;
  problem: string;
  solution: string;
  targetAudience: string;
  regionFeasibility: string;
  price: string;
  hasMVP: boolean;
  mvpType: "none" | "physical" | "digital";
  mvpUrls: string[];
  isRawIdea: boolean;
  executionReadiness: number;
  marketPotential: string;
  evidenceNote: string;
  githubRepoUrl: string;
}

const MAX_FILES = 5;
const MAX_URLS = 5;

const INITIAL_DATA: FormData = {
  title: "",
  category: "",
  shortDescription: "",
  longDescription: "",
  problem: "",
  solution: "",
  targetAudience: "",
  regionFeasibility: "",
  price: "",
  hasMVP: false,
  mvpType: "none",
  mvpUrls: [],
  isRawIdea: true,
  executionReadiness: 20,
  marketPotential: "",
  evidenceNote: "",
  githubRepoUrl: ""
};

const SubmitIdea = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const ideaId = searchParams.get("id");
  const isEditing = !!ideaId;

  // State
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [platformToken, setPlatformToken] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<any[]>([]);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [showMvpTypeDialog, setShowMvpTypeDialog] = useState(false);
  const [newUrl, setNewUrl] = useState("");

  // Migration State (Category AI)
  const [categoryMode, setCategoryMode] = useState<'Manual' | 'AI'>('Manual');
  const [isSuggestingCategory, setIsSuggestingCategory] = useState(false);

  // File Upload State
  const [mainDocument, setMainDocument] = useState<File | null>(null);
  const [additionalDocuments, setAdditionalDocuments] = useState<File[]>([]);
  const [mvpMediaFiles, setMvpMediaFiles] = useState<File[]>([]);
  const [existingMainDocUrl, setExistingMainDocUrl] = useState<string | null>(null);
  const [existingAdditionalDocs, setExistingAdditionalDocs] = useState<string[]>([]);
  const [existingMvpMedia, setExistingMvpMedia] = useState<{ url: string, type: 'image' | 'video' }[]>([]);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // Load Platform Token
  useEffect(() => {
    const loadToken = async () => {
      const { data } = await supabase.from('platform_settings').select('value').eq('key', 'github_token').single();
      if (data) setPlatformToken(data.value);
    };
    loadToken();
  }, []);

  // Load Existing Idea
  useEffect(() => {
    if (ideaId) {
      const loadIdea = async () => {
        const idea = await fetchIdeaById(ideaId);
        if (idea) {
          setFormData({
            title: idea.title || "",
            category: idea.category || "",
            shortDescription: idea.description?.substring(0, 200) || "",
            longDescription: idea.description || "",
            problem: "", // Not stored separately currently
            solution: "",
            targetAudience: idea.target_audience || "",
            regionFeasibility: idea.region_feasibility || "",
            price: idea.price?.replace('$', '') || "",
            hasMVP: idea.has_mvp || false,
            mvpType: (idea.mvp_type as "none" | "physical" | "digital") || "none",
            mvpUrls: idea.mvp_urls || [],
            isRawIdea: idea.is_raw_idea || false,
            executionReadiness: idea.execution_readiness || 20,
            marketPotential: idea.market_potential || "",
            evidenceNote: idea.evidence_note || "",
            githubRepoUrl: idea.github_repo_url || ""
          });

          // Mock validation result for editing
          setValidationResult({
            status: 'passed',
            score: idea.uniqueness || 80,
            feedback: ["Existing idea loaded."]
          });

          // Load files
          // Legacy support or new fields
          if (idea.document_url) setExistingMainDocUrl(idea.document_url);

          const addDocs = [];
          if (idea.additional_doc_1) addDocs.push(idea.additional_doc_1);
          if (idea.additional_doc_2) addDocs.push(idea.additional_doc_2);
          if (idea.additional_doc_3) addDocs.push(idea.additional_doc_3);
          setExistingAdditionalDocs(addDocs);

          const mvpMedia = [];
          if (idea.physical_mvp_image) mvpMedia.push({ url: idea.physical_mvp_image, type: 'image' as const });
          if (idea.physical_mvp_video) mvpMedia.push({ url: idea.physical_mvp_video, type: 'video' as const });
          setExistingMvpMedia(mvpMedia);

          // Legacy MVP URL handling
          if (idea.mvp_file_urls && !idea.physical_mvp_image && !idea.digital_mvp) {
            const files = idea.mvp_file_urls.split(',').filter(Boolean).map((url: string) => ({
              name: decodeURIComponent(url.split('/').pop() || 'file'),
              url,
              type: url.match(/\.(mp4|mov|webm)$/i) ? 'video' : 'image'
            }));
            // Just treat them as MVP media for now if type matches, or leave as existingFiles for legacy display
            setExistingFiles(files);
          }
          if (idea.digital_mvp) {
            handleInput('mvpUrls', [idea.digital_mvp]); // Or handle separately
          }
        }
      };
      loadIdea();
    }
  }, [ideaId]);

  // Handlers
  const handleInput = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMVPToggle = (checked: boolean) => {
    handleInput('hasMVP', checked);
    if (!checked) {
      handleInput('mvpType', 'none');
      setUploadedFiles([]);
      handleInput('mvpUrls', []);
    }
  };

  const handleMVPTypeSelect = (type: "physical" | "digital") => {
    handleInput('mvpType', type);
  };

  const handleAddUrl = () => {
    if (!newUrl.trim()) {
      toast({ title: "Invalid URL", description: "Please enter a valid URL", variant: "destructive" });
      return;
    }

    if (formData.mvpUrls.length >= MAX_URLS) {
      toast({ title: "Limit Reached", description: `Maximum ${MAX_URLS} URLs allowed`, variant: "destructive" });
      return;
    }

    handleInput('mvpUrls', [...formData.mvpUrls, newUrl.trim()]);
    setNewUrl("");
  };

  const handleRemoveUrl = (index: number) => {
    handleInput('mvpUrls', formData.mvpUrls.filter((_, i) => i !== index));
  };

  const handleValidate = async () => {
    if (!formData.title || !formData.shortDescription) {
      toast({ title: "Incomplete", description: "Please enter a title and description.", variant: "destructive" });
      return;
    }

    setIsValidating(true);
    try {
      const result = await validateIdea(formData);

      // Auto-fill suggestions if valid
      if (result.metrics?.uniqueness > 50) {
        setValidationResult({
          status: 'passed',
          score: result.metrics.uniqueness,
          metrics: result.metrics,
          analysis: result.summary,
          market: result.market_validation
        });

        // Auto-fill future steps
        setFormData(prev => ({
          ...prev,
          marketPotential: result.market_validation?.potential || prev.marketPotential,
          targetAudience: prev.targetAudience || "Entrepreneurs", // Fallback logic could be smarter
          category: result.category?.recommended || prev.category
        }));

        toast({ title: "Validation Successful!", description: "Your idea has potential. Proceed to details." });
        // Optional: Auto-advance
        // setStep(2); 
      } else {
        setValidationResult({
          status: 'failed',
          score: result.metrics?.uniqueness || 0,
          feedback: ["Idea needs more uniqueness."]
        });
        toast({ title: "Validation Warning", description: "Uniqueness score is low. Consider refining.", variant: "destructive" });
      }

    } catch (error: any) {
      if (error.message === "NOT_AUTHENTICATED") setShowAuthPrompt(true);
      else toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsValidating(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setUploadedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({ title: "Login Required", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      // 1. Upload Primary Document
      let documentUrl = existingMainDocUrl;
      if (mainDocument) {
        const { uploadEvidenceFiles } = await import('@/services/ideaService');
        // We use uploadEvidenceFiles but it returns array, we take first. 
        // Ideally we should have a specific bucket or path, but reusing evidence bucket is fine.
        const urls = await uploadEvidenceFiles([mainDocument], `docs-${Date.now()}`); // using specific prefix if possible or just ideaId logic later
        documentUrl = urls[0];
      }

      // 2. Upload Additional Docs
      let newAdditionalUrls: string[] = [];
      if (additionalDocuments.length > 0) {
        const { uploadEvidenceFiles } = await import('@/services/ideaService');
        newAdditionalUrls = await uploadEvidenceFiles(additionalDocuments, `add-docs-${Date.now()}`);
      }

      // Combine with existing
      const finalAdditionalDocs = [...existingAdditionalDocs, ...newAdditionalUrls];

      // 3. Upload MVP Media
      let mvpMediaUrls: string[] = existingMvpMedia.map(m => m.url);
      if (mvpMediaFiles.length > 0) {
        const { uploadEvidenceFiles } = await import('@/services/ideaService');
        const urls = await uploadEvidenceFiles(mvpMediaFiles, `mvp-${Date.now()}`);
        mvpMediaUrls = [...mvpMediaUrls, ...urls];
      }

      // Legacy / Digital MVP URLs
      let finalMvpFileUrls = mvpMediaUrls.join(',');

      // If Digital, use URLs from state
      if (formData.mvpType === 'digital') {
        // If we have manual URLs for digital MVP
        // We might store them in mvp_urls or mvp_file_urls depending on schema. 
        // ideaService maps mvpUrls -> (not mapped in createIdea? It uses mvpFileUrls). 
        // We should probably map valid URLs to mvp_file_urls or a new field if available.
        // Looking at ideaService, it uses `mvp_file_urls: ideaData.mvpFileUrls`.
        // So let's join them.
        finalMvpFileUrls = [...mvpMediaUrls, ...formData.mvpUrls].join(',');
      }

      const payload = {
        ...formData,
        description: formData.longDescription, // Map back
        uniqueness: validationResult?.score || 0,

        // New Fields Mapped
        documentUrl: documentUrl,
        additionalDoc1: finalAdditionalDocs[0] || null,
        additionalDoc2: finalAdditionalDocs[1] || null,
        additionalDoc3: finalAdditionalDocs[2] || null,

        mvpType: formData.mvpType,
        physicalMvpImage: (formData.mvpType === 'physical' && mvpMediaUrls.length > 0) ? mvpMediaUrls[0] : null, // First image as main
        physicalMvpVideo: (formData.mvpType === 'physical' && mvpMediaUrls.find(u => u.match(/\.(mp4|mov|webm)$/i))) || null, // First video

        mvpFileUrls: finalMvpFileUrls,

        // AI Scores
        aiScores: validationResult?.metrics ? {
          metrics: validationResult.metrics,
          market: validationResult.market,
          analysis: validationResult.analysis
        } : null
      };

      if (isEditing && ideaId) {
        await updateIdea(ideaId, payload);
        toast({ title: "Idea Updated!" });
      } else {
        await createIdea(payload);
        toast({ title: "Idea Launched!" });
      }

      setTimeout(() => navigate('/marketplace'), 1500);

    } catch (error: any) {
      console.error(error);
      toast({ title: "Submission Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Render Steps ---

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-12">
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4].map(s => (
          <div key={s} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step === s ? 'bg-primary text-primary-foreground scale-110 shadow-lg shadow-primary/25' : step > s ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
              {step > s ? <Check className="w-5 h-5" /> : s}
            </div>
            {s < 4 && <div className={`w-12 h-1 rounded-full mx-2 ${step > s ? 'bg-primary/20' : 'bg-muted'}`} />}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      <Navbar />

      <main className="pt-32 pb-20 container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <h1 className="text-4xl font-black font-outfit mb-4">
            {isEditing ? "Refine Your Asset" : "Launch Your Idea"}
          </h1>
          <p className="text-muted-foreground">
            step {step} of 4: {
              step === 1 ? "The Pitch" :
                step === 2 ? "The Details" :
                  step === 3 ? "The Assets" :
                    "AI Validation & Launch"
            }
          </p>
        </motion.div>

        {renderStepIndicator()}

        <div className="glass-card p-8 md:p-12 min-h-[500px] relative overflow-hidden">
          <AnimatePresence mode="wait">
            {/* STEP 1: THE PITCH */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold font-outfit">The Pitch</h2>
                  <p className="text-muted-foreground">Start by telling us about your brilliant idea.</p>
                </div>

                <div className="space-y-4">
                  <Label>Project Title <span className="text-destructive">*</span></Label>
                  <Input placeholder="e.g. Uber for Dog Walking" value={formData.title} onChange={e => handleInput('title', e.target.value)} className="h-14 text-lg bg-background/50" />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label>Category <span className="text-destructive">*</span></Label>

                    {/* Category Mode Toggles */}
                    <div className="flex bg-muted/50 border rounded-lg p-1 gap-1 mb-2 max-w-sm">
                      <button
                        type="button"
                        onClick={() => setCategoryMode('Manual')}
                        className={`flex-1 py-1.5 text-xs font-medium rounded transition-all ${categoryMode === 'Manual' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                      >
                        Manual
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          setCategoryMode('AI');
                          if (formData.title && formData.shortDescription) {
                            setIsSuggestingCategory(true);
                            const cat = await suggestCategory(formData.title, formData.shortDescription);
                            handleInput('category', cat);
                            setIsSuggestingCategory(false);
                          } else if (!formData.title) {
                            toast({ title: "Title Required", description: "Please enter a title for AI suggestion.", variant: "destructive" });
                          }
                        }}
                        className={`flex-1 py-1.5 text-xs font-medium rounded flex items-center justify-center gap-1.5 transition-all ${categoryMode === 'AI' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                      >
                        <Sparkles className="w-3 h-3" />
                        {isSuggestingCategory ? "Analyzing..." : "AI Suggest"}
                      </button>
                    </div>

                    {categoryMode === 'Manual' ? (
                      <CategoryDropdown
                        value={formData.category}
                        onChange={(v) => handleInput('category', v)}
                        className="w-full"
                      />
                    ) : (
                      <div className="relative">
                        <Input
                          value={formData.category || (isSuggestingCategory ? "Analyzing..." : "Select Manual or Click AI Suggest")}
                          readOnly
                          className={`h-12 bg-primary/5 border-primary/20 text-primary font-medium ${isSuggestingCategory ? 'animate-pulse' : ''}`}
                        />
                        {categoryMode === 'AI' && !isSuggestingCategory && !formData.category && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Enter a Title and Pitch, then click AI Suggest.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <Label>Region <span className="text-destructive">*</span></Label>
                    <Select value={formData.regionFeasibility} onValueChange={v => handleInput('regionFeasibility', v)}>
                      <SelectTrigger className="h-12 bg-background/50"><SelectValue placeholder="Global?" /></SelectTrigger>
                      <SelectContent>{REGIONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Elevator Pitch (Short Description) <span className="text-destructive">*</span></Label>
                  <Textarea
                    placeholder="Describe your idea in one compelling paragraph..."
                    value={formData.shortDescription}
                    onChange={e => handleInput('shortDescription', e.target.value)}
                    className="min-h-[120px] bg-background/50 text-base"
                  />
                </div>

                {/* Continue Button */}
                <div className="flex justify-end pt-6">
                  <Button
                    onClick={() => setStep(2)}
                    disabled={!formData.title || !formData.category || !formData.regionFeasibility || !formData.shortDescription}
                    size="lg"
                    className="min-w-[200px] rounded-full"
                  >
                    Continue <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>

                {(!formData.title || !formData.category || !formData.regionFeasibility || !formData.shortDescription) && (
                  <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Please complete all required fields (*) to continue
                  </p>
                )}
              </motion.div>
            )}

            {/* STEP 2: THE DETAILS */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold font-outfit">The Deep Dive</h2>
                  <Button variant="ghost" size="sm" onClick={() => setStep(1)}>Back</Button>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <Label>The Problem</Label>
                    <Textarea placeholder="What pain point are you solving?" value={formData.problem} onChange={e => handleInput('problem', e.target.value)} className="bg-background/50 min-h-[150px]" />
                  </div>
                  <div className="space-y-4">
                    <Label>The Solution</Label>
                    <Textarea placeholder="How does your idea solve it?" value={formData.solution} onChange={e => handleInput('solution', e.target.value)} className="bg-background/50 min-h-[150px]" />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Full Description (Markdown supported)</Label>
                  <Textarea placeholder="Go into detail..." value={formData.longDescription} onChange={e => handleInput('longDescription', e.target.value)} className="bg-background/50 min-h-[200px]" />
                </div>

                <Button onClick={() => setStep(3)} className="w-full h-14 text-lg rounded-full">Next: Assets</Button>
              </motion.div>
            )}

            {/* STEP 3: ASSETS & PRICING */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold font-outfit">Assets & Value</h2>
                  <Button variant="ghost" size="sm" onClick={() => setStep(2)}>Back</Button>
                </div>

                <div className="space-y-6">
                  <Label className="text-lg">Asking Price (USD)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input type="number" value={formData.price} onChange={e => handleInput('price', e.target.value)} className="pl-10 h-16 text-2xl font-bold bg-background/50" placeholder="5000" />
                  </div>
                  {/* AI Price Estimate Placeholder */}
                </div>

                <div className="border-t border-border/50 pt-8 space-y-6">

                  {/* PROSPECTUS / DOCUMENT UPLOAD - NEW */}
                  <div className="space-y-4">
                    <Label className="text-lg flex items-center gap-2">
                      Primary Document (Prospectus) <span className="text-destructive">*</span>
                      <span className="text-xs font-normal text-muted-foreground">(PDF, Max 10MB)</span>
                    </Label>

                    {(mainDocument || existingMainDocUrl) ? (
                      <div className="flex items-center justify-between bg-primary/5 px-4 py-3 rounded-lg border border-primary/20">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-primary" />
                          <span className="text-sm font-medium truncate max-w-[200px]">
                            {mainDocument ? mainDocument.name : 'Existing Document'}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                          onClick={() => { setMainDocument(null); setExistingMainDocUrl(null); }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="relative">
                        <input
                          type="file"
                          accept="application/pdf,image/png,image/jpeg"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          onChange={(e) => {
                            if (e.target.files?.[0]) setMainDocument(e.target.files[0]);
                          }}
                        />
                        <div className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors rounded-xl p-8 text-center bg-background/30">
                          <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                          <p className="text-sm font-medium">Click to upload Prospectus</p>
                          <p className="text-xs text-muted-foreground mt-1">Required for listing</p>
                        </div>
                      </div>
                    )}

                    {/* Additional Documents */}
                    <div className="pt-2">
                      <Label className="text-sm text-muted-foreground mb-2 block">Additional Documents (Optional, Max 3)</Label>
                      <div className="space-y-2">
                        {existingAdditionalDocs.map((doc, i) => (
                          <div key={`ex-${i}`} className="flex justify-between items-center bg-muted/30 px-3 py-2 rounded border border-border/50">
                            <span className="text-xs text-muted-foreground">Existing Doc {i + 1}</span>
                            <X className="w-3 h-3 cursor-pointer text-muted-foreground hover:text-destructive" onClick={() => setExistingAdditionalDocs(prev => prev.filter((_, idx) => idx !== i))} />
                          </div>
                        ))}
                        {additionalDocuments.map((doc, i) => (
                          <div key={`new-${i}`} className="flex justify-between items-center bg-muted/30 px-3 py-2 rounded border border-border/50">
                            <span className="text-xs font-medium">{doc.name}</span>
                            <X className="w-3 h-3 cursor-pointer text-muted-foreground hover:text-destructive" onClick={() => setAdditionalDocuments(prev => prev.filter((_, idx) => idx !== i))} />
                          </div>
                        ))}

                        {(additionalDocuments.length + existingAdditionalDocs.length < 3) && (
                          <div className="relative inline-block">
                            <input
                              type="file"
                              accept="application/pdf"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              onChange={(e) => {
                                if (e.target.files?.[0]) setAdditionalDocuments([...additionalDocuments, e.target.files[0]]);
                              }}
                            />
                            <Button variant="outline" size="sm" className="text-xs h-7 gap-1">
                              <Plus className="w-3 h-3" /> Add Document
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* MVP SECTION */}
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <Label className="text-lg">Do you have an MVP?</Label>
                    <Switch checked={formData.hasMVP} onCheckedChange={handleMVPToggle} />
                  </div>

                  {formData.hasMVP && (
                    <div className="bg-muted/10 border border-border/50 rounded-xl p-6 animate-in fade-in slide-in-from-top-4">
                      <div className="flex gap-4 mb-6">
                        <div
                          onClick={() => handleMVPTypeSelect('physical')}
                          className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center gap-2 ${formData.mvpType === 'physical' ? 'border-primary bg-primary/5' : 'border-border bg-background hover:bg-muted/20'}`}
                        >
                          <Package className={`w-6 h-6 ${formData.mvpType === 'physical' ? 'text-primary' : 'text-muted-foreground'}`} />
                          <span className="font-bold text-sm">Physical Product</span>
                        </div>
                        <div
                          onClick={() => handleMVPTypeSelect('digital')}
                          className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center gap-2 ${formData.mvpType === 'digital' ? 'border-primary bg-primary/5' : 'border-border bg-background hover:bg-muted/20'}`}
                        >
                          <Monitor className={`w-6 h-6 ${formData.mvpType === 'digital' ? 'text-primary' : 'text-muted-foreground'}`} />
                          <span className="font-bold text-sm">Digital / SaaS</span>
                        </div>
                      </div>

                      {formData.mvpType === 'physical' && (
                        <div className="space-y-4">
                          <Label>Upload Photos/Videos of Product</Label>
                          <div className="relative border-2 border-dashed border-muted-foreground/25 rounded-xl p-6 text-center">
                            <input
                              type="file"
                              multiple
                              accept="image/*,video/*"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              onChange={(e) => {
                                if (e.target.files) setMvpMediaFiles(Array.from(e.target.files));
                              }}
                            />
                            <p className="text-sm text-muted-foreground">Click to upload media</p>
                          </div>
                          {/* Preview Files */}
                          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                            {[...existingMvpMedia, ...mvpMediaFiles.map(f => ({ url: URL.createObjectURL(f), name: f.name }))].map((f, i) => (
                              <div key={i} className="px-2 py-1 bg-background border rounded flex items-center gap-2">
                                Media {i + 1}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {formData.mvpType === 'digital' && (
                        <div className="space-y-4">
                          <Label>Project URL / Demo Link</Label>
                          <div className="flex gap-2">
                            <Input
                              placeholder="https://..."
                              value={newUrl}
                              onChange={e => setNewUrl(e.target.value)}
                            />
                            <Button onClick={handleAddUrl} size="icon"><Plus className="w-4 h-4" /></Button>
                          </div>
                          <div className="space-y-2 mt-2">
                            {formData.mvpUrls.map((url, i) => (
                              <div key={i} className="flex justify-between items-center bg-muted/30 px-3 py-2 rounded text-sm">
                                <span className="truncate max-w-[200px]">{url}</span>
                                <X className="w-3 h-3 cursor-pointer hover:text-destructive" onClick={() => handleRemoveUrl(i)} />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <Button onClick={() => setStep(4)} className="w-full h-14 text-lg rounded-full">Next: Final Review</Button>
              </motion.div>
            )}

            {/* STEP 4: AI VALIDATION & REVIEW */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold font-outfit">AI Validation & Final Review</h2>
                  <Button variant="ghost" size="sm" onClick={() => setStep(3)}>Back</Button>
                </div>

                {/* AI Validation Section */}
                {!validationResult ? (
                  <div className="space-y-8">
                    <div className="text-center bg-primary/5 border border-primary/10 rounded-2xl p-8">
                      <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Sparkles className="w-10 h-10 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">Validate Your Idea with AI</h3>
                      <p className="text-muted-foreground max-w-md mx-auto mb-8">
                        Our AI will analyze your idea for uniqueness, market potential, and execution readiness before launch.
                      </p>

                      <Button
                        onClick={handleValidate}
                        disabled={isValidating}
                        size="lg"
                        className="min-w-[250px] gap-2 rounded-full text-lg h-14 shadow-lg shadow-primary/20"
                      >
                        {isValidating ? <Sparkles className="animate-spin" /> : <Sparkles />}
                        {isValidating ? "Analyzing..." : "Validate with AI"}
                      </Button>

                      <p className="text-xs text-muted-foreground mt-6">Powered by GPT-5.1 & Perplexity & More</p>

                      {/* Skip Option */}
                      <div className="pt-6 border-t border-border/50 mt-8">
                        <p className="text-sm text-muted-foreground mb-4">Want to skip validation?</p>
                        <Button
                          onClick={() => setValidationResult({ status: 'skipped', score: 0 })}
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-foreground"
                        >
                          Skip & Continue to Launch <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {showAuthPrompt && (
                      <div className="max-w-md mx-auto">
                        <PuterLogin />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Validation Results */}
                    {validationResult.status !== 'skipped' && (
                      <div className="bg-primary/5 border border-primary/10 rounded-2xl p-8">
                        <div className="flex flex-col md:flex-row items-center gap-8 mb-6">
                          {/* Overall Score with Ring */}
                          <div className="relative shrink-0 flex flex-col items-center">
                            <div className="relative w-32 h-32 flex items-center justify-center">
                              {/* Simple SVG Ring for Overall Score */}
                              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-background" />
                                <circle
                                  cx="50" cy="50" r="40"
                                  stroke="currentColor" strokeWidth="8"
                                  fill="transparent"
                                  strokeDasharray={`${2 * Math.PI * 40}`}
                                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - (validationResult.score / 100))}`}
                                  className="text-primary transition-all duration-1000 ease-out"
                                  strokeLinecap="round"
                                />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-black text-primary">{validationResult.score}</span>
                                <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Overall</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex-1 space-y-4">
                            <h3 className="font-bold text-xl flex items-center justify-center md:justify-start gap-2">
                              {validationResult.status === 'passed' ? <CheckCircle2 className="text-green-500" /> : <AlertCircle className="text-yellow-500" />}
                              {validationResult.status === 'passed' ? "Great Potential!" : "Needs Refinement"}
                            </h3>
                            <p className="text-muted-foreground">{validationResult.analysis || validationResult.feedback?.[0]}</p>

                            {/* Individual Metrics if available */}
                            {validationResult.metrics && (
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                                {[
                                  { l: 'Uniqueness', v: validationResult.metrics.uniqueness },
                                  { l: 'Feasibility', v: validationResult.metrics.feasibility },
                                  { l: 'Clarity', v: validationResult.metrics.clarity },
                                  { l: 'Executability', v: validationResult.metrics.executability },
                                ].map(m => (
                                  <div key={m.l} className="bg-background/40 p-3 rounded-lg text-center border">
                                    <div className="text-lg font-bold text-foreground">{m.v}</div>
                                    <div className="text-[10px] uppercase text-muted-foreground">{m.l}</div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <Button
                          onClick={handleValidate}
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          Re-validate
                        </Button>
                      </div>
                    )}

                    {/* Idea Summary */}
                    <div className="bg-background/50 border rounded-2xl p-8">
                      <h3 className="text-xl font-bold mb-6">Your Idea Summary</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-bold text-lg">{formData.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{formData.shortDescription}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-black text-primary">${formData.price}</div>
                            <div className="text-xs text-muted-foreground">Asking Price</div>
                          </div>
                        </div>

                        {/* Files Summary */}
                        <div className="space-y-2 pt-4 border-t border-border/50">
                          <span className="text-xs font-semibold text-muted-foreground">Assets Included:</span>
                          <div className="flex flex-wrap gap-2">
                            {mainDocument && <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded text-xs border border-blue-500/20">Prospectus</span>}
                            {additionalDocuments.length > 0 && <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded text-xs border border-blue-500/20">+{additionalDocuments.length} Docs</span>}
                            {formData.hasMVP && <span className="px-2 py-1 bg-purple-500/10 text-purple-500 rounded text-xs border border-purple-500/20">MVP ({formData.mvpType})</span>}
                            {mvpMediaFiles.length > 0 && <span className="px-2 py-1 bg-purple-500/10 text-purple-500 rounded text-xs border border-purple-500/20">+{mvpMediaFiles.length} Media</span>}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-4 border-t border-border/50">
                          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">{formData.category}</span>
                          <span className="px-3 py-1 bg-background rounded-full text-xs border">{formData.regionFeasibility}</span>
                          {validationResult.status !== 'skipped' && (
                            <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-medium">
                              AI Score: {validationResult.score}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Launch Buttons */}
                    <div className="flex gap-4 pt-4">
                      <Button variant="outline" size="lg" className="flex-1 rounded-full" onClick={() => setStep(3)}>
                        Edit Details
                      </Button>
                      <Button
                        size="lg"
                        className="flex-[2] rounded-full text-lg shadow-xl shadow-primary/20"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Launching..." : "Confirm & Launch 🚀"}
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </main>
      <Footer />
    </div>
  );
};

export default SubmitIdea;
