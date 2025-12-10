import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, TrendingUp, Zap, Shield, Eye, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import IdeaDetailModal from "@/components/ui/IdeaDetailModal";
import IdeaCard from "@/components/marketplace/IdeaCard";
import { fetchFeaturedIdeas } from "@/services/ideaService";

const FeaturedIdeas = () => {
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadIdeas = async () => {
      try {
        setLoading(true);
        const fetchedIdeas = await fetchFeaturedIdeas(6);
        setIdeas(fetchedIdeas);
      } catch (err) {
        console.error('Error loading ideas:', err);
        setError('Failed to load ideas');
      } finally {
        setLoading(false);
      }
    };

    loadIdeas();
  }, []);

  const handleIdeaClick = (idea: any) => {
    setSelectedIdea(idea);
    setIsModalOpen(true);
  };

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Mesh Gradient */}
      <div className="absolute inset-0 mesh-gradient opacity-20 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6"
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Market Trends</span>
            </div>
            <h2 className="display-lg font-outfit text-foreground mb-4">
              Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">Opportunities</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Hand-picked ideas validated by AI for uniqueness, market potential, and execution readiness.
            </p>
          </div>
          <Button variant="outline" className="hidden md:flex rounded-xl border-2" asChild>
            <Link to="/marketplace">View All Listings</Link>
          </Button>
        </motion.div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {ideas.map((idea, index) => (
            <motion.div
              key={idea.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="h-full"
            >
              <IdeaCard idea={idea} onClick={() => handleIdeaClick(idea)} />
            </motion.div>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="md:hidden text-center">
          <Button size="lg" className="w-full rounded-xl" asChild>
            <Link to="/marketplace">View All Listings</Link>
          </Button>
        </div>
      </div>

      <IdeaDetailModal
        idea={selectedIdea}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </section>
  );
};

export default FeaturedIdeas;
