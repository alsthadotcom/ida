import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Grid, List, Star, Shield, SlidersHorizontal, X, ArrowRight, TrendingUp, Zap } from "lucide-react";
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
import IdeaCard from "@/components/marketplace/IdeaCard";
import { fetchIdeas } from "@/services/ideaService";
import { CATEGORIES } from "@/constants/marketplace";

const categories = ["All Categories", ...CATEGORIES];



const Marketplace = () => {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Supabase state
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadIdeas = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedIdeas = await fetchIdeas();
        setIdeas(fetchedIdeas);
      } catch (err) {
        console.error('Error loading ideas:', err);
        setError('Failed to load ideas from database');
      } finally {
        setLoading(false);
      }
    };

    loadIdeas();
  }, []);

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
    const priceStr = idea.price.toString().replace(/[^0-9.]/g, '');
    const priceNum = parseFloat(priceStr) || 0;
    const matchesPrice = priceNum >= priceRange[0] && priceNum <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const handleIdeaClick = (idea: any) => {
    setSelectedIdea(idea);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <main className="pt-32 pb-20 container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12">
          <div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4 border border-primary/20"
            >
              <TrendingUp className="w-3 h-3" />
              Marketplace
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="display-lg font-outfit text-foreground mb-4"
            >
              Discover Your Next <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">Big Opportunity</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground"
            >
              Browse thousands of AI-validated business frameworks.
            </motion.p>
          </div>
        </div>

        {/* Controls Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="sticky top-24 z-30 bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-lg p-4 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by keyword, industry, or tech..."
                className="pl-12 h-12 rounded-xl bg-secondary/5 border-border/50 focus:ring-primary/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px] h-12 rounded-xl bg-secondary/5 border-border/50">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant={showFilters ? "default" : "outline"}
                onClick={() => setShowFilters(!showFilters)}
                className="h-12 rounded-xl border-border/50 px-6 gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
              </Button>

              <div className="flex items-center bg-secondary/5 rounded-xl border border-border/50 p-1 h-12">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-9 w-9 rounded-lg"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-9 w-9 rounded-lg"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-6 border-t border-border/50 mt-4 px-2">
                  <div className="flex flex-col md:flex-row justify-between gap-8">
                    <div className="flex-1 max-w-md">
                      <label className="text-sm font-bold text-foreground mb-4 block">
                        Price Range: ${priceRange[0]} - ${priceRange[1]}
                      </label>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={100000}
                        step={100}
                        className="my-4"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button variant="link" onClick={() => {
                        setPriceRange([0, 100000]);
                        setSelectedCategory("All Categories");
                        setSearchQuery("");
                      }} className="text-muted-foreground hover:text-destructive">
                        <X className="w-4 h-4 mr-2" />
                        Clear All Filters
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Area */}
        <div className="mb-8 flex items-center justify-between text-sm text-muted-foreground">
          <span>Showing {filteredIdeas.length} results</span>
          <Select defaultValue="newest">
            <SelectTrigger className="w-[140px] h-8 text-xs border-none bg-transparent hover:bg-transparent p-0 justify-end">
              <div className="flex items-center gap-2">
                <span>Sort by:</span>
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-[400px] rounded-3xl bg-secondary/10 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "flex flex-col gap-4"}>
            {filteredIdeas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} viewMode={viewMode} onClick={() => handleIdeaClick(idea)} />
            ))}
          </div>
        )}

        {!loading && filteredIdeas.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">No ideas found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your filters or search query.</p>
            <Button onClick={() => {
              setPriceRange([0, 100000]);
              setSelectedCategory("All Categories");
              setSearchQuery("");
            }}>Clear All Filters</Button>
          </div>
        )}

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
