import { motion } from "framer-motion";
import { Lightbulb, Search, DollarSign, Rocket, ArrowRight, Trophy, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      level: "Level 1",
      xp: "+10 XP",
      title: "Discover",
      description: "Browse thousands of AI-validated business ideas and frameworks.",
      icon: Search,
      color: "primary",
      achievement: "Explorer",
    },
    {
      id: 2,
      level: "Level 2",
      xp: "+25 XP",
      title: "Evaluate",
      description: "Check uniqueness scores, market potential, and execution roadmaps.",
      icon: Lightbulb,
      color: "secondary",
      achievement: "Analyst",
    },
    {
      id: 3,
      level: "Level 3",
      xp: "+50 XP",
      title: "Acquire",
      description: "Purchase the IP and get instant access to all assets and documentation.",
      icon: DollarSign,
      color: "accent",
      achievement: "Investor",
    },
    {
      id: 4,
      level: "Level 4",
      xp: "+100 XP",
      title: "Launch",
      description: "Use the included roadmap to build and launch your new business fast.",
      icon: Rocket,
      color: "primary",
      achievement: "Entrepreneur",
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-muted/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-border/50 -translate-y-1/2 hidden md:block" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black mb-6"
          >
            From Idea to <span className="gradient-text">Empire</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6"
          >
            Level up through our gamified entrepreneur journey. Each step unlocks new achievements!
          </motion.p>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="max-w-md mx-auto mb-2"
          >
            <div className="h-3 bg-muted rounded-full overflow-hidden border border-border">
              <div className="h-full w-0 bg-gradient-to-r from-primary via-secondary to-accent rounded-full animate-progress" style={{ animation: "progressFill 2s ease-out forwards" }} />
            </div>
          </motion.div>
          <p className="text-xs text-muted-foreground">Complete all levels to unlock <Trophy className="w-3 h-3 inline text-yellow-500" /> Master Entrepreneur Badge</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative group"
            >
              {/* Connector Arrow Desktop */}
              {index !== steps.length - 1 && (
                <div className="absolute top-8 -right-4 hidden md:block text-primary/30 group-hover:text-primary transition-colors z-0">
                  <ArrowRight className="w-8 h-8" />
                </div>
              )}

              <div className="glass-card p-6 rounded-2xl border-2 border-transparent hover:border-primary/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl h-full flex flex-col items-center text-center relative z-10 bg-card/50 backdrop-blur-sm">
                {/* Level Badge */}
                <div className="absolute -top-3 -left-3 px-3 py-1 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground text-xs font-bold shadow-lg">
                  {step.level}
                </div>

                {/* XP Badge */}
                <div className="absolute -top-3 -right-3 px-2 py-1 rounded-full bg-accent/20 text-accent text-xs font-bold border border-accent/30">
                  {step.xp}
                </div>

                {/* Icon with Pulse */}
                <div
                  className={`w-20 h-20 rounded-2xl mb-4 flex items-center justify-center transition-all duration-500 group-hover:scale-125 group-hover:rotate-6 relative ${step.color === "primary"
                    ? "bg-primary/10 text-primary glow-purple"
                    : step.color === "secondary"
                      ? "bg-secondary/10 text-secondary glow-teal"
                      : "bg-accent/10 text-accent glow-orange"
                    }`}
                >
                  <step.icon className="w-10 h-10" />
                  <div className="absolute inset-0 rounded-2xl animate-pulse opacity-0 group-hover:opacity-30 bg-current" />
                </div>

                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-grow">
                  {step.description}
                </p>

                {/* Achievement Badge */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50 text-xs">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium">{step.achievement}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Button
            size="lg"
            className="magnetic-btn rounded-xl bg-primary hover:bg-primary/90 glow-purple px-8 group"
            asChild
          >
            <Link to="/marketplace">
              Start Your Journey
              <Rocket className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground mt-3">Join 10,000+ entrepreneurs who leveled up with ida</p>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
