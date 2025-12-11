import { motion } from "framer-motion";
import { Heart, Pencil, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface IdeaCardProps {
    idea: any;
    onClick?: () => void;
    className?: string;
    viewMode?: "grid" | "list";
    variant?: "default" | "profile";
    status?: "pending" | "approved" | "rejected";
    onEdit?: () => void;
}

const ScoreRing = ({ score, total = 100, color = "text-primary", label }: { score: number, total?: number, color?: string, label: string }) => {
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / total) * circumference;

    return (
        <div className="flex flex-col items-center gap-1.5">
            <div className="relative w-14 h-14 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        className="text-secondary"
                        strokeWidth="3"
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx="28"
                        cy="28"
                    />
                    <circle
                        className={color}
                        strokeWidth="3"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx="28"
                        cy="28"
                    />
                </svg>
                <span className={`absolute text-xs font-bold ${color}`}>{score}</span>
            </div>
            <span className="text-[9px] text-muted-foreground font-medium uppercase tracking-wider">{label}</span>
        </div>
    );
};

const IdeaCard = ({
    idea,
    onClick,
    className = "",
    viewMode = "grid",
    variant = "default",
    status,
    onEdit
}: IdeaCardProps) => {
    const navigate = useNavigate();

    // Extract scores from ai_scores or use defaults
    const viabilityScore = idea.ai_scores?.viability || idea.validation_score || 75;
    const innovationScore = idea.ai_scores?.innovation || idea.feasibility_score || 68;
    const impactScore = idea.ai_scores?.impact || idea.uniqueness_score || 88;

    const scores = [
        { score: viabilityScore, color: "text-primary", label: "Viability" },
        { score: innovationScore, color: "text-primary/80", label: "Innovation" },
        { score: impactScore, color: "text-primary", label: "Impact" }
    ];

    // Get real username from idea owner
    const ownerUsername = idea.profiles?.username || idea.owner_username || idea.username || "Anonymous";
    const likesCount = idea.likes_count || idea.likes || 0;

    const handleDetailsClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/demo/${idea.slug}`);
    };

    if (viewMode === "list") {
        return (
            <div onClick={onClick} className={`cursor-pointer bg-card/50 border border-border/50 p-4 rounded-xl flex gap-4 items-center hover:border-primary/50 transition-colors ${className}`}>
                {/* Simplified List View */}
                <div className="font-bold text-foreground flex-1">{idea.title}</div>
                <div className="text-primary font-bold">{idea.price}</div>
            </div>
        )
    }

    return (
        <motion.div
            whileHover={{ y: -4 }}
            onClick={onClick}
            className={`group relative flex flex-col justify-between bg-card border border-border hover:border-primary rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-[0_10px_40px_-10px_hsl(var(--primary)/0.2)] transition-all duration-300 ${className}`}
        >
            {/* Edit Button Overlay for Profile Variant */}
            {onEdit && (
                <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 rounded-full bg-background/80 hover:bg-background"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit();
                        }}
                    >
                        <Pencil className="w-4 h-4" />
                    </Button>
                </div>
            )}

            <div className="p-6 space-y-4">
                {/* Header: Username & Likes */}
                <div className="flex items-center justify-between">
                    {variant === 'profile' && status ? (
                        <Badge
                            variant="outline"
                            className={`
                                ${status === 'approved' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                    status === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                        'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}
                            `}
                        >
                            {status === 'approved' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                            {status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                            {status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Badge>
                    ) : (
                        <div className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary font-semibold">
                            {ownerUsername}
                        </div>
                    )}

                    {/* Likes */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/5 border border-primary/10">
                        <Heart className="w-3.5 h-3.5 fill-primary text-primary" />
                        <span className="text-xs font-bold text-primary">{likesCount}</span>
                    </div>
                </div>

                {/* Title & Description */}
                <div className="space-y-1">
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {idea.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                        {idea.description}
                    </p>
                </div>

                {/* Score Rings with Labels */}
                <div className="flex items-center justify-between gap-3 py-2">
                    {scores.map((s, i) => (
                        <ScoreRing key={i} score={s.score} color={s.color} label={s.label} />
                    ))}
                </div>
            </div>

            {/* Footer: Price & Details Button */}
            <div className="px-6 pb-6 pt-2 mt-auto border-t border-border/50">
                <div className="flex items-end justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-bold mb-0.5">
                            ASKING PRICE
                        </span>
                        <span className="text-2xl font-black text-foreground group-hover:text-primary group-hover:scale-110 font-outfit tracking-tight transition-all duration-300 origin-left">
                            {idea.price}
                        </span>
                    </div>

                    {/* Details Button - Shows on Hover - Darker Background */}
                    <Button
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20"
                        onClick={handleDetailsClick}
                    >
                        Details
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

export default IdeaCard;
