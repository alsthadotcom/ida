import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Grid, List, Star, Shield, SlidersHorizontal, X } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import IdeaDetailModal from "@/components/ui/IdeaDetailModal";

const categories = [
  "All Categories",
  "SaaS",
  "E-commerce",
  "Marketing",
  "Startup",
  "Finance",
  "Health & Wellness",
  "Education",
  "Entertainment",
  "Mobile",
  "AI",
  "Content",
];

const ideas = [
  {
    id: 1,
    title: "AI-Powered SaaS Onboarding Framework",
    description: "Complete framework for implementing AI-driven user onboarding that increases activation by 40%.",
    price: "$299",
    uniqueness: 94,
    rating: 5,
    category: "SaaS",
    seller: "Alex Chen",
    status: "Hot",
    color: "primary",
  },
  {
    id: 2,
    title: "Sustainable E-commerce Blueprint",
    description: "End-to-end business model for launching an eco-friendly e-commerce brand.",
    price: "$449",
    uniqueness: 87,
    rating: 4,
    category: "E-commerce",
    seller: "Sarah Park",
    status: "New",
    color: "secondary",
  },
  {
    id: 3,
    title: "Community-Led Growth Playbook",
    description: "Proven strategies for building and monetizing online communities.",
    price: "$199",
    uniqueness: 91,
    rating: 5,
    category: "Marketing",
    seller: "Marcus Johnson",
    status: "Trending",
    color: "accent",
  },
  {
    id: 4,
    title: "Micro-SaaS Validation Toolkit",
    description: "Step-by-step validation process for micro-SaaS ideas with templates.",
    price: "$149",
    uniqueness: 82,
    rating: 4,
    category: "Startup",
    seller: "Emma Wilson",
    status: "Popular",
    color: "primary",
  },
  {
    id: 5,
    title: "Creator Economy Monetization Guide",
    description: "Comprehensive framework for creators to diversify revenue streams.",
    price: "$179",
    uniqueness: 88,
    rating: 5,
    category: "Marketing",
    seller: "Jordan Lee",
    status: "New",
    color: "secondary",
  },
  {
    id: 6,
    title: "FinTech MVP Development Roadmap",
    description: "Technical and regulatory roadmap for launching a FinTech product.",
    price: "$599",
    uniqueness: 96,
    rating: 5,
    category: "Finance",
    seller: "Rachel Kim",
    status: "Hot",
    color: "accent",
  },
  {
    id: 7,
    title: "Mental Health App Framework",
    description: "Complete UX and feature framework for building mental health applications.",
    price: "$349",
    uniqueness: 89,
    rating: 4,
    category: "Health & Wellness",
    seller: "Dr. Michael Scott",
    status: "Popular",
    color: "primary",
  },
  {
    id: 8,
    title: "EdTech Gamification System",
    description: "Engagement framework using game mechanics for educational platforms.",
    price: "$279",
    uniqueness: 85,
    rating: 5,
    category: "Education",
    seller: "Lisa Wang",
    status: "Trending",
    color: "secondary",
  },
];

