import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2, Code2, Monitor, Smartphone, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";

const DigitalSolutions = () => {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        toast({
            title: "You're on the list!",
            description: "We'll notify you when Digital Solutions launches.",
        });

        setEmail("");
        setIsSubmitting(false);
    };

    const services = [
        { icon: Code2, label: "Custom Development" },
        { icon: Monitor, label: "Web Applications" },
        { icon: Smartphone, label: "Mobile Solutions" },
        { icon: Zap, label: "AI Integration" },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col">
            <Navbar />

            {/* Ambient Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-primary/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-purple-500/10 rounded-full blur-[150px]" />
            </div>

            <main className="flex-1 flex flex-col items-center justify-center container mx-auto px-4 max-w-4xl text-center py-32 z-10">

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium tracking-wide">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        Coming Soon
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-6xl md:text-8xl font-black font-outfit mb-6 tracking-tighter"
                >
                    Digital <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">
                        Solutions.
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
                >
                    We are building a premium agency to transform your ideas into reality. High-end development, bespoke design, and cutting-edge AI integration.
                </motion.p>

                {/* Services Grid (Visual only) */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 w-full max-w-3xl"
                >
                    {services.map((service, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-card/50 border border-border flex flex-col items-center gap-3 backdrop-blur-sm hover:border-primary/50 transition-colors duration-300">
                            <service.icon className="w-8 h-8 text-primary" />
                            <span className="text-sm font-medium text-foreground">{service.label}</span>
                        </div>
                    ))}
                </motion.div>

                {/* Subscribe Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="w-full max-w-md mx-auto"
                >
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                        <Input
                            type="email"
                            placeholder="Enter your email address"
                            className="h-12 bg-card/80 border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Button
                            type="submit"
                            size="lg"
                            className="h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            ) : (
                                <>
                                    Notify Me <Send className="ml-2 w-4 h-4" />
                                </>
                            )}
                        </Button>
                    </form>
                    <p className="text-xs text-muted-foreground mt-4">
                        Be the first to know when we launch. No spam, ever.
                    </p>
                </motion.div>

            </main>
            <Footer />
        </div>
    );
};

export default DigitalSolutions;
