import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Lightbulb,
  FileText,
  Users,
  Tag,
  Upload,
  Sparkles,
  Check,
  AlertCircle,
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

const categories = [
  "SaaS",
  "E-commerce",
  "Marketing",
  "Startup",
  "Finance",
  "Health & Wellness",
  "Education",
  "Entertainment",
  "AI/ML",
  "Mobile App",
];

const SubmitIdea = () => {
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
  });
  const [aiValidation, setAiValidation] = useState<{
    status: "idle" | "validating" | "passed" | "failed";
    score: number;
    feedback: string[];
  }>({
    status: "idle",
    score: 0,
    feedback: [],
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateCompleteness = () => {
    const fields = Object.values(formData);
    const filledFields = fields.filter((f) => f.length > 0).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const handleValidate = () => {
    setAiValidation({ status: "validating", score: 0, feedback: [] });
    
    // Simulate AI validation
    setTimeout(() => {
      const score = Math.floor(Math.random() * 20) + 80; // 80-99
      setAiValidation({
        status: score >= 70 ? "passed" : "failed",
        score,
        feedback: [
          "High originality detected - no similar ideas found",
          "Clear problem-solution framework",
          "Target audience well-defined",
          "Execution roadmap could be more detailed",
        ],
      });
    }, 2000);
  };

  const completeness = calculateCompleteness();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Marketplace
            </Link>
            <h1 className="text-3xl md:text-4xl font-outfit font-bold text-foreground mb-2">
              Submit Your Idea
            </h1>
            <p className="text-muted-foreground">
              Share your unique business idea and start earning.
            </p>
          </motion.div>

          {/* Progress Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-xl p-4 mb-8"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">Idea Completeness</span>
              <span className="text-sm text-primary font-semibold">{completeness}%</span>
            </div>
            <Progress value={completeness} className="h-2" />
          </motion.div>

          {/* Step Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            {[
              { num: 1, label: "Basic Info", icon: Lightbulb },
              { num: 2, label: "Details", icon: FileText },
              { num: 3, label: "Validate", icon: Sparkles },
            ].map((s, index) => (
              <div key={s.num} className="flex items-center">
                <button
                  onClick={() => setStep(s.num)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    step === s.num
                      ? "bg-primary text-primary-foreground"
                      : step > s.num
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <s.icon className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm font-medium">{s.label}</span>
                </button>
                {index < 2 && (
                  <div className={`w-8 h-0.5 mx-2 ${step > s.num ? "bg-primary" : "bg-border"}`} />
                )}
              </div>
            ))}
          </motion.div>

          {/* Form Steps */}
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-card rounded-2xl p-6 md:p-8"
          >
            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-foreground flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-primary" />
                    Idea Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g., AI-Powered Customer Onboarding System"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="h-12 bg-muted/50 border-border/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortDescription" className="text-foreground flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    Short Description
                  </Label>
                  <Textarea
                    id="shortDescription"
                    placeholder="A brief summary of your idea (max 200 characters)"
                    value={formData.shortDescription}
                    onChange={(e) => handleInputChange("shortDescription", e.target.value)}
                    maxLength={200}
                    className="bg-muted/50 border-border/50 min-h-[100px]"
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {formData.shortDescription.length}/200
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-foreground flex items-center gap-2">
                      <Tag className="w-4 h-4 text-primary" />
                      Category
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleInputChange("category", value)}
                    >
                      <SelectTrigger className="h-12 bg-muted/50 border-border/50">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-foreground">Price (USD)</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="e.g., 299"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      className="h-12 bg-muted/50 border-border/50"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="longDescription" className="text-foreground">
                    Full Description
                  </Label>
                  <Textarea
                    id="longDescription"
                    placeholder="Provide a detailed explanation of your idea, including the framework, methodology, or roadmap..."
                    value={formData.longDescription}
                    onChange={(e) => handleInputChange("longDescription", e.target.value)}
                    className="bg-muted/50 border-border/50 min-h-[150px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetAudience" className="text-foreground flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    Target Audience
                  </Label>
                  <Textarea
                    id="targetAudience"
                    placeholder="Who would benefit from this idea? Be specific about demographics, industries, or roles..."
                    value={formData.targetAudience}
                    onChange={(e) => handleInputChange("targetAudience", e.target.value)}
                    className="bg-muted/50 border-border/50 min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="problem" className="text-foreground">Problem</Label>
                    <Textarea
                      id="problem"
                      placeholder="What problem does this idea solve?"
                      value={formData.problem}
                      onChange={(e) => handleInputChange("problem", e.target.value)}
                      className="bg-muted/50 border-border/50 min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="solution" className="text-foreground">Solution</Label>
                    <Textarea
                      id="solution"
                      placeholder="How does your idea solve this problem?"
                      value={formData.solution}
                      onChange={(e) => handleInputChange("solution", e.target.value)}
                      className="bg-muted/50 border-border/50 min-h-[100px]"
                    />
                  </div>
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <Label className="text-foreground">Attachments (Optional)</Label>
                  <div className="border-2 border-dashed border-border/50 rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground text-sm">
                      Drag & drop files here, or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PDF, DOCX, Images (max 10MB)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center py-8">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-primary" />
                  </div>
                  <h2 className="text-2xl font-outfit font-bold text-foreground mb-2">
                    AI Validation
                  </h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Our AI will analyze your idea for uniqueness, market potential, and execution readiness.
                  </p>
                </div>

                {aiValidation.status === "idle" && (
                  <div className="text-center">
                    <Button
                      variant="hero"
                      size="xl"
                      onClick={handleValidate}
                      disabled={completeness < 50}
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      Validate My Idea
                    </Button>
                    {completeness < 50 && (
                      <p className="text-sm text-muted-foreground mt-3">
                        Complete at least 50% of the form to validate
                      </p>
                    )}
                  </div>
                )}

                {aiValidation.status === "validating" && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                    <p className="text-muted-foreground">Analyzing your idea...</p>
                  </div>
                )}

                {(aiValidation.status === "passed" || aiValidation.status === "failed") && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Score */}
                    <div className={`rounded-xl p-6 text-center ${
                      aiValidation.status === "passed" ? "bg-primary/10" : "bg-destructive/10"
                    }`}>
                      <div className="text-5xl font-outfit font-bold mb-2" style={{
                        color: aiValidation.status === "passed" 
                          ? "hsl(var(--primary))" 
                          : "hsl(var(--destructive))"
                      }}>
                        {aiValidation.score}%
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        {aiValidation.status === "passed" ? (
                          <>
                            <Check className="w-5 h-5 text-primary" />
                            <span className="text-primary font-medium">Validation Passed</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-5 h-5 text-destructive" />
                            <span className="text-destructive font-medium">Needs Improvement</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Feedback */}
                    <div className="space-y-3">
                      <h3 className="font-medium text-foreground">AI Feedback:</h3>
                      {aiValidation.feedback.map((item, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                          <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                          <span className="text-muted-foreground text-sm">{item}</span>
                        </div>
                      ))}
                    </div>

                    {/* Submit Button */}
                    {aiValidation.status === "passed" && (
                      <Button variant="hero" size="xl" className="w-full">
                        Submit to Marketplace
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    )}
                  </motion.div>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/50">
              <Button
                variant="ghost"
                onClick={() => setStep(step - 1)}
                disabled={step === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              {step < 3 && (
                <Button
                  variant="default"
                  onClick={() => setStep(step + 1)}
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SubmitIdea;
