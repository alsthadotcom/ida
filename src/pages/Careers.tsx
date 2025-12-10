import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock, Zap, Globe, Heart, Rocket, Coffee, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const benefits = [
  { icon: Globe, title: "Remote First", desc: "Work from anywhere in the world. We believe in output, not hours." },
  { icon: Zap, title: "High Impact", desc: "Your work directly shapes the future of the platform and the creator economy." },
  { icon: Heart, title: "Full Health", desc: "Premium medical, dental, and vision coverage for you and your dependents." },
  { icon: Rocket, title: "Equity", desc: "Be an owner. Every employee gets meaningful equity grants." },
  { icon: Coffee, title: "Stipends", desc: "Monthly budget for wellness, learning, and home office upgrades." },
  { icon: Laptop, title: "Top Gear", desc: "Latest MacBook Pro and any software you need to do your best work." },
];

const jobs = [
  {
    title: "Senior Full-Stack Engineer",
    department: "Engineering",
    location: "Global Remote",
    type: "Full-time",
    tags: ["React", "Node.js", "Supabase"]
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "San Francisco / Remote",
    type: "Full-time",
    tags: ["Figma", "UX", "Motion"]
  },
  {
    title: "AI/ML Engineer",
    department: "Engineering",
    location: "Global Remote",
    type: "Full-time",
    tags: ["Python", "PyTorch", "LLMs"]
  },
  {
    title: "Community Manager",
    department: "Marketing",
    location: "London / Remote",
    type: "Full-time",
    tags: ["Social", "Content", "Events"]
  },
];

const Careers = () => {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/20 relative overflow-hidden">
      <Navbar />

      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none z-[-1]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <main className="pt-32 pb-20 container mx-auto px-4 max-w-7xl">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto mb-24"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 border-primary/20 text-primary uppercase tracking-widest text-xs font-bold">
            <Briefcase className="w-3 h-3" /> We are hiring
          </div>
          <h1 className="text-6xl md:text-8xl font-black font-outfit text-foreground mb-8 tracking-tighter leading-[0.9]">
            Build the <br />
            <span className="gradient-text">Future of Ideas</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join a team of visionaries, builders, and dreamers. We're democratizing innovation for everyone.
          </p>
        </motion.div>

        {/* Culture / Benefits Grid */}
        <div className="mb-32">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-black font-outfit mb-4">Why Top Talent Joins <span className="text-primary">ida</span></h2>
            <p className="text-muted-foreground text-lg">More than just a job. It's a calling.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-8 hover:bg-primary/5 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <b.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold font-outfit text-xl mb-3">{b.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Job Board */}
        <div className="max-w-5xl mx-auto relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-2xl opacity-20" />

          <div className="glass-card p-8 md:p-12 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/5 pb-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-black font-outfit mb-2">Open Positions</h2>
                <p className="text-muted-foreground">Come do the best work of your life.</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="rounded-full">All Teams</Button>
                <Button variant="ghost" className="rounded-full">Engineering</Button>
                <Button variant="ghost" className="rounded-full">Design</Button>
              </div>
            </div>

            <div className="space-y-4">
              {jobs.map((job, index) => (
                <motion.div
                  key={job.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all group cursor-pointer"
                >
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold font-outfit text-foreground group-hover:text-primary transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4" />
                        {job.department}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {job.type}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="hidden md:flex gap-2">
                      {job.tags.map(t => (
                        <span key={t} className="px-3 py-1 rounded-full bg-background/50 text-xs font-medium border border-white/5">{t}</span>
                      ))}
                    </div>
                    <Button className="rounded-full px-6" asChild>
                      <Link to="/contact">Apply</Link>
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-24 glass p-12 rounded-3xl max-w-3xl mx-auto"
        >
          <h3 className="text-2xl font-bold font-outfit mb-4">Don't see your perfect role?</h3>
          <p className="text-muted-foreground mb-8">
            We're always looking for exceptional talent to add to our network.
            Drop us a line and tell us how you can make an impact.
          </p>
          <Button variant="outline" size="lg" className="rounded-full" asChild>
            <Link to="/contact">Send General Application</Link>
          </Button>
        </motion.div>

      </main>

      <Footer />
    </div>
  );
};

export default Careers;
