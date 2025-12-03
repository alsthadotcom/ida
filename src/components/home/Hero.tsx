import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-24 pb-16">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 mesh-gradient opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Micro Badge - Keep at top */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-primary uppercase tracking-wider">
              AI-Validated Marketplace
            </span>
          </motion.div>

          {/* Headline with Floating Badges */}
          <div className="relative mb-6">
            {/* Hot Ideas Badge - Left with Float Animation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{
                opacity: 1,
                x: 0,
                y: [0, -10, 0],
              }}
              transition={{
                opacity: { duration: 0.6, delay: 0.3 },
                x: { duration: 0.6, delay: 0.3 },
                y: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }
              }}
              className="absolute -left-4 md:-left-16 lg:-left-24 top-6 md:top-12 z-10"
            >
              <div className="px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs md:text-sm font-bold shadow-lg shadow-orange-500/50 rotate-[-8deg] hover:rotate-0 hover:scale-110 transition-all cursor-default whitespace-nowrap">
                🔥 Hot Ideas
              </div>
            </motion.div>

            {/* New Ideas Badge - Right with Float Animation */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{
                opacity: 1,
                x: 0,
                y: [0, -15, 0],
              }}
              transition={{
                opacity: { duration: 0.6, delay: 0.4 },
                x: { duration: 0.6, delay: 0.4 },
                y: {
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.7
                }
              }}
              className="absolute -right-4 md:-right-16 lg:-right-24 top-2 md:top-8 z-10"
            >
              <div className="px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs md:text-sm font-bold shadow-lg shadow-green-500/50 rotate-[8deg] hover:rotate-0 hover:scale-110 transition-all cursor-default whitespace-nowrap">
                ✨ New Ideas
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight"
            >
              Buy & Sell
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent animate-pulse-slow">
                Brilliant Ideas
              </span>
            </motion.h1>
          </div>

          {/* Description (30% smaller) */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            The world's first marketplace for AI-validated business frameworks,
            execution roadmaps, and unique ideas.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                className="magnetic-btn text-base px-8 py-6 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/50 animate-glow"
                asChild
              >
                <Link to="/marketplace">
                  Explore Ideas
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </motion.div>

            <Button
              size="lg"
              variant="outline"
              className="magnetic-btn text-base px-8 py-6 rounded-2xl glass"
              asChild
            >
              <Link to="/submit-idea">Sell Your Idea</Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};

export default Hero;
