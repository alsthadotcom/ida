import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, X, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const plans = [
  {
    name: "Starter",
    price: { monthly: "$0", yearly: "$0" },
    description: "Perfect for testing the waters and browsing ideas.",
    features: [
      "Access to public marketplace",
      "Submit up to 1 idea for validation",
      "Basic market data",
      "Community support",
    ],
    cta: "Start Free",
    href: "/signup",
    popular: false,
    gradient: "from-slate-500/10 to-slate-500/5",
  },
  {
    name: "Creator Pro",
    price: { monthly: "$29", yearly: "$24" },
    period: "per month",
    description: "Everything you need to buy, sell, and validate ideas seriously.",
    features: [
      "Unlimited idea submissions",
      "Advanced AI Valuation & Scoring",
      "Full IP ownership transfer tools",
      "Priority listing placement",
      "Detailed market analysis reports",
      "Zero transaction fees (Limited time)",
    ],
    cta: "Start Free Trial",
    href: "/signup?plan=pro",
    popular: true,
    gradient: "from-primary/20 to-emerald-500/20",
  },
  {
    name: "Agency",
    price: { monthly: "$99", yearly: "$79" },
    period: "per month",
    description: "For incubators, studios, and serial entrepreneurs.",
    features: [
      "Everything in Pro",
      "Team collaboration (up to 5)",
      "White-label reports",
      "API Access for automation",
      "Dedicated account manager",
      "Custom legal templates",
    ],
    cta: "Contact Sales",
    href: "/contact",
    popular: false,
    gradient: "from-orange-500/10 to-amber-500/5",
  },
];

const faqs = [
  {
    question: "Can I cancel my subscription at any time?",
    answer: "Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period."
  },
  {
    question: "How does the AI validation work?",
    answer: "Our AI analyzes millions of data points, including market trends, competitor density, and search volume to give you an objective score of your idea's potential."
  },
  {
    question: "Do you take a commission on sales?",
    answer: "Free plan users pay a 15% platform fee on sales. Pro and Agency users currently enjoy 0% transaction fees."
  },
  {
    question: "Is the IP transfer legally binding?",
    answer: "Yes. We generate standard legal contracts for every transaction. However, we always recommend consulting with your own legal counsel for high-value transfers."
  }
];

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      <Navbar />

      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] left-[20%] w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-accent/5 rounded-full blur-[100px]" />
      </div>

      <main className="pt-32 pb-20 relative z-10">
        <div className="container mx-auto px-4">

          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6"
            >
              <Sparkles className="w-3 h-3" />
              Unlock Full Potential
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl font-black font-outfit text-foreground mb-6"
            >
              Simple Pricing, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">Serious Value.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground mb-10"
            >
              Start for free, upgrade when you're ready to scale.
            </motion.p>

            {/* Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-4"
            >
              <span className={`text-sm font-semibold transition-colors ${!isAnnual ? "text-foreground" : "text-muted-foreground"}`}>Monthly</span>
              <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
              <span className={`text-sm font-semibold transition-colors ${isAnnual ? "text-foreground" : "text-muted-foreground"}`}>
                Yearly <span className="ml-1.5 inline-block text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">-20%</span>
              </span>
            </motion.div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-32 items-center">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-8 rounded-[2rem] border transition-all duration-300 ${plan.popular
                    ? "bg-background/80 backdrop-blur-xl border-primary/50 shadow-2xl shadow-primary/10 scale-105 z-10"
                    : "glass-card border-border/50 hover:border-primary/20 bg-background/40"
                  }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-gradient-to-r from-primary to-emerald-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 fill-current" />
                      MOST POPULAR
                    </div>
                  </div>
                )}

                {/* Card Header */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold font-outfit mb-2">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground min-h-[40px]">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-8 flex items-baseline gap-1">
                  <span className="text-5xl font-black font-outfit text-foreground tracking-tight">
                    {isAnnual ? plan.price.yearly : plan.price.monthly}
                  </span>
                  {plan.price.monthly !== "$0" && (
                    <span className="text-muted-foreground font-medium">/mo</span>
                  )}
                </div>

                {/* CTA */}
                <Button
                  className={`w-full h-12 rounded-xl text-base font-bold mb-8 transition-all duration-300 ${plan.popular
                      ? "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25"
                      : "bg-secondary/10 hover:bg-secondary/20 text-foreground border border-border/10"
                    }`}
                  variant={plan.popular ? "default" : "outline"}
                  asChild
                >
                  <Link to={plan.href}>{plan.cta}</Link>
                </Button>

                {/* Features */}
                <div className="space-y-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">What's included</div>
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3 text-sm">
                      <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${plan.popular ? "bg-emerald-500/20 text-emerald-500" : "bg-secondary/20 text-muted-foreground"}`}>
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span className="text-foreground/80">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-outfit mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">Everything you need to know about billing and plans.</p>
            </div>

            <div className="glass-card p-6 md:p-8 rounded-3xl">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-b-border/40 last:border-0">
                    <AccordionTrigger className="text-left font-semibold text-lg hover:text-primary transition-colors py-4">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed text-base pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <div className="mt-12 text-center text-muted-foreground">
              <p className="mb-4">Still have questions?</p>
              <Button variant="link" className="text-primary font-bold" asChild>
                <Link to="/contact">Contact Support</Link>
              </Button>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
