import { motion } from "framer-motion";
import { Lightbulb, Upload, Shield, CreditCard, Users, Sparkles } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const steps = [
  {
    icon: Lightbulb,
    title: "Have an Idea",
    description: "You've got a brilliant business concept, framework, or execution roadmap that could help others succeed.",
  },
  {
    icon: Upload,
    title: "Submit Your Idea",
    description: "Use our detailed form to describe your idea. Upload MVPs, roadmaps, or other evidence to boost credibility.",
  },
  {
    icon: Shield,
    title: "Get Proof of Ownership",
    description: "Your idea is timestamped and hashed with SHA-256, creating immutable proof of when you submitted it.",
  },
  {
    icon: Sparkles,
    title: "AI Evaluation",
    description: "Our AI rates your idea on Clarity, Uniqueness, Execution Readiness, and Market Potential.",
  },
  {
    icon: Users,
    title: "Reach Buyers",
    description: "Your idea gets listed in our marketplace where entrepreneurs and investors discover valuable concepts.",
  },
  {
    icon: CreditCard,
    title: "Get Paid",
    description: "When someone purchases your idea, you receive payment directly to your account. Simple as that.",
  },
];

const HowItWorks = () => {
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
              How <span className="gradient-text">ida</span> Works
            </h1>
            <p className="text-lg text-muted-foreground">
              Turn your brilliant ideas into income in just a few simple steps.
              Our platform handles validation, protection, and payments.
            </p>
          </motion.div>

          {/* Steps */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 relative"
              >
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                  {index + 1}
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-outfit font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* For Sellers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-20 max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-outfit font-bold text-foreground text-center mb-8">
              For Sellers
            </h2>
            <div className="glass-card p-8">
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <span>Submit unlimited ideas with our easy-to-use form</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <span>Set your own prices and retain full ownership until sold</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <span>Receive instant notifications when your ideas sell</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <span>Get paid directly to your connected payment method</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* For Buyers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-12 max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-outfit font-bold text-foreground text-center mb-8">
              For Buyers
            </h2>
            <div className="glass-card p-8">
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent mt-2" />
                  <span>Browse hundreds of validated, unique business ideas</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent mt-2" />
                  <span>Filter by category, price, and AI uniqueness score</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent mt-2" />
                  <span>Purchase securely with our protected checkout</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent mt-2" />
                  <span>Get full ownership rights and detailed execution plans</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HowItWorks;
