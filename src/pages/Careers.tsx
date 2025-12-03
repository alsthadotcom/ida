import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const jobs = [
  {
    title: "Senior Full-Stack Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "San Francisco, CA",
    type: "Full-time",
  },
  {
    title: "AI/ML Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "Community Manager",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
  },
];

const Careers = () => {
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
              Join the <span className="gradient-text">ida</span> Team
            </h1>
            <p className="text-lg text-muted-foreground">
              Help us build the future of idea innovation. We're looking for passionate 
              people who believe in the power of great ideas.
            </p>
          </motion.div>

          {/* Why Join Us */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-8 max-w-4xl mx-auto mb-16"
          >
            <h2 className="text-2xl font-outfit font-bold text-foreground mb-6 text-center">
              Why Join Us?
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Remote-First</h3>
                <p className="text-sm text-muted-foreground">Work from anywhere in the world</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Competitive Salary</h3>
                <p className="text-sm text-muted-foreground">Top-tier compensation + equity</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Growth Focused</h3>
                <p className="text-sm text-muted-foreground">Learning budget & career development</p>
              </div>
            </div>
          </motion.div>

          {/* Open Positions */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-outfit font-bold text-foreground mb-8 text-center">
              Open Positions
            </h2>
            
            <div className="space-y-4">
              {jobs.map((job, index) => (
                <motion.div
                  key={job.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div>
                    <h3 className="text-lg font-outfit font-semibold text-foreground mb-2">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {job.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {job.type}
                      </span>
                    </div>
                  </div>
                  
                  <Button variant="outline" asChild>
                    <Link to="/contact">Apply Now</Link>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Don't See Your Role */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-12"
          >
            <p className="text-muted-foreground mb-4">
              Don't see your role? We're always looking for talented people.
            </p>
            <Button variant="ghost" asChild>
              <Link to="/contact">Send us your resume</Link>
            </Button>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Careers;
