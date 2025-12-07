import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Inbox } from 'lucide-react';
import { useState } from 'react';
import ChatWindow from '@/components/chat/ChatWindow';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';

export default function Messages() {
    const { conversations, loading } = useChat();
    const { user } = useAuth();
    const [activeConversation, setActiveConversation] = useState<{ id: string; name: string } | null>(null);
    const navigate = useNavigate();

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="max-w-md">
                    <CardContent className="pt-6">
                        <p className="text-center">Please log in to view messages</p>
                        <Button onClick={() => navigate('/login')} className="w-full mt-4">
                            Log In
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-24 pb-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageCircle className="h-6 w-6" />
                                Messages
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    Loading conversations...
                                </div>
                            ) : conversations.length === 0 ? (
                                <div className="text-center py-12">
                                    <Inbox className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
                                    <p className="text-muted-foreground">
                                        Start a conversation by clicking "Message Seller" on any idea in the marketplace
                                    </p>
                                    <Button onClick={() => navigate('/marketplace')} className="mt-4">
                                        Browse Marketplace
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {conversations.map((conversation) => {
                                        const otherParticipantId = conversation.participant_1 === user.id
                                            ? conversation.participant_2
                                            : conversation.participant_1;
                                        const otherParticipantName = conversation.participant_names?.[otherParticipantId] || 'Unknown';

                                        return (
                                            <div
                                                key={conversation.id}
                                                onClick={() => setActiveConversation({ id: conversation.id, name: otherParticipantName })}
                                                className={`flex items-center gap-3 p-4 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors border border-border/30 ${conversation.unread_count > 0 ? 'bg-muted/30 border-primary/30' : ''}`}
                                            >
                                                <Avatar className="h-12 w-12">
                                                    <AvatarFallback className="bg-primary/10 text-primary">
                                                        {otherParticipantName.charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <h4 className={`font-semibold ${conversation.unread_count > 0 ? 'text-foreground' : ''}`}>{otherParticipantName}</h4>
                                                        {conversation.unread_count > 0 && (
                                                            <span className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full">
                                                                {conversation.unread_count} new
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className={`text-sm truncate ${conversation.unread_count > 0 ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>
                                                        {conversation.last_message || 'No messages yet'}
                                                    </p>
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {conversation.updated_at instanceof Date
                                                        ? conversation.updated_at.toLocaleDateString()
                                                        : new Date(conversation.updated_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {activeConversation && (
                    <ChatWindow
                        conversationId={activeConversation.id}
                        recipientName={activeConversation.name}
                        onClose={() => setActiveConversation(null)}
                    />
                )}
            </div>
        </div>
    );
}
