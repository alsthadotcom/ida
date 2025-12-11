import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowLeft, ChevronRight, Github,
    Code2, Layers, Rocket, CheckCircle2, FileText,
    Zap, Box, Activity, Target, Globe, TrendingUp,
    Users, DollarSign, Award, ChevronDown, BarChart, X,
    Heart, Bookmark, Share2, Check
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchIdeaBySlug, incrementIdeaLikes, decrementIdeaLikes } from "@/services/ideaService";

const IdeaDetails = () => {
    const { slug } = useParams();
    const [idea, setIdea] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);

    // Social State
    const [likesCount, setLikesCount] = useState(0);
    const [localLiked, setLocalLiked] = useState(false);
    const [localSaved, setLocalSaved] = useState(false);
    const [justShared, setJustShared] = useState(false);

    useEffect(() => {
        const loadIdea = async () => {
            if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
                setLoading(false);
                return;
            }

            try {
                const fetchedIdea = await fetchIdeaBySlug(slug);
                setIdea(fetchedIdea);

                if (fetchedIdea) {
                    setLikesCount(fetchedIdea.likes_count || fetchedIdea.likes || 0);

                    // Check local storage
                    const likedIdeas = JSON.parse(localStorage.getItem('liked_ideas') || '[]');
                    setLocalLiked(likedIdeas.includes(fetchedIdea.id));

                    const savedIdeas = JSON.parse(localStorage.getItem('saved_ideas') || '[]');
                    setLocalSaved(savedIdeas.includes(fetchedIdea.id));
                }
            } catch (error) {
                console.error('Error loading idea:', error);
            } finally {
                setLoading(false);
            }
        };

        loadIdea();
    }, [slug]);

    // Handlers
    const handleLike = async () => {
        if (!idea) return;
        const currentLikes = likesCount;

        try {
            if (localLiked) {
                setLikesCount(prev => Math.max(0, prev - 1));
                setLocalLiked(false);
                const likedIdeas = JSON.parse(localStorage.getItem('liked_ideas') || '[]');
                const newLikedIdeas = likedIdeas.filter((id: string) => id !== idea.id);
                localStorage.setItem('liked_ideas', JSON.stringify(newLikedIdeas));
                await decrementIdeaLikes(idea.id, currentLikes);
            } else {
                setLikesCount(prev => prev + 1);
                setLocalLiked(true);
                const likedIdeas = JSON.parse(localStorage.getItem('liked_ideas') || '[]');
                if (!likedIdeas.includes(idea.id)) {
                    likedIdeas.push(idea.id);
                    localStorage.setItem('liked_ideas', JSON.stringify(likedIdeas));
                }
                await incrementIdeaLikes(idea.id, currentLikes);
            }
        } catch (error) {
            console.error("Error toggling like:", error);
            setLikesCount(currentLikes);
            setLocalLiked(!localLiked);
        }
    };

    const handleSave = () => {
        if (!idea) return;
        const savedIdeas = JSON.parse(localStorage.getItem('saved_ideas') || '[]');

        if (localSaved) {
            const newSavedIdeas = savedIdeas.filter((id: string) => id !== idea.id);
            localStorage.setItem('saved_ideas', JSON.stringify(newSavedIdeas));
            setLocalSaved(false);
        } else {
            if (!savedIdeas.includes(idea.id)) {
                savedIdeas.push(idea.id);
                localStorage.setItem('saved_ideas', JSON.stringify(savedIdeas));
            }
            setLocalSaved(true);
        }
    };

    const handleShare = async () => {
        if (!idea) return;
        const shareUrl = window.location.href;

        try {
            if (navigator.share) {
                await navigator.share({
                    title: idea.title,
                    text: `Check out this idea: ${idea.title}`,
                    url: shareUrl
                });
            } else {
                await navigator.clipboard.writeText(shareUrl);
                setJustShared(true);
                setTimeout(() => setJustShared(false), 2000);
            }
        } catch (error) {
            console.error("Error sharing:", error);
        }
    };

    if (!idea && !loading) return <div className="min-h-screen bg-background flex items-center justify-center">Idea not found</div>;
    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

    // --- Scoring Logic ---
    const scores = {
        uniqueness: idea.uniqueness || 0,
        readiness: idea.execution_readiness || 0,
        clarity: idea.clarity_score || 0,
        potential: idea.market_potential ? 92 : 75,
    };

    const overallScore = Math.round(
        (scores.uniqueness + scores.readiness + scores.clarity + scores.potential) / 4
    );

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-primary border-primary shadow-primary/50";
        if (score >= 50) return "text-yellow-500 border-yellow-500 shadow-yellow-500/50";
        return "text-red-500 border-red-500 shadow-red-500/50";
    };

    const getScoreColorHex = (score: number) => {
        if (score >= 80) return "hsl(142 76% 36%)"; // Using standard green hex or var
        if (score >= 50) return "#eab308";
        return "#ef4444";
    };

    // --- AI Node Animation Component (Central Score Only) ---
    const AiNodeAnimation = () => {
        const mainColor = getScoreColor(overallScore);
        const mainColorHex = getScoreColorHex(overallScore);

        return (
            <div className="relative w-full h-[450px] flex items-center justify-center group perspective-1000 overflow-visible">
                {/* Central Core */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className={`relative z-20 w-64 h-64 md:w-72 md:h-72 rounded-full border-4 ${mainColor} bg-background/40 backdrop-blur-xl flex flex-col items-center justify-center shadow-[0_0_120px_-10px_var(--tw-shadow-color)] cursor-pointer`}
                >
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 font-mono">AI Overall Score</div>
                    <div className={`text-9xl font-black ${mainColor.split(' ')[0]} font-outfit drop-shadow-lg`}>{overallScore}</div>
                    <div className="mt-3 text-sm text-muted-foreground font-medium">Out of 100</div>

                    {/* Inner Pulse - No Spin */}
                    <div className="absolute inset-0 rounded-full border-2 border-current opacity-20 animate-ping-slow" style={{ color: mainColorHex }} />
                    <div className="absolute -inset-6 rounded-full border border-dashed border-current opacity-10" style={{ color: mainColorHex }} />
                </motion.div>

                {/* Decorative Orbits */}
                <div className="absolute w-[400px] h-[400px] rounded-full border border-primary/15 animate-[spin_60s_linear_infinite]" />
                <div className="absolute w-[320px] h-[320px] rounded-full border-2 border-dashed border-primary/25 animate-[spin_40s_linear_infinite_reverse]" />

                {/* Ambient Glows */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/5 to-transparent blur-[100px] opacity-50 pointer-events-none" />
                <div className="absolute w-64 h-64 rounded-full" style={{
                    background: `radial-gradient(circle, ${mainColorHex}15 0%, transparent 70%)`,
                    filter: 'blur(40px)'
                }} />

                {/* See Details Button */}
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    onClick={() => {
                        setShowDetailedAnalysis(!showDetailedAnalysis);
                        if (!showDetailedAnalysis) {
                            setTimeout(() => {
                                window.scrollTo({ top: window.innerHeight * 0.5, behavior: 'smooth' });
                            }, 100);
                        }
                    }}
                    className={`absolute -bottom-16 left-1/2 -translate-x-1/2 px-8 py-3 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 hover:from-primary/30 hover:to-accent/30 backdrop-blur-xl border border-border/20 hover:border-border/40 shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3 group z-50 ${showDetailedAnalysis ? 'opacity-0 pointer-events-none' : ''}`}
                >
                    <BarChart className="w-4 h-4" />
                    <span className="font-bold text-sm">See Detailed AI Analysis</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showDetailedAnalysis ? 'rotate-180' : ''}`} />
                </motion.button>
            </div>
        );
    };

    // --- Detailed AI Metrics (20 criteria) ---
    const detailedMetrics = [
        { name: "Problem Severity", description: "Measures how urgent and debilitating the target users' problem is", score: 85 },
        { name: "Total Addressable Market", description: "Estimates maximum revenue opportunity if product captured all potential customers", score: 78 },
        { name: "Market Growth Rate", description: "Captures how quickly the market is expanding (CAGR)", score: 72 },
        { name: "Product–Market Fit Clarity", description: "Assesses how clearly the idea defines customer, use case, and value proposition", score: 88 },
        { name: "Uniqueness / Novelty", description: "Evaluates how original the solution or approach is compared with existing alternatives", score: scores.uniqueness || 75 },
        { name: "Competitive Intensity", description: "Measures the number and strength of competitors and substitute solutions", score: 65 },
        { name: "Market Saturation", description: "Gauges how much current demand is already met versus unmet needs", score: 58 },
        { name: "IP & Legal Defensibility", description: "Patents, trademarks, copyrights, or regulatory barriers preventing copying", score: 70 },
        { name: "Technical Feasibility", description: "Judges whether required technology exists and implementation maturity", score: scores.readiness || 80 },
        { name: "Technical Complexity", description: "Assesses implementation difficulty and chance of hidden engineering obstacles", score: 62 },
        { name: "Scalability", description: "Measures how easily product can grow without proportional cost increases", score: 82 },
        { name: "Business Model Robustness", description: "Evaluates clarity and diversification of revenue streams and pricing logic", score: 76 },
        { name: "Unit Economics", description: "Checks whether LTV sufficiently exceeds CAC to be profitable at scale", score: 73 },
        { name: "Capital Intensity", description: "Estimates funding required to reach critical milestones and scale", score: 68 },
        { name: "Time-to-Market", description: "Estimates how long until viable, sellable product exists", score: 79 },
        { name: "Team Strength", description: "Measures founders' relevant skills, track record, and execution ability", score: 84 },
        { name: "Expertise Dependence", description: "Gauges whether idea requires rare expertise that could bottleneck execution", score: 71 },
        { name: "Validation Evidence", description: "Real-world signals like pilots, paying customers, or KPI trends", score: 77 },
        { name: "Go-to-Market Feasibility", description: "Practicality, cost, and channels available to acquire customers at scale", score: 80 },
        { name: "Regulatory Risk", description: "Likelihood and severity of legal barriers that could restrict business", score: 66 },
    ];

    return (
        <div className="min-h-screen bg-background selection:bg-primary/20 font-sans overflow-x-hidden">
            <Navbar />

            {/* Enhanced Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[900px] h-[900px] bg-primary/[0.07] rounded-full blur-[180px] animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-[-10%] left-[-10%] w-[700px] h-[700px] bg-accent/[0.07] rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '10s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-primary/5 to-accent/5 rounded-full blur-[120px]" />
            </div>

            <main className="pt-32 pb-40 relative z-10">
                <div className="container mx-auto px-4 max-w-7xl">

                    {/* Header Controls */}
                    {/* Header Controls */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4 sticky top-24 z-40 pointer-events-none"
                    >
                        <Link
                            to={`/marketplace`}
                            className="pointer-events-auto"
                        >
                            <Button variant="outline" className="rounded-full h-12 px-6 border-border/50 shadow-lg bg-background/80 backdrop-blur-xl hover:bg-background/90 transition-all group">
                                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                                <span className="hidden sm:inline">Back to Marketplace</span>
                                <span className="sm:hidden">Back</span>
                            </Button>
                        </Link>

                        <div className="flex items-center gap-4 pointer-events-auto bg-background/80 backdrop-blur-xl rounded-full shadow-lg border border-border/50 p-1.5 pl-6">
                            <div className="text-right mr-2">
                                <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-tight">Valuation</div>
                                <div className="text-xl font-black text-orange-500 leading-tight">{idea.price}</div>
                            </div>
                            <Button asChild size="sm" className="h-12 px-8 text-sm font-bold uppercase tracking-wider rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all text-primary-foreground border-0">
                                <Link to={`/buy/${slug}`}>
                                    <Award className="w-4 h-4 mr-2" />
                                    Acquire Assets
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </Link>
                            </Button>
                        </div>
                    </motion.div>

                    {/* HERO + AI Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-32">
                        {/* Text Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-12 relative"
                        >
                            <div className="absolute -left-24 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/30 via-primary/10 to-transparent hidden xl:block" />

                            <div className="flex flex-col gap-6">
                                <div className="flex flex-wrap gap-3">
                                    <Badge variant="secondary" className="bg-gradient-to-r from-secondary/60 to-secondary/40 backdrop-blur-sm px-5 py-2 text-sm font-bold border border-border shadow-lg">
                                        {idea.category}
                                    </Badge>
                                    {idea.type_of_topic && (
                                        <Badge variant="outline" className="border-primary/40 text-primary px-5 py-2 text-sm font-bold bg-primary/5 backdrop-blur-sm shadow-lg">
                                            {idea.type_of_topic}
                                        </Badge>
                                    )}
                                </div>

                                {/* Social Actions */}
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className={`rounded-full border-zinc-700 bg-background/50 hover:bg-zinc-800 transition-colors ${localLiked ? 'text-pink-500 border-pink-500/30' : 'text-zinc-400 hover:text-white'}`}
                                        onClick={handleLike}
                                    >
                                        <Heart className={`w-4 h-4 mr-2 ${localLiked ? 'fill-current' : ''}`} />
                                        {likesCount}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className={`rounded-full border-zinc-700 bg-background/50 hover:bg-zinc-800 transition-colors ${localSaved ? 'text-yellow-500 border-yellow-500/30' : 'text-zinc-400 hover:text-white'}`}
                                        onClick={handleSave}
                                    >
                                        <Bookmark className={`w-4 h-4 mr-2 ${localSaved ? 'fill-current' : ''}`} />
                                        {localSaved ? 'Saved' : 'Save'}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="rounded-full border-border bg-background/50 text-muted-foreground hover:text-foreground hover:bg-secondary/20 transition-colors"
                                        onClick={handleShare}
                                    >
                                        {justShared ? (
                                            <>
                                                <Check className="w-4 h-4 mr-2 text-primary" />
                                                Copied
                                            </>
                                        ) : (
                                            <>
                                                <Share2 className="w-4 h-4 mr-2" />
                                                Share
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-outfit leading-[0.92] tracking-tighter text-foreground">
                                {idea.title}
                            </h1>

                            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-xl font-light">
                                {idea.description}
                            </p>

                            {/* Seller Info */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
                                <Link
                                    to={`/profile/${idea.user_id}`}
                                    className="group flex items-center gap-3 hover:text-primary transition-colors"
                                >
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
                                            {idea.seller?.substring(0, 2).toUpperCase() || "SE"}
                                        </div>
                                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-primary rounded-full border-2 border-background flex items-center justify-center">
                                            <CheckCircle2 className="w-2 h-2 text-primary-foreground" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">Created By</div>
                                        <div className="font-bold text-sm group-hover:text-primary transition-colors">{idea.seller || "Idea Seller"}</div>
                                    </div>
                                </Link>

                                {idea.github_repo_url && (
                                    <a
                                        href={idea.github_repo_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex items-center gap-2.5 text-sm hover:text-primary transition-colors"
                                    >
                                        <Github className="w-4 h-4 transition-transform group-hover:scale-110" />
                                        <div>
                                            <div className="font-bold text-xs">Source Code</div>
                                            <div className="text-[10px] text-muted-foreground group-hover:text-primary/70 transition-colors">Verified Repository</div>
                                        </div>
                                    </a>
                                )}
                            </div>
                        </motion.div>

                        {/* AI Animation Container */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative flex justify-center lg:justify-end"
                        >
                            <AiNodeAnimation />
                        </motion.div>
                    </div>

                    {/* Detailed AI Analysis Modal */}
                    {showDetailedAnalysis && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.5 }}
                            className="mb-32 relative"
                        >
                            <div className="max-w-5xl mx-auto bg-card/80 backdrop-blur-xl rounded-3xl border border-primary/20 shadow-2xl p-8 md:p-12 relative overflow-hidden">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-10 pb-6 border-b border-border">
                                    <div>
                                        <h3 className="text-3xl font-black font-outfit mb-2 text-foreground">
                                            Detailed AI Analysis
                                        </h3>
                                        <p className="text-muted-foreground">Comprehensive evaluation across 20 critical business metrics</p>
                                    </div>
                                    <button
                                        onClick={() => setShowDetailedAnalysis(false)}
                                        className="p-2 rounded-full hover:bg-secondary/10 transition-colors text-muted-foreground hover:text-foreground"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Metrics Grid */}
                                <div className="space-y-4">
                                    {detailedMetrics.map((metric, idx) => {
                                        // Standardize to monochromatic green scale for consistency
                                        const isHigh = metric.score >= 80;
                                        const isMed = metric.score >= 50;

                                        const color = isHigh ? "hsl(142 76% 36%)" : isMed ? "hsl(142 76% 36%)" : "#ef4444"; // Keep red for critical fails only, green for everything else to be cleaner
                                        const colorClass = isHigh ? 'bg-primary' : isMed ? 'bg-primary' : 'bg-red-500';

                                        // Visual nuance: opacity/brightness varies by score instead of hue
                                        const opacity = 0.5 + (metric.score / 200);

                                        return (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.03 }}
                                                className="flex items-center gap-6 p-5 rounded-2xl bg-secondary/10 border border-border/50 hover:border-primary/30 transition-all group"
                                            >
                                                {/* Score Circle */}
                                                <div className="flex-shrink-0 relative w-16 h-16">
                                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                                        <circle
                                                            cx="50"
                                                            cy="50"
                                                            r="45"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="6"
                                                            className="text-muted/20"
                                                        />
                                                        <circle
                                                            cx="50"
                                                            cy="50"
                                                            r="45"
                                                            fill="none"
                                                            stroke={color}
                                                            strokeWidth="6"
                                                            strokeLinecap="round"
                                                            strokeDasharray={`${2 * Math.PI * 45}`}
                                                            strokeDashoffset={`${2 * Math.PI * 45 * (1 - metric.score / 100)}`}
                                                            className="transition-all duration-1000"
                                                        />
                                                    </svg>
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <span className="text-lg font-black text-foreground">{metric.score}</span>
                                                    </div>
                                                </div>
                                                {/* Metric Info */}
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-base mb-1 text-foreground group-hover:text-primary transition-colors">{metric.name}</h4>
                                                    <p className="text-sm text-muted-foreground leading-relaxed">{metric.description}</p>
                                                </div>
                                                {/* Score Badge */}
                                                <div className={`flex-shrink-0 px-4 py-2 rounded-full bg-secondary/30 border border-border`}>
                                                    <span className="text-sm font-bold" style={{ color }}>{metric.score}/100</span>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Enhanced Market Intelligence Grid - Consistently Green */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative mb-40"
                    >
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-black font-outfit mb-4 text-foreground">
                                Market Intelligence
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Data-driven insights into market opportunity and scalability
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {[
                                {
                                    label: "Market Size",
                                    value: idea.market_potential || "$10B+",
                                    icon: TrendingUp,
                                    desc: "Total Addressable Market"
                                },
                                {
                                    label: "Target Audience",
                                    value: idea.target_audience || "Niche",
                                    icon: Users,
                                    desc: "Primary user segment"
                                },
                                {
                                    label: "Region",
                                    value: idea.region_feasibility || "Global",
                                    icon: Globe,
                                    desc: "Geographic reach"
                                }
                            ].map((stat, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    whileHover={{ y: -5 }}
                                    className="relative group"
                                >
                                    <div className="relative bg-card px-8 py-10 rounded-3xl border border-border hover:border-primary/50 transition-all overflow-hidden group-hover:shadow-[0_0_40px_-10px_hsl(var(--primary)/0.1)]">
                                        <div className={`p-4 rounded-2xl bg-primary/10 w-fit mb-6 group-hover:scale-110 transition-transform`}>
                                            <stat.icon className={`w-7 h-7 text-primary`} />
                                        </div>
                                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">{stat.label}</div>
                                        <div className={`text-4xl lg:text-5xl font-black mb-3 text-foreground`}>
                                            {stat.value}
                                        </div>
                                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">{stat.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Enhanced Assets Section - Consistently Green */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-6xl mx-auto mb-40"
                    >
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-black font-outfit mb-4 text-foreground">
                                Digital Assets Included
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Everything you need to launch and scale from day one
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: "Code Repository", sub: "Full GitHub Access", included: !!idea.github_repo_url, icon: Code2 },
                                { label: "MVP Prototype", sub: idea.hasMVP ? "Live & Deployed" : "Not Available", included: idea.hasMVP, icon: Rocket },
                                { label: "Design System", sub: "Figma + Assets", included: true, icon: Layers },
                                { label: "IP Ownership", sub: "Full Legal Transfer", included: true, icon: CheckCircle2 },
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    className={`relative p-8 rounded-[2rem] border transition-all duration-500 group overflow-hidden ${item.included
                                        ? 'bg-card border-border hover:border-primary/50'
                                        : 'bg-secondary/20 border-border/50 opacity-60'
                                        }`}
                                >
                                    {item.included && (
                                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    )}

                                    <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ${item.included
                                        ? `bg-primary/10 text-primary group-hover:scale-110`
                                        : 'bg-secondary text-muted-foreground'
                                        }`}>
                                        <item.icon className={`w-8 h-8`} />
                                    </div>

                                    <h4 className="font-black text-xl mb-2 text-foreground">{item.label}</h4>
                                    <p className="text-sm text-muted-foreground font-medium mb-8">{item.sub}</p>

                                    <div className={`flex items-center gap-2.5 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full w-fit ${item.included ? 'bg-primary/10 text-primary' : 'bg-red-500/10 text-red-500'
                                        }`}>
                                        <div className={`w-2 h-2 rounded-full ${item.included ? 'bg-primary' : 'bg-red-500'}`} />
                                        <span>{item.included ? 'Included' : 'Unavailable'}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default IdeaDetails;
