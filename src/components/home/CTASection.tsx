import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Rocket } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { useAuth } from "@/context/AuthContext";

const CTASection = () => {
  const { user } = useAuth();

  return (
    <section className="py-24 md:py-32 relative overflow-hidden flex items-center justify-center">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-background to-primary/5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse-slow" />

      {/* Decorative Rings */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-accent/10 rounded-full animate-[spin_60s_linear_infinite]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] border border-primary/10 rounded-full animate-[spin_45s_linear_infinite_reverse]" />
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-8 backdrop-blur-sm">
            <Rocket className="w-4 h-4 text-accent" />
            <span className="text-sm font-bold text-accent tracking-wide uppercase">
              Join the new economy
            </span>
          </div>

          {/* Headline */}
          <h2 className="display-xl font-outfit text-foreground mb-6">
            Ready to Monetize Your <br />
            <span className="bg-gradient-to-r from-accent via-orange-500 to-accent bg-clip-text text-transparent">
              Intellectual Capital?
            </span>
          </h2>

          {/* Description */}
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Don't let your brilliant ideas gather dust. List them on Ida today and get paid for your creativity without writing a single line of code.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                className="h-16 px-12 rounded-full bg-accent hover:bg-accent/90 text-white text-lg font-bold shadow-xl shadow-accent/25 hover:shadow-accent/40 transition-all duration-300"
                asChild
              >
                <Link to={user ? "/submit-idea" : "/login"}>
                  Start Selling Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                variant="outline"
                className="h-16 px-12 rounded-full border-2 border-foreground/10 hover:border-foreground/30 bg-background/50 backdrop-blur-md text-lg font-bold transition-all duration-300"
                asChild
              >
                <Link to="/marketplace">
                  Browse Operations
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Trust Text */}
          <div className="mt-12 flex items-center justify-center gap-6 text-sm font-medium text-muted-foreground/80">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>AI Validated</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-muted-foreground/50" />
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              <span>Secure Ownership</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-muted-foreground/50" />
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              <span>Instant Transfer</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
