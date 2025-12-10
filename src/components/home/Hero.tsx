import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-32 pb-20">
      {/* Premium Mesh Gradient Background */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 mesh-gradient opacity-30 animate-pulse-soft" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Micro Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 mb-8 shadow-xl"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            <span className="text-sm font-semibold text-foreground/90 tracking-wide">
              The #1 Marketplace for Validated Ideas
            </span>
          </motion.div>

          {/* Main Headline */}
          <div className="relative mb-8 pt-8">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-6xl md:text-8xl font-black font-outfit text-foreground mb-4 tracking-tight leading-[0.9]"
            >
              Buy & Sell<br />
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-primary background-animate">Brilliant Ideas</span>
                <span className="absolute -bottom-2 left-0 w-full h-2 bg-primary/20 rounded-full blur-sm"></span>
              </span>
            </motion.h1>

            {/* Floating Elements (Re-positioned) */}
            <motion.div
              animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-8 -right-8 md:-right-20 hidden lg:block z-0"
            >
              {/* 3D-style Abstract Shape */}
              <div className="w-32 h-32 bg-gradient-to-br from-primary to-purple-600 rounded-3xl opacity-20 blur-xl animate-pulse"></div>
            </motion.div>
          </div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed font-light"
          >
            Discover, buy, and launch AI-validated business ideas.
            Skip the brainstorming and start building with <span className="text-foreground font-semibold">guaranteed market potential</span>.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                className="h-16 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-white text-lg font-bold shadow-lg shadow-primary/30 transition-all duration-300"
                asChild
              >
                <Link to="/marketplace">
                  Explore Marketplace
                </Link>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                variant="outline"
                className="h-16 px-10 rounded-2xl border-2 border-border hover:border-foreground/20 bg-transparent text-lg font-bold hover:bg-secondary/50 transition-all duration-300"
                asChild
              >
                <Link to="/submit-idea" className="flex items-center gap-2">
                  Sell an Idea
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-16 pt-8 border-t border-border/10 flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500"
          >
            {/* Add logos or stats here if needed, for opacity example */}
            <div className="text-sm font-semibold tracking-widest uppercase">Trusted by 1,000+ Founders</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
