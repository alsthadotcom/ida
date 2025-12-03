import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const posts = [
  {
    title: "The Future of Idea Marketplaces",
    excerpt: "How AI and blockchain are revolutionizing the way we buy and sell business concepts.",
    date: "Dec 1, 2024",
    readTime: "5 min read",
    category: "Industry",
  },
  {
    title: "10 Tips for Writing a Winning Idea Submission",
    excerpt: "Learn how to present your ideas in a way that attracts buyers and commands premium prices.",
    date: "Nov 28, 2024",
    readTime: "7 min read",
    category: "Tips",
  },
  {
    title: "How ida Protects Your Intellectual Property",
    excerpt: "A deep dive into our SHA-256 timestamping and ownership verification system.",
    date: "Nov 25, 2024",
    readTime: "4 min read",
    category: "Security",
  },
  {
    title: "Success Story: From Idea to $1M Startup",
    excerpt: "Meet Sarah, who sold her SaaS concept on ida and watched it become a million-dollar company.",
    date: "Nov 20, 2024",
    readTime: "6 min read",
    category: "Success Stories",
  },
];

const Blog = () => {
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
              ida <span className="gradient-text">Blog</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Insights, tips, and stories from the world of idea innovation.
            </p>
          </motion.div>

          {/* Posts Grid */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {posts.map((post, index) => (
              <motion.article
                key={post.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 group cursor-pointer hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                    {post.category}
                  </span>
                </div>
                
                <h2 className="text-xl font-outfit font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                
                <p className="text-muted-foreground text-sm mb-4">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>
                  
                  <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.article>
            ))}
          </div>

          {/* Coming Soon */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <p className="text-muted-foreground">
              More articles coming soon. Stay tuned!
            </p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
