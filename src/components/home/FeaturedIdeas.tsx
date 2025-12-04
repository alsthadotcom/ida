import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, TrendingUp, Zap, Star, Shield, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import IdeaDetailModal from "@/components/ui/IdeaDetailModal";
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
    <section className="py-20 md:py-32 bg-background relative overflow-hidden">
      {/* Mesh Gradient */}
      <div className="absolute inset-0 mesh-gradient opacity-30 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-secondary/20 mb-6">
            <TrendingUp className="w-4 h-4 text-secondary" />
            <span className="micro-copy text-secondary">Trending Now</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-outfit font-black text-foreground mb-4">
            Featured <span className="gradient-text">Ideas</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Hand-picked ideas validated by AI for uniqueness, market potential, and execution readiness.
          </p>
        </motion.div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {ideas.map((idea, index) => (
            <motion.div
              key={idea.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              onClick={() => handleIdeaClick(idea)}
              className={`group cursor-pointer relative bg-card/50 backdrop-blur-sm border rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${idea.color === 'primary' ? 'border-primary/20 hover:border-primary/50 hover:shadow-primary/20' :
                idea.color === 'secondary' ? 'border-secondary/20 hover:border-secondary/50 hover:shadow-secondary/20' :
                  'border-accent/20 hover:border-accent/50 hover:shadow-accent/20'
                }`}
            >
              <div className="p-6 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${idea.color === 'primary' ? 'bg-primary/10 text-primary' :
                    idea.color === 'secondary' ? 'bg-secondary/10 text-secondary' :
                      'bg-accent/10 text-accent'
                    }`}>
                    {idea.category}
                  </span>
                  {idea.badge && (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${idea.badge === 'hot' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
                      idea.badge === 'new' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                        'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                      }`}>
                      {idea.badge === 'hot' && <Zap className="w-3 h-3" />}
                      {idea.badge === 'new' && <Sparkles className="w-3 h-3" />}
                      {idea.badge === 'trending' && <TrendingUp className="w-3 h-3" />}
                      {idea.badge.charAt(0).toUpperCase() + idea.badge.slice(1)}
                    </div>
                  )}
                </div>

                {/* Title & Description */}
                <h3 className={`font-outfit font-bold text-xl mb-3 group-hover:${idea.color === 'primary' ? 'text-primary' :
                  idea.color === 'secondary' ? 'text-secondary' :
                    'text-accent'
                  } transition-colors`}>
                  {idea.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-6 line-clamp-3">
                  {idea.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 mt-auto mb-6 pt-4 border-t border-border/50">
                  <div className="flex items-center gap-1.5">
                    <Shield className={`w-4 h-4 ${idea.color === 'primary' ? 'text-primary' :
                      idea.color === 'secondary' ? 'text-secondary' :
                        'text-accent'
                      }`} />
                    <span className="text-sm font-bold">{idea.uniqueness}% Unique</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">{idea.views}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`font-outfit font-black text-2xl ${idea.color === 'primary' ? 'gradient-text' :
                      idea.color === 'secondary' ? 'text-secondary' :
                        'gradient-text-orange'
                      }`}>
                      {idea.price}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">by {idea.seller}</div>
                  </div>
                  <Button
                    size="sm"
                    className={`rounded-xl transition-all duration-300 ${idea.color === 'primary' ? 'bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground' :
                      idea.color === 'secondary' ? 'bg-secondary/10 text-secondary hover:bg-secondary hover:text-secondary-foreground' :
                        'bg-accent/10 text-accent hover:bg-accent hover:text-accent-foreground'
                      }`}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button
            size="lg"
            variant="outline"
            className="magnetic-btn text-lg px-8 py-6 rounded-2xl glass hover:border-primary/50"
            asChild
          >
            <Link to="/marketplace">
              Explore All Ideas
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </motion.div>
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
