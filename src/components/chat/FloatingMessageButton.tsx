import { MessageCircle, ArrowLeft, Circle, Inbox } from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Send, X, Loader2, Pencil, Trash2, CheckCheck } from 'lucide-react';
import { useEffect, useRef } from 'react';
import type { Message } from '@/context/ChatContext';

export default function FloatingMessageButton() {
    const { conversations, loading, sendMessage, editMessage, deleteMessage, subscribeToMessages } = useChat();
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [activeConversation, setActiveConversation] = useState<{ id: string; name: string } | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const messageCount = conversations.length;

    // Subscribe to messages when a conversation is active
    useEffect(() => {
        if (activeConversation) {
            const unsubscribe = subscribeToMessages(activeConversation.id, (msgs) => {
                setMessages(msgs);
            });
            return () => unsubscribe();
        }
    }, [activeConversation, subscribeToMessages]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current && !editingMessageId) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, editingMessageId]);

    const handleOpenToggle = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setIsOpen(!isOpen);
        if (!isOpen) {
            setActiveConversation(null);
        }
    };

    const handleSend = async () => {
        if (!newMessage.trim() || sending || !activeConversation) return;

        const messageContent = newMessage.trim();
        setNewMessage('');
        setSending(true);

        try {
            await sendMessage(activeConversation.id, messageContent);
        } catch (error) {
            console.error('Error sending message:', error);
            setNewMessage(messageContent);
        } finally {
            setSending(false);
        }
    };

    const handleEdit = async (messageId: string) => {
        if (!editContent.trim()) return;
        try {
            await editMessage(messageId, editContent.trim());
            setEditingMessageId(null);
            setEditContent('');
        } catch (error) {
            console.error('Error editing message:', error);
        }
    };

    const handleDelete = async (messageId: string) => {
        if (window.confirm('Delete this message?')) {
            try {
                await deleteMessage(messageId);
            } catch (error) {
                console.error('Error deleting message:', error);
            }
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            <button
                onClick={handleOpenToggle}
                className="fixed bottom-6 left-6 z-50 flex items-center justify-center w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-110 transition-transform duration-200"
                aria-label="Messages"
            >
                <MessageCircle className="w-6 h-6" />
                {messageCount > 0 && (
                    <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-6 w-6 flex items-center justify-center p-0 rounded-full"
                    >
                        {messageCount > 9 ? '9+' : messageCount}
                    </Badge>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Card className="fixed bottom-24 left-6 w-96 h-[600px] shadow-2xl border-border/50 bg-card/95 backdrop-blur-sm flex flex-col z-50">
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent">
                                {activeConversation ? (
                                    <>
                                        <div className="flex items-center gap-3">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => setActiveConversation(null)}
                                            >
                                                <ArrowLeft className="h-4 w-4" />
                                            </Button>
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="text-sm bg-primary/10 text-primary">
                                                    {activeConversation.name.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h3 className="font-semibold text-sm">{activeConversation.name}</h3>
                                                <p className="text-xs text-muted-foreground">Online</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <h3 className="font-bold text-lg">Messages</h3>
                                            <p className="text-xs text-muted-foreground">Your conversations</p>
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-hidden">
                                {activeConversation ? (
                                    // Chat View
                                    <>
                                        <ScrollArea className="flex-1 p-4 h-[calc(600px-180px)]" ref={scrollRef as any}>
                                            <div className="space-y-4">
                                                {messages.map((message, index) => {
                                                    const isMe = message.sender_id === user?.id;
                                                    const isEditing = editingMessageId === message.id;
                                                    const hasReply = messages.slice(index + 1).some(m => m.sender_id !== user?.id);

                                                    return (
                                                        <div
                                                            key={message.id}
                                                            className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}
                                                        >
                                                            <div
                                                                className={`relative max-w-[85%] rounded-2xl px-4 py-2 ${isMe
                                                                    ? 'bg-primary text-primary-foreground rounded-br-sm'
                                                                    : 'bg-muted rounded-bl-sm'
                                                                    }`}
                                                            >
                                                                {isEditing ? (
                                                                    <div className="flex flex-col gap-2 min-w-[200px]">
                                                                        <Input
                                                                            value={editContent}
                                                                            onChange={(e) => setEditContent(e.target.value)}
                                                                            className="h-8 text-sm bg-background text-foreground"
                                                                        />
                                                                        <div className="flex gap-2 justify-end">
                                                                            <Button size="sm" variant="ghost" className="h-6 px-2 text-xs" onClick={() => setEditingMessageId(null)}>Cancel</Button>
                                                                            <Button size="sm" className="h-6 px-2 text-xs" onClick={() => handleEdit(message.id)}>Save</Button>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                        <p className="text-sm break-words">{message.content}</p>
                                                                        <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                                                            {message.created_at instanceof Date
                                                                                ? message.created_at.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                                                : new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                        </p>
                                                                    </>
                                                                )}
                                                            </div>

                                                            {isMe && !isEditing && (
                                                                <div className="flex flex-col gap-1 self-center ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-6 w-6 text-muted-foreground hover:text-foreground"
                                                                        onClick={() => {
                                                                            setEditingMessageId(message.id);
                                                                            setEditContent(message.content);
                                                                        }}
                                                                    >
                                                                        <Pencil className="h-3 w-3" />
                                                                    </Button>
                                                                    {!hasReply && (
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                                                            onClick={() => handleDelete(message.id)}
                                                                        >
                                                                            <Trash2 className="h-3 w-3" />
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </ScrollArea>

                                        {/* Input */}
                                        <div className="p-4 border-t border-border/50">
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder="Type a message..."
                                                    value={newMessage}
                                                    onChange={(e) => setNewMessage(e.target.value)}
                                                    onKeyPress={handleKeyPress}
                                                    disabled={sending}
                                                    className="bg-background/50"
                                                />
                                                <Button onClick={handleSend} disabled={sending || !newMessage.trim()} size="icon">
                                                    {sending ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <Send className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    // Conversation List View
                                    <ScrollArea className="flex-1 p-4">
                                        {loading ? (
                                            <div className="text-center py-12">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                                                <p className="text-sm text-muted-foreground">Loading...</p>
                                            </div>
                                        ) : conversations.length === 0 ? (
                                            <div className="text-center py-12">
                                                <div className="inline-flex p-4 rounded-2xl bg-muted/20 mb-4">
                                                    <Inbox className="w-12 h-12 text-muted-foreground" />
                                                </div>
                                                <h3 className="text-lg font-bold mb-2">No messages yet</h3>
                                                <p className="text-xs text-muted-foreground mb-4">
                                                    Start chatting from the marketplace
                                                </p>
                                                <Button
                                                    size="sm"
                                                    onClick={() => {
                                                        setIsOpen(false);
                                                        navigate('/marketplace');
                                                    }}
                                                >
                                                    Browse Marketplace
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {conversations.map((conversation) => {
                                                    const otherParticipantId = conversation.participant_1 === user?.id
                                                        ? conversation.participant_2
                                                        : conversation.participant_1;
                                                    const otherParticipantName = conversation.participant_names?.[otherParticipantId] || 'Unknown';

                                                    return (
                                                        <div
                                                            key={conversation.id}
                                                            onClick={() => setActiveConversation({ id: conversation.id, name: otherParticipantName })}
                                                            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${conversation.unread_count > 0
                                                                ? 'bg-primary/10 border-primary/30 hover:bg-primary/15'
                                                                : 'bg-muted/30 border-transparent hover:bg-muted/50'
                                                                }`}
                                                        >
                                                            <div className="relative">
                                                                <Avatar className="w-10 h-10">
                                                                    <AvatarFallback className="text-sm bg-primary/10 text-primary">
                                                                        {otherParticipantName.charAt(0).toUpperCase()}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                {conversation.unread_count > 0 && (
                                                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                                                                        <Circle className="w-2 h-2 fill-white text-white" />
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex justify-between items-center">
                                                                    <h4 className={`font-semibold text-sm truncate ${conversation.unread_count > 0 ? 'text-foreground' : 'text-foreground/80'}`}>
                                                                        {otherParticipantName}
                                                                    </h4>
                                                                    <span className="text-xs text-muted-foreground">
                                                                        {new Date(conversation.updated_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center justify-between gap-2">
                                                                    <p className={`text-xs truncate ${conversation.unread_count > 0 ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                                                                        {conversation.last_message || 'No messages'}
                                                                    </p>
                                                                    {conversation.unread_count > 0 && (
                                                                        <span className="flex-shrink-0 bg-accent text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                                                                            {conversation.unread_count}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </ScrollArea>
                                )}
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
