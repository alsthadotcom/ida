import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles, TrendingUp, Zap, ChevronRight, Shield, Star, Edit, Clock, XCircle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface IdeaCardProps {
    idea: any;
    onClick?: () => void;
    className?: string;
    featured?: boolean;
    viewMode?: "grid" | "list";
    variant?: "marketplace" | "profile";
    status?: "pending" | "approved" | "rejected";
    onEdit?: (e: React.MouseEvent) => void;
}

const IdeaCard = ({
    idea,
    onClick,
    className = "",
    featured = false,
    viewMode = "grid",
    variant = "marketplace",
    status,
    onEdit
}: IdeaCardProps) => {
    const isSaaS = idea.category === 'SaaS';
    const isAI = idea.category === 'AI & ML';

    // Dynamic gradient based on category
    const gradient = isSaaS
        ? "from-blue-500/20 via-cyan-500/5 to-transparent"
        : isAI
            ? "from-purple-500/20 via-pink-500/5 to-transparent"
            : "from-orange-500/20 via-amber-500/5 to-transparent";

    const iconColor = isSaaS ? "text-blue-500" : isAI ? "text-purple-500" : "text-orange-500";
    const badgeBg = isSaaS ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : isAI ? "bg-purple-500/10 text-purple-500 border-purple-500/20" : "bg-orange-500/10 text-orange-500 border-orange-500/20";

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <Badge className="bg-green-500/10 text-green-500 border-green-500/20 gap-1"><CheckCircle2 className="w-3 h-3" /> Approved</Badge>;
            case 'rejected':
                return <Badge className="bg-red-500/10 text-red-500 border-red-500/20 gap-1"><XCircle className="w-3 h-3" /> Rejected</Badge>;
            default:
                return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 gap-1"><Clock className="w-3 h-3" /> Pending</Badge>;
        }
    };

    if (viewMode === "list") {
        return (
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={onClick}
                className={`group cursor-pointer glass-card p-4 flex flex-col md:flex-row gap-6 items-center hover:border-primary/30 transition-all duration-300 ${className}`}
            >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${isSaaS ? 'bg-blue-500/10 text-blue-500' : isAI ? 'bg-purple-500/10 text-purple-500' : 'bg-orange-500/10 text-orange-500'}`}>
                    <TrendingUp className="w-8 h-8" />
                </div>

                <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                        <Badge variant="outline" className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider ${badgeBg}`}>
                            {idea.category}
                        </Badge>
                        {idea.badge && (
                            <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[10px] font-bold border border-accent/20">
                                {idea.badge}
                            </span>
                        )}
                        {variant === "profile" && status && (
                            <div className="ml-2">{getStatusBadge(status)}</div>
                        )}
                    </div>
                    <h3 className="font-outfit font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                        {idea.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-1">{idea.description}</p>
                </div>

                <div className="flex items-center gap-6">
                    {idea.uniqueness !== undefined && (
                        <div className="text-center hidden sm:block">
                            <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Uniqueness</div>
                            <div className="font-bold text-foreground text-sm flex items-center gap-1 justify-center"><Shield className="w-3 h-3 text-emerald-500" /> {idea.uniqueness}%</div>
                        </div>
                    )}
                    {idea.rating !== undefined && (
                        <div className="text-center hidden sm:block">
                            <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Rating</div>
                            <div className="font-bold text-foreground text-sm flex items-center gap-1 justify-center"><Star className="w-3 h-3 text-amber-500" /> {idea.rating}</div>
                        </div>
                    )}
                    <div className="text-right min-w-[80px]">
                        <div className="text-xl font-outfit font-black text-foreground">{idea.price}</div>
                    </div>

                    {variant === "profile" && onEdit ? (
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(e);
                            }}
                            className="shrink-0 gap-1 hover:bg-primary hover:text-white"
                        >
                            <Edit className="w-4 h-4" /> Edit
                        </Button>
                    ) : (
                        <Button size="icon" variant="ghost" className="rounded-full h-10 w-10 shrink-0 group-hover:bg-primary/10 group-hover:text-primary">
                            <ChevronRight className="w-5 h-5" />
                        </Button>
                    )}
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.01 }}
            onClick={onClick}
            className={`group relative flex flex-col h-full bg-background border border-border/40 rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 ${className}`}
        >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

            {/* Top Section */}
            <div className="relative p-6 pb-2 z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className={`rounded-full px-3 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-background/50 backdrop-blur-sm ${badgeBg}`}>
                                {idea.category}
                            </Badge>
                            {idea.badge && (
                                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500">
                                    <Zap className="w-3 h-3 fill-current" />
                                    {idea.badge}
                                </span>
                            )}
                        </div>
                        {variant === "profile" && status && (
                            <div>{getStatusBadge(status)}</div>
                        )}
                    </div>

                    {variant === "profile" && onEdit ? (
                        <Button
                            size="icon"
                            variant="secondary"
                            className="w-10 h-10 rounded-full hover:bg-primary hover:text-white transition-colors duration-300"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(e);
                            }}
                        >
                            <Edit className="w-4 h-4" />
                        </Button>
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-secondary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                            <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45" />
                        </div>
                    )}
                </div>

                <h3 className="text-xl font-bold font-outfit text-foreground leading-tight mb-2 group-hover:text-primary transition-colors">
                    {idea.title}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed h-10">
                    {idea.description}
                </p>
            </div>

            {/* Divider */}
            <div className="mx-6 my-4 h-px bg-border/40 group-hover:bg-primary/20 transition-colors" />

            {/* Bottom Stats */}
            <div className="relative px-6 pb-6 pt-0 mt-auto z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground">
                        {idea.uniqueness !== undefined && (
                            <div className="flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-primary" />
                                <span>{idea.uniqueness}% Unique</span>
                            </div>
                        )}
                        {idea.rating !== undefined && (
                            <div className="flex items-center gap-1.5">
                                <Star className="w-3.5 h-3.5 text-amber-500" />
                                <span>{idea.rating}/5</span>
                            </div>
                        )}
                    </div>
                    <div className="text-lg font-black font-outfit tracking-tight text-foreground">
                        {idea.price}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default IdeaCard;
