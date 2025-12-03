import { motion } from "framer-motion";
import { Lightbulb, Target, Users, Shield } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const values = [
  {
    icon: Lightbulb,
    title: "Innovation First",
    description: "We believe every great company starts with a single idea. Our mission is to democratize innovation.",
  },
  {
    icon: Shield,
    title: "Trust & Security",
    description: "Your ideas are protected with blockchain-grade timestamps and secure ownership verification.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "We're building a global community of thinkers, creators, and entrepreneurs.",
  },
  {
    icon: Target,
    title: "Quality Focus",
    description: "Our AI ensures only validated, unique ideas make it to the marketplace.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-outfit font-bold text-foreground mb-6">
              About <span className="gradient-text">ida</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              We're building the world's first marketplace for validated business ideas, 
              frameworks, and execution roadmaps.
            </p>
          </motion.div>

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-8 md:p-12 max-w-4xl mx-auto mb-16"
          >
            <h2 className="text-2xl font-outfit font-bold text-foreground mb-4 text-center">
              Our Mission
            </h2>
            <p className="text-muted-foreground text-center text-lg">
              To create a world where brilliant ideas never go to waste. We connect 
              visionary thinkers with ambitious builders, ensuring every great concept 
              has the chance to become reality.
            </p>
          </motion.div>

          {/* Values */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="glass-card p-6"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-outfit font-semibold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Story */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-2xl font-outfit font-bold text-foreground mb-6 text-center">
              Our Story
            </h2>
            <div className="glass-card p-8 space-y-4 text-muted-foreground">
              <p>
                ida was born from a simple observation: millions of brilliant ideas die 
                every day simply because the people who have them don't have the time, 
                resources, or expertise to bring them to life.
              </p>
              <p>
                At the same time, countless entrepreneurs and investors are desperately 
                searching for their next big opportunity. We saw an opportunity to bridge 
                this gap.
              </p>
              <p>
                By combining AI-powered validation with blockchain-grade ownership proof, 
                we've created a trusted marketplace where ideas can finally reach their 
                full potential.
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
