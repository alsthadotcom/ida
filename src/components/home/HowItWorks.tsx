import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Search, Lightbulb, DollarSign, Rocket } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      id: "01",
      title: "Discover",
      desc: "Browse AI-validated concepts waiting for execution.",
      icon: Search,
      color: "text-blue-500",
    },
    {
      id: "02",
      title: "Evaluate",
      desc: "Analyze uniqueness, market fit, and ready-made raodmaps.",
      icon: Lightbulb,
      color: "text-amber-500",
    },
    {
      id: "03",
      title: "Acquire",
      desc: "Secure full IP rights instantly with safe ownership transfer.",
      icon: DollarSign,
      color: "text-emerald-500",
    },
    {
      id: "04",
      title: "Build",
      desc: "Launch faster with included assets and strategies.",
      icon: Rocket,
      color: "text-primary",
    },
  ];

  return (
    <section id="how-it-works" className="py-32 bg-background relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[128px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 mb-6"
            >
              <span className="h-px w-12 bg-primary"></span>
              <span className="text-primary font-bold tracking-widest uppercase text-sm">The Process</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-6xl font-black font-outfit text-foreground leading-tight"
            >
              From Idea to Empire<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-muted-foreground via-foreground to-muted-foreground opacity-50">in 4 Simple Steps.</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-muted-foreground max-w-md pb-2"
          >
            We've stripped away the complexity. No more guessing—just a clear path from concept to revenue.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative p-8 rounded-3xl border border-border/50 bg-background/50 hover:bg-background hover:border-primary/20 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5"
            >
              {/* Hover Gradient */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="text-6xl font-black text-secondary/5 group-hover:text-primary/10 transition-colors mb-8 font-outfit select-none">
                  {step.id}
                </div>

                <div className="mb-6 inline-flex p-3 rounded-2xl bg-secondary/5 text-foreground group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <step.icon className={`w-6 h-6 transition-colors ${step.color} group-hover:text-white`} />
                </div>

                <h3 className="text-xl font-bold font-outfit mb-3 group-hover:translate-x-1 transition-transform">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 group-hover:text-foreground/80 transition-colors">
                  {step.desc}
                </p>

                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  Learn More <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
