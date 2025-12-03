import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Shield, User } from "lucide-react";

interface IdeaDetailModalProps {
    idea: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const IdeaDetailModal = ({ idea, open, onOpenChange }: IdeaDetailModalProps) => {
    if (!idea) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl p-0 gap-0 overflow-hidden glass-card border-border/50">
                <div className="grid md:grid-cols-2 h-full max-h-[80vh] overflow-y-auto">
                    {/* Left: Image/Visual */}
                    <div className={`p-8 flex flex-col justify-between relative overflow-hidden ${idea.color === "primary" ? "bg-primary/5" :
                            idea.color === "secondary" ? "bg-secondary/5" : "bg-accent/5"
                        }`}>
                        <div className="relative z-10">
                            <Badge variant="outline" className="mb-4 bg-background/50 backdrop-blur-sm">
                                {idea.category}
                            </Badge>
                            <h2 className="text-3xl font-black mb-2 leading-tight">{idea.title}</h2>
                            <div className="flex items-center gap-2 mb-6">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    ))}
                                </div>
                                <span className="text-sm text-muted-foreground">(4.9)</span>
                            </div>
                        </div>

                        {/* Abstract Visual */}
                        <div className={`absolute -right-10 -bottom-10 w-64 h-64 rounded-full blur-3xl opacity-50 ${idea.color === "primary" ? "bg-primary" :
                                idea.color === "secondary" ? "bg-secondary" : "bg-accent"
                            }`} />

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                    <User className="w-5 h-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium">Created by</div>
                                    <div className="text-sm font-bold">Alex Innovator</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Details */}
                    <div className="p-8 bg-card">
                        <DialogHeader className="mb-6">
                            <DialogTitle className="sr-only">{idea.title}</DialogTitle>
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-2xl font-bold">{idea.price}</div>
                                <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">
                                    Verified
                                </Badge>
                            </div>
                            <p className="text-muted-foreground text-sm">
                                One-time payment. Includes full IP rights and documentation.
                            </p>
                        </DialogHeader>

                        <div className="space-y-6">
                            <div>
                                <h3 className="font-bold mb-3 flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-primary" />
                                    What's Included
                                </h3>
                                <ul className="space-y-2">
                                    {["Business Model Canvas", "Go-to-Market Strategy", "Financial Projections", "Tech Stack Recommendations"].map((item, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                            <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-bold mb-3 flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-secondary" />
                                    Uniqueness Score: {idea.uniqueness}%
                                </h3>
                                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-primary to-secondary"
                                        style={{ width: `${idea.uniqueness}%` }}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Validated against 50M+ existing businesses and patents.
                                </p>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <Button className="flex-1 magnetic-btn bg-primary hover:bg-primary/90 glow-purple">
                                    Buy Now
                                </Button>
                                <Button variant="outline" className="flex-1">
                                    View Demo
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default IdeaDetailModal;
