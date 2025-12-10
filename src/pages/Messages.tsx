import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Inbox, Send, X, ArrowLeft, Circle } from 'lucide-react';
import { useState } from 'react';
import ChatWindow from '@/components/chat/ChatWindow';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function Messages() {
    const { conversations, loading } = useChat();
    const { user } = useAuth();
    const [activeConversation, setActiveConversation] = useState<{ id: string; name: string } | null>(null);
    const navigate = useNavigate();

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                {/* Animated Background */}
                <div className="fixed inset-0 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-primary/[0.06] rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '8s' }} />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-accent/[0.06] rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '10s' }} />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-background/80 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl p-12 relative overflow-hidden max-w-md mx-4"
                >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 text-center">
                        <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-6">
                            <MessageCircle className="w-12 h-12 text-primary" />
                        </div>
                        <h2 className="text-2xl font-black font-outfit mb-3">Sign In Required</h2>
                        <p className="text-muted-foreground mb-6">Please log in to view and send messages</p>
                        <Button
                            onClick={() => navigate('/login')}
                            className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/20"
                        >
                            Log In
                        </Button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background font-sans">
            <Navbar />

            {/* Animated Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-primary/[0.06] rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-accent/[0.06] rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '10s' }} />
            </div>

            <main className="pt-24 pb-20 relative z-10">
                <div className="container mx-auto px-4 max-w-6xl">

                    {/* Page Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h1 className="text-4xl md:text-5xl font-black font-outfit mb-3 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                            Messages
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Connect with buyers and sellers
                        </p>
                    </motion.div>

                    {/* Messages Container */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-background/80 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative"
                    >
                        {/* Decorative gradient */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl pointer-events-none" />

                        <div className="relative z-10 p-8">
                            {loading ? (
                                <div className="text-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                                    <p className="text-muted-foreground">Loading conversations...</p>
                                </div>
                            ) : conversations.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="inline-flex p-6 rounded-3xl bg-muted/20 mb-6">
                                        <Inbox className="w-16 h-16 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-2xl font-black font-outfit mb-3">No messages yet</h3>
                                    <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                                        Start a conversation by clicking "Message Seller" on any idea in the marketplace
                                    </p>
                                    <Button
                                        onClick={() => navigate('/marketplace')}
                                        className="h-12 px-8 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/20"
                                    >
                                        Browse Marketplace
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {conversations.map((conversation, idx) => {
                                        const otherParticipantId = conversation.participant_1 === user.id
                                            ? conversation.participant_2
                                            : conversation.participant_1;
                                        const otherParticipantName = conversation.participant_names?.[otherParticipantId] || 'Unknown';

                                        return (
                                            <motion.div
                                                key={conversation.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                onClick={() => setActiveConversation({ id: conversation.id, name: otherParticipantName })}
                                                className={`group flex items-center gap-4 p-5 rounded-2xl cursor-pointer transition-all border ${conversation.unread_count > 0
                                                        ? 'bg-gradient-to-r from-primary/10 to-transparent border-primary/30 hover:border-primary/50'
                                                        : 'bg-gradient-to-r from-secondary/5 to-transparent border-white/5 hover:border-white/10 hover:from-secondary/10'
                                                    }`}
                                            >
                                                <div className="relative">
                                                    <Avatar className="w-14 h-14 border-2 border-background shadow-lg">
                                                        <AvatarFallback className="text-lg font-black bg-gradient-to-br from-primary to-accent text-white">
                                                            {otherParticipantName.charAt(0).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    {conversation.unread_count > 0 && (
                                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                                                            <Circle className="w-3 h-3 fill-white text-white" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <h4 className={`font-bold text-lg ${conversation.unread_count > 0 ? 'text-foreground' : 'text-foreground/80'}`}>
                                                            {otherParticipantName}
                                                        </h4>
                                                        <div className="text-xs text-muted-foreground">
                                                            {conversation.updated_at instanceof Date
                                                                ? conversation.updated_at.toLocaleDateString()
                                                                : new Date(conversation.updated_at).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between gap-3">
                                                        <p className={`text-sm truncate ${conversation.unread_count > 0
                                                                ? 'font-semibold text-foreground'
                                                                : 'text-muted-foreground'
                                                            }`}>
                                                            {conversation.last_message || 'No messages yet'}
                                                        </p>
                                                        {conversation.unread_count > 0 && (
                                                            <span className="flex-shrink-0 bg-accent text-white text-xs px-2.5 py-1 rounded-full font-bold">
                                                                {conversation.unread_count}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <MessageCircle className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Chat Window Overlay */}
            <AnimatePresence>
                {activeConversation && (
                    <ChatWindow
                        conversationId={activeConversation.id}
                        recipientName={activeConversation.name}
                        onClose={() => setActiveConversation(null)}
                    />
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
}
