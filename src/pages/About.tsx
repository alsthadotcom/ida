import { motion } from "framer-motion";
import { Lightbulb, Target, Users, Shield, Rocket, Globe, Zap, Heart } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const values = [
  {
    icon: Lightbulb,
    title: "Innovation First",
    description: "We believe every great company starts with a single idea. Our mission is to democratize innovation.",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    delay: 0.1
  },
  {
    icon: Shield,
    title: "Trust & Security",
    description: "Your ideas are protected with blockchain-grade timestamps and secure ownership verification.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    delay: 0.2
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "We're building a global community of thinkers, creators, and entrepreneurs.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    delay: 0.3
  },
  {
    icon: Target,
    title: "Quality Focus",
    description: "Our AI ensures only validated, unique ideas make it to the marketplace.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    delay: 0.4
  },
];

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Background elements */}
          <div className="fixed inset-0 pointer-events-none z-[-1]">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px]" />
          </div>

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto mb-20 md:mb-32"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 border-primary/20 text-primary/80">
              <Rocket className="w-4 h-4" />
              <span className="text-sm font-semibold tracking-wide uppercase">The Future of Ideation</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black font-outfit text-foreground mb-8 tracking-tight leading-none">
              Where Ideas <br />
              <span className="gradient-text">Take Flight</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              We're building the world's first marketplace for validated business concepts,
              connecting visionary thinkers with ambitious builders.
            </p>
          </motion.div>

          {/* Mission Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-32">
            {[
              { m: "10K+", l: "Ideas Validated" },
              { m: "$2M+", l: "Value Created" },
              { m: "50+", l: "Countries" },
              { m: "24/7", l: "Innovation" },
            ].map((stat, i) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                key={i}
                className="glass-card p-6 text-center hover:bg-primary/5 transition-colors"
              >
                <div className="text-3xl md:text-4xl font-black font-outfit gradient-text mb-1">{stat.m}</div>
                <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{stat.l}</div>
              </motion.div>
            ))}
          </div>

          {/* Vision Section */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-32">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-black font-outfit mb-6">
                Why We Built <span className="text-primary">ida</span>
              </h2>
              <div className="space-y-6 text-lg text-muted-foreground">
                <p>
                  Ida was born from a simple observation: millions of brilliant ideas die
                  every day simply because the people who have them don't have the time,
                  resources, or expertise to bring them to life.
                </p>
                <p>
                  At the same time, countless entrepreneurs and investors are desperately
                  searching for their next big opportunity. We saw an opportunity to bridge
                  this gap.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-3xl flex items-center justify-center p-12 relative overflow-hidden group">
                <div className="absolute inset-0 bg-noise opacity-10" />
                <Lightbulb className="w-48 h-48 text-primary/50 group-hover:scale-110 transition-transform duration-700 stroke-1" />

                {/* Floating elements */}
                <div className="absolute top-1/4 left-1/4 p-4 glass rounded-2xl animate-float">
                  <Zap className="w-6 h-6 text-yellow-500" />
                </div>
                <div className="absolute bottom-1/4 right-1/4 p-4 glass rounded-2xl animate-float-delayed">
                  <Heart className="w-6 h-6 text-red-500" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Values Grid */}
          <div className="mb-32">
            <h2 className="text-3xl md:text-5xl font-black font-outfit text-center mb-16">
              Our Core <span className="gradient-text">Values</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-card p-8 hover:-translate-y-2 transition-all duration-300 group"
                >
                  <div className={`w-14 h-14 rounded-2xl ${value.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <value.icon className={`w-7 h-7 ${value.color}`} />
                  </div>
                  <h3 className="text-xl font-bold font-outfit text-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/10 p-12 md:p-20 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-noise opacity-5" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black font-outfit mb-6">Ready to Start Your Journey?</h2>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Whether you have an idea to share or you're looking for your next big venture,
                ida is the place where innovation happens.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all" onClick={() => navigate('/signup')}>
                  Join Community
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full font-bold glass bg-transparent hover:bg-white/5" style={{ backgroundColor: 'hsl(142deg 48.97% 36.45%)', borderColor: 'transparent', color: 'white' }} onClick={() => navigate('/marketplace')}>
                  Explore Marketplace
                </Button>
              </div>
            </div>
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