const UniquenessRing = ({ score, size = "sm" }: { score: number; size?: "sm" | "md" }) => {
  const dimensions = size === "sm" ? { w: 48, r: 20, stroke: 3 } : { w: 64, r: 28, stroke: 4 };
  const circumference = 2 * Math.PI * dimensions.r;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${size === "sm" ? "w-12 h-12" : "w-16 h-16"}`}>
      <svg className={`${size === "sm" ? "w-12 h-12" : "w-16 h-16"}`} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={dimensions.w / 2}
          cy={dimensions.w / 2}
          r={dimensions.r}
          stroke="hsl(var(--muted))"
          strokeWidth={dimensions.stroke}
          fill="none"
        />
        <circle
          cx={dimensions.w / 2}
          cy={dimensions.w / 2}
          r={dimensions.r}
          stroke="hsl(var(--primary))"
          strokeWidth={dimensions.stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      <span className={`absolute ${size === "sm" ? "text-xs" : "text-sm"} font-bold text-foreground`}>{score}%</span>
    </div>
  );
};

const IdeaCard = ({ idea, viewMode, onClick }: { idea: typeof ideas[0]; viewMode: "grid" | "list"; onClick: () => void }) => {
  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={onClick}
        className="idea-card group cursor-pointer"
      >
        <div className="p-4 flex items-center gap-6">
          <UniquenessRing score={idea.uniqueness} size="md" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                {idea.category}
              </span>
              <Shield className="w-3.5 h-3.5 text-accent" />
            </div>
            <h3 className="font-outfit font-semibold text-foreground group-hover:text-primary transition-colors truncate">
              {idea.title}
            </h3>
            <p className="text-muted-foreground text-sm truncate">{idea.description}</p>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < idea.rating ? "text-secondary fill-secondary" : "text-muted-foreground"}`}
              />
            ))}
          </div>
          <div className="text-right">
            <div className="text-xl font-outfit font-bold text-foreground">{idea.price}</div>
            <div className="text-xs text-muted-foreground">by {idea.seller}</div>
          </div>
          <Button variant="glass" size="sm">View</Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="idea-card group cursor-pointer"
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
            {idea.category}
          </span>
          <div className="flex items-center gap-1">
            <Shield className="w-4 h-4 text-accent" />
          </div>
        </div>
        <h3 className="text-base font-outfit font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {idea.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{idea.description}</p>
        <div className="flex items-center gap-3 mb-4">
          <UniquenessRing score={idea.uniqueness} />
          <div>
            <div className="text-xs text-muted-foreground mb-0.5">AI Score</div>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${i < idea.rating ? "text-secondary fill-secondary" : "text-muted-foreground"}`}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div>
            <div className="text-xl font-outfit font-bold text-foreground">{idea.price}</div>
            <div className="text-xs text-muted-foreground">by {idea.seller}</div>
          </div>
          <Button variant="glass" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
            View
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const Marketplace = () => {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Read category from URL params
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam && categories.includes(categoryParam)) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  const filteredIdeas = ideas.filter((idea) => {
    const matchesSearch = idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || idea.category === selectedCategory;
    const priceNum = parseInt(idea.price.replace('$', ''));
    const matchesPrice = priceNum >= priceRange[0] && priceNum <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const handleIdeaClick = (idea: any) => {
    setSelectedIdea(idea);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-outfit font-bold text-foreground mb-2">
              Idea Marketplace
            </h1>
            <p className="text-muted-foreground">
              Discover unique business ideas, frameworks, and execution roadmaps.
            </p>
          </motion.div>

          {/* Search & Filters Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-xl p-4 mb-6"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search ideas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-muted/50 border-border/50 h-11"
                />
              </div>

              {/* Category Select */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full lg:w-48 bg-muted/50 border-border/50 h-11">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Filter Toggle */}
              <Button
                variant={showFilters ? "default" : "outline"}
                className="lg:w-auto"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </Button>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-4 mt-4 border-t border-border/50"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Price Range: ${priceRange[0]} - ${priceRange[1]}
                    </label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={1000}
                      step={10}
                      className="w-full"
                    />
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => {
                    setPriceRange([0, 1000]);
                    setSelectedCategory("All Categories");
                    setSearchQuery("");
                  }}>
                    <X className="w-4 h-4 mr-1" />
                    Clear Filters
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Results Count */}
          <div className="mb-4 text-sm text-muted-foreground">
            Showing {filteredIdeas.length} ideas
          </div>

          {/* Ideas Grid/List */}
          <div className={viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            : "flex flex-col gap-4"
          }>
            {filteredIdeas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} viewMode={viewMode} onClick={() => handleIdeaClick(idea)} />
            ))}
          </div>

          {/* Empty State */}
          {filteredIdeas.length === 0 && (
            <div className="text-center py-16">
              <div className="text-muted-foreground mb-4">No ideas found matching your criteria.</div>
              <Button variant="outline" onClick={() => {
                setPriceRange([0, 1000]);
                setSelectedCategory("All Categories");
                setSearchQuery("");
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />

      <IdeaDetailModal
        idea={selectedIdea}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
};

export default Marketplace;
