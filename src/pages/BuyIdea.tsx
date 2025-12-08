import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, CreditCard, Check, Lock, MessageCircle } from "lucide-react";
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

    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
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
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-24 pb-16 container mx-auto px-4 max-w-5xl">
                <Link to="/marketplace" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Marketplace
                </Link>
                {/* Tab navigation */}
                <Tabs defaultValue="details" className="w-full mb-8">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="details">Details</TabsTrigger>
                        <TabsTrigger value="payment">Purchase</TabsTrigger>
                    </TabsList>
                    <TabsContent value="details" className="space-y-6">
                        <h2 className="text-2xl font-outfit font-bold">{idea.title}</h2>
                        <p className="text-muted-foreground">{idea.description}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Seller: {idea.seller}</span>
                            <span>•</span>
                            <span>{new Date(idea.created_at).toLocaleDateString()}</span>
                        </div>
                    </TabsContent>
                    <TabsContent value="payment" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Checkout Form */}
                        <div className="lg:col-span-2 space-y-8">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 md:p-8">
                                <h2 className="text-2xl font-outfit font-bold mb-6">Payment Details</h2>
                                <div className="space-y-6">
                                    <RadioGroup defaultValue="card" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <RadioGroupItem value="card" id="card" className="peer sr-only" />
                                            <Label htmlFor="card" className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-transparent p-4 hover:bg-accent/5 hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary cursor-pointer transition-all">
                                                <CreditCard className="mb-3 h-6 w-6" />
                                                Credit Card
                                            </Label>
                                        </div>
                                        <div>
                                            <RadioGroupItem value="paypal" id="paypal" className="peer sr-only" />
                                            <Label htmlFor="paypal" className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-transparent p-4 hover:bg-accent/5 hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary cursor-pointer transition-all">
                                                <span className="mb-3 text-xl font-bold italic">Pay<span className="text-blue-600">Pal</span></span>
                                                PayPal
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                    <div className="grid gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">Cardholder Name</Label>
                                            <Input id="name" placeholder="John Doe" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="number">Card Number</Label>
                                            <Input id="number" placeholder="0000 0000 0000 0000" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="expiry">Expiry Date</Label>
                                                <Input id="expiry" placeholder="MM/YY" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="cvc">CVC</Label>
                                                <Input id="cvc" placeholder="123" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg">
                                <Lock className="w-4 h-4" />
                                <span>Your payment information is encrypted and secure.</span>
                            </div>
                        </div>
                        {/* Right Column: Order Summary */}
                        <div className="lg:col-span-1">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 sticky top-24">
                                <h3 className="text-xl font-outfit font-bold mb-4">Order Summary</h3>
                                <div className="mb-6 pb-6 border-b border-border/50">
                                    <div className="text-sm text-muted-foreground mb-1">Buying</div>
                                    <div className="font-semibold text-foreground">{idea.title}</div>
                                    <div className="text-sm text-muted-foreground mt-1">by {idea.seller}</div>
                                </div>
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Idea Price</span>
                                        <span>${price.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Platform Fee (13%)</span>
                                        <span>${platformFee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="pt-3 border-t border-border/50 flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span className="text-primary">${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                </div>
                                <Button variant="outline" size="lg" className="w-full mb-3" onClick={handleMessageSeller}>
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Message Seller
                                </Button>
                                <Button size="lg" className="w-full magnetic-btn bg-primary hover:bg-primary/90 glow-purple mb-4" onClick={handlePurchase}>
                                    Complete Purchase
                                </Button>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Check className="w-3 h-3 text-green-500" />
                                        <span>Instant access to all assets</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Check className="w-3 h-3 text-green-500" />
                                        <span>Secure IP transfer</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Check className="w-3 h-3 text-green-500" />
                                        <span>14-day money-back guarantee</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </TabsContent>
                </Tabs>
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
