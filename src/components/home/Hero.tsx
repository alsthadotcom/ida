import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Lightbulb, DollarSign, Presentation, Building2, Globe2, Banknote, Coins } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { useState, useEffect } from "react";

// --- Custom Transformation Component ---
const DrawingTransformation = ({ initialIcon: InitialIcon, finalIcon: FinalIcon, label, isActive, x, y, rotation }: any) => {
  const [stage, setStage] = useState(0); // 0: Hidden, 1: Drawing, 2: Alive

  useEffect(() => {
    let timeouts: NodeJS.Timeout[] = [];

    if (isActive) {
      // Start sequence immediately when active
      setStage(1); // Draw
      timeouts.push(setTimeout(() => setStage(2), 500)); // Alive after 0.5s
    } else {
      // Reset when inactive
      setStage(0);
    }

    return () => timeouts.forEach(clearTimeout);
  }, [isActive]);

  return (
    <div
      className="absolute transition-all duration-1000 ease-in-out z-0 pointer-events-none"
      style={{ top: y, left: x, transform: `rotate(${rotation}deg)` }}
    >
      {/* Reduced size: w-20/h-28 mobile, w-24/h-36 desktop */}
      <div className={`relative w-20 h-28 md:w-24 md:h-36 rounded-lg backdrop-blur-md transition-all duration-500 ${stage === 2 ? 'bg-popover/90 border-primary/40 shadow-2xl scale-110 -translate-y-4 opacity-100' : 'bg-transparent border-transparent scale-95 opacity-0'}`}>

        {/* Label tag */}
        <div className={`absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground border border-primary/50 text-[8px] font-mono font-bold px-2 py-0.5 rounded-sm transition-all duration-500 ${stage === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          {label}
        </div>

        {/* Content Container */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">

          {/* Stage 1: Wireframe */}
          <div className={`absolute transition-all duration-300 ${stage === 1 ? 'opacity-100' : 'opacity-0'}`}>
            <InitialIcon className="w-6 h-6 md:w-10 md:h-10 text-zinc-500 stroke-[1]" />
            {/* Simple markers for wireframe */}
            <div className="absolute -inset-2 border border-zinc-700/30 opacity-50"></div>
          </div>

          {/* Stage 2: Alive */}
          <div className={`absolute transition-all duration-500 flex flex-col items-center ${stage === 2 ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-75 blur-sm'}`}>
            <FinalIcon className="w-8 h-8 md:w-12 md:h-12 text-primary" />
            {stage === 2 && (
              <div className="mt-3 flex flex-col items-center gap-1">
                <div className="text-[10px] font-mono text-muted-foreground">$1.2M</div>
                <div className="h-0.5 w-10 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-full animate-[pulse_1.5s_infinite]"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // Cycle through 0->1->2->3 every 3.5s
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 4);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-32 pb-20">
      {/* Premium Mesh Gradient Background */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 mesh-gradient opacity-30 animate-pulse-soft" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

      {/* Background Transformation Elements - Fixed to Viewport */}
      <div className="absolute inset-0 overflow-visible pointer-events-none z-0">
        {/* Top Left: Idea -> Money */}
        <div className="hidden lg:block">
          <DrawingTransformation
            initialIcon={Lightbulb}
            finalIcon={DollarSign}
            label="VALUATION"
            isActive={activeIndex === 0}
            x="10%"
            y="20%"
            rotation={-5}
          />
        </div>

        {/* Bottom Right: Pitch -> IPO */}
        <div className="hidden md:block">
          <DrawingTransformation
            initialIcon={Presentation}
            finalIcon={Building2}
            label="ACQUIRED"
            isActive={activeIndex === 1}
            x="80%"
            y="70%"
            rotation={5}
          />
        </div>

        {/* Top Right: Local -> Global */}
        <div className="hidden lg:block">
          <DrawingTransformation
            initialIcon={Globe2}
            finalIcon={Sparkles}
            label="UNICORN"
            isActive={activeIndex === 2}
            x="85%"
            y="15%"
            rotation={3}
          />
        </div>

        {/* Bottom Left: Contract -> Cash */}
        <div className="hidden md:block">
          <DrawingTransformation
            initialIcon={Banknote}
            finalIcon={Coins}
            label="LIQUIDITY"
            isActive={activeIndex === 3}
            x="15%"
            y="80%"
            rotation={-2}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Micro Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-secondary/20 backdrop-blur-xl border border-border mb-8 shadow-xl"
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
                className="h-16 px-10 rounded-2xl hover:opacity-90 text-primary-foreground text-lg font-bold shadow-lg shadow-primary/30 transition-all duration-300 bg-primary"
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
