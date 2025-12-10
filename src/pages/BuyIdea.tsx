import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, CreditCard, Check, Lock, MessageCircle, Star, TrendingUp, Zap } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { fetchIdeaBySlug, recordPurchase } from "@/services/ideaService";
import { useChat } from "@/context/ChatContext";
import { useAuth } from "@/context/AuthContext";
import ChatWindow from "@/components/chat/ChatWindow";
import { toast as sonnerToast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const BuyIdea = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [idea, setIdea] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [chatOpen, setChatOpen] = useState(false);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("details");
    const { getOrCreateConversation } = useChat();
    const { user } = useAuth();

    useEffect(() => {
        const loadIdea = async () => {
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

    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>;
    if (!idea) return <div className="min-h-screen bg-background flex items-center justify-center">Idea not found</div>;

    const priceString = idea.price.replace(/[$,]/g, "");
    const price = Number(priceString);
    const platformFee = price * 0.13;
    const total = price + platformFee;

    const handlePurchase = async () => {
        try {
            await recordPurchase(idea.id, idea.title, total, idea.user_id);
            toast({
                title: "Purchase Request Sent!",
                description: "Your purchase is pending admin approval. You will be notified once approved.",
            });
            setTimeout(() => navigate("/profile"), 2000);
        } catch (error) {
            console.error("Purchase failed", error);
            toast({
                title: "Purchase Failed",
                description: "There was an error processing your purchase. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleMessageSeller = async () => {
        if (!user) {
            sonnerToast.error("Please log in to message the seller");
            navigate('/login');
            return;
        }
        if (user.id === idea.user_id) {
            sonnerToast.error("You cannot message yourself");
            return;
        }
        setChatOpen(true);
        try {
            const convoId = await getOrCreateConversation(idea.user_id, idea.profiles?.full_name || 'Seller');
            setConversationId(convoId);
        } catch (error) {
            console.error('Error creating conversation:', error);
            sonnerToast.error("Failed to create chat");
            setChatOpen(false);
        }
    };

    return (
        <div className="min-h-screen bg-background font-sans">
            <Navbar />
            <main className="pt-32 pb-20 container mx-auto px-4 max-w-6xl">
                <Link to="/marketplace" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors text-sm font-medium">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Marketplace
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                                    {idea.category}
                                </span>
                                {idea.badge && (
                                    <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-accent text-white text-xs font-bold shadow-lg shadow-accent/20">
                                        <Zap className="w-3 h-3 fill-current" />
                                        {idea.badge.toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <h1 className="display-lg font-outfit text-foreground mb-4 leading-tight">{idea.title}</h1>
                            <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8">
                                <div className="flex items-center gap-2">
                                    <img src={`https://ui-avatars.com/api/?name=${idea.seller}&background=0FA3B1&color=fff`} className="w-6 h-6 rounded-full" />
                                    <span>Added by <span className="font-semibold text-foreground">{idea.seller}</span></span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Shield className="w-4 h-4 text-emerald-500" />
                                    <span>{idea.uniqueness}% Unique</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                    <span>{idea.rating}/5 Rating</span>
                                </div>
                            </div>

                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="bg-secondary/10 p-1 rounded-xl mb-8 w-full justify-start h-12">
                                    <TabsTrigger value="details" className="rounded-lg h-9 px-6 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Overview</TabsTrigger>
                                    <TabsTrigger value="payment" className="rounded-lg h-9 px-6 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Purchase & Access</TabsTrigger>
                                </TabsList>
                                <TabsContent value="details" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <div className="glass-card p-8 rounded-2xl">
                                        <h3 className="text-xl font-bold font-outfit mb-4">Description</h3>
                                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-lg">
                                            {idea.description}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="glass-card p-6 rounded-2xl">
                                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                                <TrendingUp className="w-5 h-5 text-primary" /> Market Potential
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                Highly scalable with {idea.market_potential || "significant"} growth opportunities in the {idea.category} sector.
                                            </p>
                                        </div>
                                        <div className="glass-card p-6 rounded-2xl">
                                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                                <Lock className="w-5 h-5 text-primary" /> IP Ownership
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                Includes full intellectual property rights transfer and non-compete agreement from the seller.
                                            </p>
                                        </div>
                                    </div>
                                </TabsContent>
                                <TabsContent value="payment" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <div className="glass-card p-8 rounded-2xl border-primary/10">
                                        <h3 className="text-xl font-bold font-outfit mb-6">Select Payment Method</h3>
                                        <RadioGroup defaultValue="card" className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                            <div>
                                                <RadioGroupItem value="card" id="card" className="peer sr-only" />
                                                <Label htmlFor="card" className="flex flex-col items-center justify-center gap-3 h-32 rounded-xl border-2 border-muted bg-card/50 p-4 hover:bg-accent/5 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all">
                                                    <CreditCard className="h-8 w-8 text-foreground" />
                                                    <span className="font-medium">Credit Card</span>
                                                </Label>
                                            </div>
                                            <div>
                                                <RadioGroupItem value="paypal" id="paypal" className="peer sr-only" />
                                                <Label htmlFor="paypal" className="flex flex-col items-center justify-center gap-3 h-32 rounded-xl border-2 border-muted bg-card/50 p-4 hover:bg-accent/5 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all">
                                                    <span className="text-2xl font-bold italic">Pay<span className="text-blue-600">Pal</span></span>
                                                    <span className="font-medium">PayPal</span>
                                                </Label>
                                            </div>
                                        </RadioGroup>

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Cardholder Name</Label>
                                                <Input id="name" placeholder="John Doe" className="h-12 bg-background/50" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="number">Card Number</Label>
                                                <Input id="number" placeholder="0000 0000 0000 0000" className="h-12 bg-background/50" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="expiry">Expiry</Label>
                                                    <Input id="expiry" placeholder="MM/YY" className="h-12 bg-background/50" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="cvc">CVC</Label>
                                                    <Input id="cvc" placeholder="123" className="h-12 bg-background/50" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-green-500 bg-green-500/10 p-4 rounded-xl border border-green-500/20">
                                        <Lock className="w-4 h-4" />
                                        <span>256-bit SSL Encrypted Payment. Your data is secure.</span>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </motion.div>
                    </div>

                    {/* Sidebar / Checkout Summary */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="glass-card p-6 rounded-2xl sticky top-28 border border-primary/10 shadow-xl shadow-primary/5"
                        >
                            <h3 className="text-xl font-bold font-outfit mb-6">Order Summary</h3>

                            <div className="space-y-4 mb-6 pb-6 border-b border-border/50">
                                <div className="flex justify-between text-base">
                                    <span className="text-muted-foreground">{idea.title}</span>
                                    <span className="font-medium">${price.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Platform Fee (13%)</span>
                                    <span>${platformFee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-end mb-8">
                                <span className="text-lg font-bold text-foreground">Total</span>
                                <span className="text-3xl font-black text-primary">${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>

                            <div className="space-y-3">
                                <Button
                                    size="lg"
                                    className="w-full h-12 text-base rounded-xl magnetic-btn bg-gradient-to-r from-primary to-emerald-500 hover:from-primary/90 hover:to-emerald-500/90 shadow-lg shadow-primary/25"
                                    onClick={() => {
                                        if (activeTab === "details") {
                                            setActiveTab("payment");
                                        } else {
                                            handlePurchase();
                                        }
                                    }}
                                >
                                    {activeTab === "details" ? "Complete Purchase" : "Proceed"}
                                </Button>
                                <Button variant="outline" size="lg" className="w-full h-12 rounded-xl border-primary/20 hover:bg-primary/5" onClick={handleMessageSeller}>
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Chat with Seller
                                </Button>
                            </div>

                            <div className="mt-8 space-y-3">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                                        <Check className="w-3 h-3 text-green-500" />
                                    </div>
                                    <span>Instant download of all assets</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                                        <Check className="w-3 h-3 text-green-500" />
                                    </div>
                                    <span>Verify ownership on blockchain</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                                        <Check className="w-3 h-3 text-green-500" />
                                    </div>
                                    <span>100% money-back guarantee</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
            <Footer />
            {chatOpen && (
                conversationId ? (
                    <ChatWindow conversationId={conversationId} recipientName={idea.profiles?.full_name || 'Seller'} onClose={() => { setChatOpen(false); setConversationId(null); }} />
                ) : (
                    <Card className="fixed bottom-4 right-4 w-96 h-[200px] shadow-2xl border-border/50 bg-card/95 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                            <p className="text-sm text-muted-foreground">Opening chat...</p>
                        </div>
                    </Card>
                )
            )}
        </div>
    );
};

export default BuyIdea;
