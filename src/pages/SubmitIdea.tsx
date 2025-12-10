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
          if (idea.mvp_file_urls) {
            const files = idea.mvp_file_urls.split(',').filter(Boolean).map((url: string) => ({
              name: decodeURIComponent(url.split('/').pop() || 'file'),
              url
            }));
            setExistingFiles(files);
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
    if (checked) {
      setShowMvpTypeDialog(true);
    } else {
      handleInput('hasMVP', false);
      handleInput('mvpType', 'none');
      setUploadedFiles([]);
      handleInput('mvpUrls', []);
    }
  };

  const handleMVPTypeSelect = (type: "physical" | "digital") => {
    handleInput('hasMVP', true);
    handleInput('mvpType', type);
    setShowMvpTypeDialog(false);
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
      // Upload Files logic (Simulated/Imported)
      let fileUrls: string[] = existingFiles.map(f => f.url);

      if (uploadedFiles.length > 0) {
        const { uploadMVPFilesToGitHub } = await import('@/services/githubService');
        const res = await uploadMVPFilesToGitHub(user.id, formData.title, uploadedFiles, platformToken);
        fileUrls = [...fileUrls, ...res.fileUrls];
      }

      const payload = {
        ...formData,
        description: formData.longDescription, // Map back
        uniqueness: validationResult?.score || 0,
        mvpFileUrls: fileUrls.join(',')
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
      toast({ title: "Submission Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Render Steps ---

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-12">
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5, 6].map(s => (
          <div key={s} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step === s ? 'bg-primary text-primary-foreground scale-110 shadow-lg shadow-primary/25' : step > s ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
              {step > s ? <Check className="w-5 h-5" /> : s}
            </div>
            {s < 6 && <div className={`w-12 h-1 rounded-full mx-2 ${step > s ? 'bg-primary/20' : 'bg-muted'}`} />}
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
            step {step} of 6: {
              step === 1 ? "The Pitch" :
                step === 2 ? "The Details" :
                  step === 3 ? "The Assets" :
                    step === 4 ? "AI Validation" :
                      step === 5 ? "Value & Pricing" :
                        "Final Review"
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
                    <Select value={formData.category} onValueChange={v => handleInput('category', v)}>
                      <SelectTrigger className="h-12 bg-background/50"><SelectValue placeholder="Select..." /></SelectTrigger>
                      <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
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
                  <div className="flex items-center gap-4 text-sm text-muted-foreground bg-primary/5 p-4 rounded-xl">
                    <Zap className="w-4 h-4 text-primary" />
                    AI estimated value based on your score: <span className="font-bold text-primary">$1,500 - $8,000</span>
                  </div>
                </div>

                <div className="border-t border-border/50 pt-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg">Do you have an MVP?</Label>
                    <Switch checked={formData.hasMVP} onCheckedChange={c => handleInput('hasMVP', c)} />
                  </div>

                  <div className="border-2 border-dashed border-primary/20 rounded-2xl p-8 text-center bg-background/30 hover:bg-background/50 transition-colors">
                    <Upload className="w-12 h-12 mx-auto text-primary mb-4" />
                    <h3 className="font-bold mb-2">Upload Evidence</h3>
                    <p className="text-muted-foreground text-sm mb-4">Drag & drop or click to upload files (PDF, Video, Mockups)</p>
                    <Input type="file" multiple className="max-w-xs mx-auto" onChange={handleFileUpload} />

                    {uploadedFiles.length > 0 && (
                      <div className="mt-6 flex flex-wrap gap-2 justify-center">
                        {uploadedFiles.map((f, i) => (
                          <div key={i} className="flex items-center gap-2 px-3 py-1 bg-background rounded-full border text-xs">
                            {f.name} <X className="w-3 h-3 cursor-pointer" onClick={() => setUploadedFiles(prev => prev.filter((_, idx) => idx !== i))} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
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
                        <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                          <div className="relative shrink-0">
                            <div className="w-24 h-24 rounded-full flex items-center justify-center bg-background border-4 border-primary/20 text-3xl font-black text-primary">
                              {validationResult.score}
                            </div>
                          </div>
                          <div className="flex-1 space-y-2 text-center md:text-left">
                            <h3 className="font-bold text-xl flex items-center justify-center md:justify-start gap-2">
                              {validationResult.status === 'passed' ? <CheckCircle2 className="text-green-500" /> : <AlertCircle className="text-yellow-500" />}
                              {validationResult.status === 'passed' ? "Great Potential!" : "Needs Refinement"}
                            </h3>
                            <p className="text-muted-foreground">{validationResult.analysis || validationResult.feedback?.[0]}</p>
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
