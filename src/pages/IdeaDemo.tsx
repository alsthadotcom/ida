import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Play, FileText, Map, Lock, ChevronRight, ChevronLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { fetchIdeaBySlug } from "@/services/ideaService";

const IdeaDemo = () => {
    const { slug } = useParams();
    const [idea, setIdea] = useState<any>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadIdea = async () => {
            // Validate slug format
            if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
                setLoading(false);
                return;
            }

            try {
                const fetchedIdea = await fetchIdeaBySlug(slug);
                setIdea(fetchedIdea);
            } catch (error) {
                console.error('Error loading idea:', error);
            } finally {
                setLoading(false);
            }
        };

        loadIdea();
    }, [slug]);

    if (!idea) return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;

    const slides = [
        { title: "The Problem", content: "Legal research is time-consuming and expensive for small firms." },
        { title: "The Solution", content: "AI-driven automation that reduces research time by 80%." },
        { title: "Market Size", content: "$20B+ Global Legal Tech Market, growing at 15% CAGR." },
        { title: "Business Model", content: "SaaS subscription: $199/mo per user." },
    ];

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="flex items-center justify-between mb-8">
                        <Link
                            to={`/marketplace`}
                            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Marketplace
                        </Link>
                        <Button asChild className="magnetic-btn bg-primary hover:bg-primary/90 glow-purple">
                            <Link to={`/buy/${slug}`}>Buy This Idea Now</Link>
                        </Button>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 text-center"
                    >
                        <h1 className="text-3xl md:text-4xl font-outfit font-bold mb-4">{idea.title}</h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto mb-4">{idea.description}</p>
                        <div className="text-sm text-muted-foreground">
                            Created by <span className="font-medium text-foreground">{idea.seller}</span>
                        </div>
                    </motion.div>

                    <Tabs defaultValue="pitch" className="w-full">
                        <div className="flex justify-center mb-8">
                            <TabsList className="grid w-full max-w-md grid-cols-3">
                                <TabsTrigger value="pitch">Pitch Deck</TabsTrigger>
                                <TabsTrigger value="prototype" disabled={!idea.hasMVP}>Prototype</TabsTrigger>
                                <TabsTrigger value="roadmap" disabled={!idea.hasDetailedRoadmap}>Roadmap</TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="pitch" className="mt-0">
                            <div className="glass-card p-8 md:p-16 min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 -z-10" />

                                <motion.div
                                    key={currentSlide}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="text-center max-w-2xl"
                                >
                                    <h2 className="text-3xl font-bold mb-6 text-primary">{slides[currentSlide].title}</h2>
                                    <p className="text-xl text-foreground/80 leading-relaxed">{slides[currentSlide].content}</p>
                                </motion.div>

                                <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-4">
                                    <Button variant="outline" size="icon" onClick={prevSlide}>
                                        <ChevronLeft className="w-4 h-4" />
                                    </Button>
                                    <div className="flex gap-2">
                                        {slides.map((_, idx) => (
                                            <div
                                                key={idx}
                                                className={`w-2 h-2 rounded-full transition-colors ${idx === currentSlide ? "bg-primary" : "bg-muted"}`}
                                            />
                                        ))}
                                    </div>
                                    <Button variant="outline" size="icon" onClick={nextSlide}>
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="prototype" className="mt-0">
                            <div className="glass-card p-4 min-h-[500px] flex items-center justify-center bg-black/90 relative rounded-xl overflow-hidden">
                                {idea.hasMVP ? (
                                    <div className="text-center">
                                        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Play className="w-8 h-8 text-primary fill-primary" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">Interactive Demo</h3>
                                        <p className="text-gray-400 mb-6">Click to launch the interactive prototype</p>
                                        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                                            Launch Prototype
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="text-center text-muted-foreground">
                                        <Lock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p>No prototype available for this idea.</p>
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="roadmap" className="mt-0">
                            <div className="glass-card p-8">
                                <h3 className="text-2xl font-bold mb-8 text-center">Execution Roadmap</h3>
                                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                                    {[
                                        { phase: "Phase 1", title: "MVP Development", time: "Month 1-2", status: "completed" },
                                        { phase: "Phase 2", title: "Beta Launch & Feedback", time: "Month 3", status: "current" },
                                        { phase: "Phase 3", title: "Market Expansion", time: "Month 4-6", status: "upcoming" },
                                        { phase: "Phase 4", title: "Scale & Monetize", time: "Month 7+", status: "upcoming" },
                                    ].map((item, idx) => (
                                        <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                                {item.status === "completed" ? (
                                                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                                                ) : item.status === "current" ? (
                                                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                                                ) : (
                                                    <div className="w-3 h-3 bg-muted rounded-full" />
                                                )}
                                            </div>
                                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-border/50 bg-card/50">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-bold text-primary">{item.phase}</span>
                                                    <Badge variant="outline">{item.time}</Badge>
                                                </div>
                                                <div className="font-medium">{item.title}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default IdeaDemo;
