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
        <div className="flex flex-col gap-6 mb-12">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-6xl font-black font-outfit text-foreground tracking-tight"
              >
                Marketplace
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg text-muted-foreground/80 max-w-2xl"
              >
                Discover verified business concepts, IP, and franchise opportunities ready for acquisition.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Button
                size="lg"
                className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 shadow-[0_0_20px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)] transition-all duration-300"
                asChild
              >
                <Link to="/submit-idea">
                  + Add new listing
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Controls Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
              <Input
                placeholder="Search assets, industries, or keywords..."
                className="pl-12 h-12 rounded-xl bg-card border-border/20 focus:border-primary text-foreground placeholder:text-muted-foreground/50 focus:ring-primary/20 shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 lg:pb-0">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px] h-12 rounded-xl bg-card border-border/20 text-foreground hover:border-primary/50 focus:ring-primary/20">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                className="h-12 rounded-xl border-border/20 bg-secondary/20 hover:bg-secondary/40 text-foreground gap-2 px-6"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Sort
              </Button>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={`h-12 rounded-xl border-border/20 bg-card hover:bg-secondary/40 text-foreground gap-2 px-6 hover:border-primary/50 ${showFilters ? 'border-primary text-primary bg-primary/5' : ''}`}
              >
                <Filter className="w-4 h-4" />
                Filter
              </Button>
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
                <div className="pt-6 border-t border-border/10 mt-4 px-2">
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
                      }} className="text-muted-foreground hover:text-white">
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
