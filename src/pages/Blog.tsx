import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, Tag, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const featuredPost = {
  title: "The Future of Intellectual Property in the AI Era",
  excerpt: "How blockchain and artificial intelligence are converging to create a new standard for idea ownership and monetization.",
  date: "Dec 5, 2024",
  readTime: "8 min read",
  category: "Deep Dive",
  image: "bg-gradient-to-br from-primary/20 to-purple-500/20"
};

const posts = [
  {
    title: "10 Tips for Writing a Winning Idea Submission",
    excerpt: "Learn how to present your ideas in a way that attracts buyers and commands premium prices.",
    date: "Nov 28, 2024",
    readTime: "7 min read",
    category: "Tips",
    color: "bg-blue-500/10 text-blue-500"
  },
  {
    title: "How ida Protects Your Intellectual Property",
    excerpt: "A deep dive into our SHA-256 timestamping and ownership verification system.",
    date: "Nov 25, 2024",
    readTime: "4 min read",
    category: "Security",
    color: "bg-green-500/10 text-green-500"
  },
  {
    title: "Success Story: From Idea to $1M Startup",
    excerpt: "Meet Sarah, who sold her SaaS concept on ida and watched it become a million-dollar company.",
    date: "Nov 20, 2024",
    readTime: "6 min read",
    category: "Success Stories",
    color: "bg-yellow-500/10 text-yellow-500"
  },
  {
    title: "Understanding Market Saturation Metrics",
    excerpt: "How to interpret the AI validation scores and pivot your idea for maximum impact.",
    date: "Nov 15, 2024",
    readTime: "5 min read",
    category: "Analysis",
    color: "bg-purple-500/10 text-purple-500"
  }
];

const categories = ["All", "Industry", "Tips", "Security", "Success Stories", "Analysis"];

const Blog = () => {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/20 relative overflow-hidden">
      <Navbar />

      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none z-[-1]">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <main className="pt-32 pb-20 container mx-auto px-4 max-w-7xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 border-primary/20 text-primary uppercase tracking-widest text-xs font-bold">
            <Sparkles className="w-3 h-3" /> The ida Journal
          </div>
          <h1 className="text-5xl md:text-7xl font-black font-outfit text-foreground mb-8 tracking-tighter">
            Insights for <br />
            <span className="gradient-text">Visionaries</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Deep dives into innovation, market trends, and the future of digital assets.
          </p>
        </motion.div>

        {/* Featured Post */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-24"
        >
          <div className="glass-card p-0 overflow-hidden group cursor-pointer relative">
            <div className={`absolute inset-0 ${featuredPost.image} opacity-30 group-hover:opacity-40 transition-opacity`} />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

            <div className="relative p-8 md:p-12 flex flex-col md:flex-row gap-8 items-end justify-between">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 backdrop-blur-md rounded-full text-primary text-xs font-bold mb-4">
                  {featuredPost.category}
                </div>
                <h2 className="text-3xl md:text-5xl font-black font-outfit mb-4 group-hover:text-primary transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {featuredPost.date}</span>
                  <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {featuredPost.readTime}</span>
                </div>
              </div>

              <Button size="lg" className="rounded-full shadow-lg shadow-primary/20">Read Article</Button>
            </div>
          </div>
        </motion.div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex overflow-x-auto pb-4 md:pb-0 gap-2 w-full md:w-auto no-scrollbar mask-gradient">
            {categories.map((cat, i) => (
              <button
                key={cat}
                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${i === 0 ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' : 'glass hover:bg-white/5'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search articles..." className="pl-10 h-10 bg-white/5 border-white/10 rounded-full focus:bg-white/10 transition-colors" />
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-24">
          {posts.map((post, index) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-8 group cursor-pointer hover:border-primary/30 transition-all hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-6">
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${post.color}`}>
                  {post.category}
                </span>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>

              <h2 className="text-2xl font-bold font-outfit text-foreground mb-3 group-hover:text-primary transition-colors">
                {post.title}
              </h2>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                {post.excerpt}
              </p>

              <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground border-t border-white/5 pt-6">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {post.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {post.readTime}
                </span>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-white/10 p-12 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black font-outfit mb-4">Stay Ahead of the Curve</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Get the latest trends, success stories, and platform updates delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Input placeholder="Enter your email address" className="h-12 bg-background/50 border-white/10 text-lg rounded-xl" />
              <Button size="lg" className="h-12 px-8 text-lg font-bold rounded-xl shadow-lg shadow-primary/25">Subscribe</Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">We respect your privacy. Unsubscribe at any time.</p>
          </div>
        </motion.div>

      </main>

      <Footer />
    </div>
  );
};

export default Blog;
