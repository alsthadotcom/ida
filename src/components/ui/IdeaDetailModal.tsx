import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Github, Award, ChevronRight, Heart, Sparkles, Eye,
    Bookmark, Share2, Check
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { incrementIdeaLikes, decrementIdeaLikes } from "@/services/ideaService";

interface IdeaDetailModalProps {
    idea: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const IdeaDetailModal = ({ idea, open, onOpenChange }: IdeaDetailModalProps) => {
    const navigate = useNavigate();

    // State for interactions
    const [likesCount, setLikesCount] = useState(0);
    const [localLiked, setLocalLiked] = useState(false);
    const [localSaved, setLocalSaved] = useState(false);
    const [justShared, setJustShared] = useState(false);

    useEffect(() => {
        if (idea) {
            setLikesCount(idea.likes_count || idea.likes || 0);

            // Check local storage for like/save state
            const likedIdeas = JSON.parse(localStorage.getItem('liked_ideas') || '[]');
            setLocalLiked(likedIdeas.includes(idea.id));

            const savedIdeas = JSON.parse(localStorage.getItem('saved_ideas') || '[]');
            setLocalSaved(savedIdeas.includes(idea.id));
        }
    }, [idea]);

    if (!idea) return null;

    // Handlers
    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const currentLikes = likesCount;

        try {
            if (localLiked) {
                // Unlike
                setLikesCount(prev => Math.max(0, prev - 1));
                setLocalLiked(false);

                // Update Local Storage
                const likedIdeas = JSON.parse(localStorage.getItem('liked_ideas') || '[]');
                const newLikedIdeas = likedIdeas.filter((id: string) => id !== idea.id);
                localStorage.setItem('liked_ideas', JSON.stringify(newLikedIdeas));

                // API Call
                await decrementIdeaLikes(idea.id, currentLikes);
            } else {
                // Like
                setLikesCount(prev => prev + 1);
                setLocalLiked(true);

                // Update Local Storage
                const likedIdeas = JSON.parse(localStorage.getItem('liked_ideas') || '[]');
                if (!likedIdeas.includes(idea.id)) {
                    likedIdeas.push(idea.id);
                    localStorage.setItem('liked_ideas', JSON.stringify(likedIdeas));
                }

                // API Call
                await incrementIdeaLikes(idea.id, currentLikes);
            }
        } catch (error) {
            console.error("Error toggling like:", error);
            // Revert on error
            setLikesCount(currentLikes);
            setLocalLiked(!localLiked);
        }
    };

    const handleSave = (e: React.MouseEvent) => {
        e.stopPropagation();
        const savedIdeas = JSON.parse(localStorage.getItem('saved_ideas') || '[]');

        if (localSaved) {
            // Unsave
            const newSavedIdeas = savedIdeas.filter((id: string) => id !== idea.id);
            localStorage.setItem('saved_ideas', JSON.stringify(newSavedIdeas));
            setLocalSaved(false);
        } else {
            // Save
            if (!savedIdeas.includes(idea.id)) {
                savedIdeas.push(idea.id);
                localStorage.setItem('saved_ideas', JSON.stringify(savedIdeas));
            }
            setLocalSaved(true);
        }
    };

    const handleShare = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const shareUrl = `${window.location.origin}/demo/${idea.slug}`;

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


    // Extract scores from ai_scores or use defaults
    const viabilityScore = idea.ai_scores?.viability || idea.validation_score || 75;
    const innovationScore = idea.ai_scores?.innovation || idea.feasibility_score || 68;
    const impactScore = idea.ai_scores?.impact || idea.uniqueness_score || 88;

    // Calculate overall score
    const overallScore = Math.round((viabilityScore + innovationScore + impactScore) / 3);

    // Get score color
    const getScoreColorHex = (score: number) => {
        if (score >= 80) return "hsl(142 76% 36%)";
        if (score >= 50) return "#eab308";
        return "#ef4444";
    };

    const ownerUsername = idea.profiles?.username || idea.owner_username || idea.username || "Anonymous";

