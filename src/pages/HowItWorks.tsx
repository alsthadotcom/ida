import { motion } from "framer-motion";
import { Sparkles, Shield, Globe, Zap, Hammer, Wallet, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const steps = [
  {
    id: 1,
    title: "The Spark",
    subtitle: "Validation First",
    description: "Don't guess. Know. Input your raw concept and our diverse AI council (GPT-4, Claude, Perplexity) instantly evaluates its market viability, uniqueness, and execution readiness.",
    icon: Zap,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/20"
  },
  {
    id: 2,
    title: "The Forge",
    subtitle: "Refinement & Packaging",
    description: "Transform a simple thought into a sellable asset. Our platform helps you build a detailed roadmap, define your MVP features, and package your intellectual property for buyers.",
    icon: Hammer,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20"
  },
  {
    id: 3,
    title: "The Vault",
    subtitle: "Protection & Ownership",
    description: "Security is paramount. Your idea is timestamped and hashed using SHA-256 encryption, creating immutable proof of ownership on the blockchain before it ever hits the market.",
    icon: Shield,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20"
  },
  {
    id: 4,
    title: "The Exchange",
    subtitle: "Global Marketplace",
    description: "Your asset goes live. Investors, founders, and enterprises browse verified concepts. When a match is found, ownership transfers securely, and funds are released to your wallet.",
    icon: Globe,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20"
  }
];

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/20 relative overflow-hidden">
      <Navbar />

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-secondary/5 rounded-full blur-[120px]" />
      </div>

      <main className="pt-32 pb-20 container mx-auto px-4 max-w-6xl">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto mb-32"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 border-primary/20 text-primary uppercase tracking-widest text-xs font-bold">
            <Sparkles className="w-3 h-3" /> The Lifecycle of an Idea
          </div>
          <h1 className="text-5xl md:text-8xl font-black font-outfit text-foreground mb-8 tracking-tighter">
            From <span className="text-yellow-400">Spark</span> <br />
            to <span className="gradient-text">Sale</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We've redesigned the journey of entrepreneurship. <br />
            Turn your intellectual capital into digital assets in four steps.
          </p>
        </motion.div>

        {/* Vertical Timeline */}
        <div className="relative mb-32">
          {/* Connecting Line (Desktop) */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent hidden md:block" />

          <div className="space-y-24">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`flex flex-col md:flex-row gap-8 md:gap-16 items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Text Content */}
                <div className={`flex-1 text-center ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4 ${step.color} ${step.bg} border ${step.border}`}>
                    STEP 0{step.id}
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black font-outfit mb-4">{step.title}</h2>
                  <h3 className="text-xl text-primary font-medium mb-4">{step.subtitle}</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Center Icon */}
                <div className="relative shrink-0 z-10">
                  <div className={`w-20 h-20 rounded-2xl ${step.bg} border ${step.border} flex items-center justify-center shadow-[0_0_30px_-5px_currentColor] ${step.color}`}>
                    <step.icon className="w-10 h-10" />
                  </div>
                </div>

                {/* Spacer for layout balance */}
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="rounded-3xl bg-gradient-to-br from-primary/10 to-transparent border border-white/10 p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-grid-white/5 mask-gradient" />
          <div className="relative z-10">
            <Wallet className="w-16 h-16 mx-auto text-primary mb-6" />
            <h2 className="text-4xl md:text-5xl font-black font-outfit mb-6">Ready to Monetize Your Mind?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Join thousands of visionaries who are trading ideas like commodities.
              The future of the knowledge economy is here.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="xl" className="h-14 px-8 text-lg font-bold rounded-full shadow-lg shadow-primary/20" asChild>
                <Link to="/submit-idea">
                  Sell an Idea <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="xl" variant="outline" className="h-14 px-8 text-lg font-bold rounded-full" asChild>
                <Link to="/marketplace">
                  Browse Market
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>

      </main>

      <Footer />
    </div>
  );
};

export default HowItWorks;