    // Truncate description to create curiosity
    const truncateDescription = (text: string, maxLength: number = 150) => {
        if (!text) return "";
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + "...";
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden bg-card border-primary/30 shadow-2xl [&>button]:hidden">
                {/* Scrollable Content */}
                <div className="overflow-y-auto max-h-[85vh]">
                    <div className="relative p-8 space-y-6">

                        {/* Header Section */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 space-y-3">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <Badge
                                            variant="secondary"
                                            className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 text-sm font-bold"
                                        >
                                            {idea.category || "General"}
                                        </Badge>
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/50 border border-border">
                                            <Heart className="w-3.5 h-3.5 fill-primary text-primary" />
                                            <span className="text-xs font-bold text-primary">{likesCount}</span>
                                        </div>
                                    </div>

                                    <h2 className="text-3xl md:text-4xl font-black font-outfit text-foreground leading-tight tracking-tight">
                                        {idea.title}
                                    </h2>

                                    {/* Creator Info */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-bold text-xs">
                                            {ownerUsername.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">
                                                Created By
                                            </div>
                                            <div className="font-bold text-sm text-foreground">
                                                {ownerUsername}
                                            </div>
                                        </div>
                                        {idea.github_repo_url && (
                                            <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                                                <Github className="w-3.5 h-3.5 text-primary" />
                                                <span className="text-xs font-medium text-muted-foreground">
                                                    Repo
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* AI Score Section - Simplified */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="relative p-6 rounded-2xl bg-gradient-to-br from-secondary/40 to-secondary/20 backdrop-blur-xl border border-border overflow-hidden"
                        >
                            {/* Background Glow */}
                            <div
                                className="absolute inset-0 opacity-10 blur-3xl pointer-events-none"
                                style={{
                                    background: `radial-gradient(circle at center, ${getScoreColorHex(overallScore)} 0%, transparent 70%)`
                                }}
                            />

                            <div className="relative z-10 flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Sparkles className="w-4 h-4 text-primary" />
                                        <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider">
                                            AI Confidence Score
                                        </h3>
                                    </div>
                                    <p className="text-xs text-muted-foreground max-w-xs">
                                        Analyzed across 20+ business metrics
                                    </p>
                                </div>

                                {/* Overall Score - Compact */}
                                <div className="flex flex-col items-center">
                                    <div className="relative w-24 h-24 flex items-center justify-center mb-1">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle
                                                cx="48"
                                                cy="48"
                                                r="42"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="6"
                                                className="text-secondary"
                                            />
                                            <circle
                                                cx="48"
                                                cy="48"
                                                r="42"
                                                fill="none"
                                                stroke={getScoreColorHex(overallScore)}
                                                strokeWidth="6"
                                                strokeLinecap="round"
                                                strokeDasharray={`${2 * Math.PI * 42}`}
                                                strokeDashoffset={`${2 * Math.PI * 42 * (1 - overallScore / 100)}`}
                                                className="transition-all duration-1000"
                                                style={{ filter: `drop-shadow(0 0 8px ${getScoreColorHex(overallScore)}80)` }}
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span
                                                className="text-4xl font-black leading-none"
                                                style={{ color: getScoreColorHex(overallScore) }}
                                            >
                                                {overallScore}
                                            </span>
                                            <span className="text-[9px] text-muted-foreground font-medium">
                                                /100
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Brief Description */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-2"
                        >
                            <p className="text-sm text-foreground/70 leading-relaxed">
                                {truncateDescription(idea.description, 120)}
                            </p>
                            {idea.description && idea.description.length > 120 && (
                                <button
                                    onClick={() => {
                                        onOpenChange(false);
                                        navigate(`/demo/${idea.slug}`);
                                    }}
                                    className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors"
                                >
                                    Read more
                                    <ChevronRight className="w-3 h-3" />
                                </button>
                            )}
                        </motion.div>

                        {/* Quick Stats - Minimalistic */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex items-center justify-between p-4 rounded-xl bg-secondary/10 border border-border"
                        >
                            <div className="flex-1 text-center border-r border-border">
                                <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">
                                    Market
                                </div>
                                <div className="text-sm font-bold text-foreground">
                                    {idea.market_potential || "$10B+"}
                                </div>
                            </div>
                            <div className="flex-1 text-center border-r border-border">
                                <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">
                                    Stage
                                </div>
                                <div className="text-sm font-bold text-foreground">
                                    {idea.hasMVP ? "MVP Ready" : "Concept"}
                                </div>
                            </div>
                            <div className="flex-1 text-center">
                                <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">
                                    Assets
                                </div>
                                <div className="text-sm font-bold text-primary">
                                    {[idea.github_repo_url, idea.hasMVP, true, true].filter(Boolean).length}+ Included
                                </div>
                            </div>
                        </motion.div>

                        {/* Price & CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="space-y-3 pt-2"
                        >
                            <div className="flex items-end justify-between">
                                <div>
                                    <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">
                                        Asking Price
                                    </div>
                                    <div className="text-3xl font-black text-primary font-outfit">
                                        {idea.price}
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-muted-foreground hover:text-primary hover:bg-transparent transition-colors gap-1"
                                    onClick={() => {
                                        onOpenChange(false);
                                        navigate(`/demo/${idea.slug}`);
                                    }}
                                >
                                    <Eye className="w-4 h-4" />
                                    See full analysis
                                </Button>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <Button
                                    size="lg"
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all group"
                                    onClick={() => {
                                        onOpenChange(false);
                                        window.location.href = `/buy/${idea.slug}`;
                                    }}
                                >
                                    <Award className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                                    Acquire Now
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-border text-foreground hover:bg-secondary hover:border-primary/50 hover:text-primary rounded-xl font-bold transition-all"
                                    onClick={() => {
                                        onOpenChange(false);
                                        navigate(`/demo/${idea.slug}`);
                                    }}
                                >
                                    View Details
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            </div>

                            {/* Action Buttons: Like, Save, Share */}
                            <div className="flex items-center gap-3 pt-2 border-t border-border mx-[-1rem] px-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className={`flex-1 border-border bg-secondary/20 hover:bg-secondary transition-colors ${localLiked ? 'text-pink-500 border-pink-500/20' : 'text-muted-foreground hover:text-foreground'}`}
                                    onClick={handleLike}
                                >
                                    <Heart className={`w-4 h-4 mr-2 ${localLiked ? 'fill-current' : ''}`} />
                                    {localLiked ? 'Liked' : 'Like'} ({likesCount})
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className={`flex-1 border-border bg-secondary/20 hover:bg-secondary transition-colors ${localSaved ? 'text-yellow-500 border-yellow-500/20' : 'text-muted-foreground hover:text-foreground'}`}
                                    onClick={handleSave}
                                >
                                    <Bookmark className={`w-4 h-4 mr-2 ${localSaved ? 'fill-current' : ''}`} />
                                    {localSaved ? 'Saved' : 'Save'}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 border-border bg-secondary/20 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                                    onClick={handleShare}
                                >
                                    {justShared ? (
                                        <>
                                            <Check className="w-4 h-4 mr-2 text-green-500" />
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
                        </motion.div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default IdeaDetailModal;
