import { useState, useEffect, useRef } from 'react';
import { useChat, type Message } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, X, CheckCheck, Loader2, Pencil, Info, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type ChatWindowProps = {
    conversationId: string;
    recipientName: string;
    onClose: () => void;
};

export default function ChatWindow({ conversationId, recipientName, onClose }: ChatWindowProps) {
    const { user } = useAuth();
    const { sendMessage, editMessage, deleteMessage, getMessages, subscribeToMessages } = useChat();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [lastMessageStatus, setLastMessageStatus] = useState<'sending' | 'sent' | 'error' | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showRules, setShowRules] = useState(false);

    useEffect(() => {
        const unsubscribe = subscribeToMessages(conversationId, (msgs) => {
            setMessages(msgs);
        });

        return () => unsubscribe();
    }, [conversationId, subscribeToMessages]);

    useEffect(() => {
        // Auto-scroll to bottom when messages change, unless editing
        if (scrollRef.current && !editingMessageId) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, editingMessageId]);

    const handleSend = async () => {
        if (!newMessage.trim() || sending) return;

        const messageContent = newMessage.trim();
        setNewMessage(''); // Clear input immediately for instant feedback
        setSending(true);
        setLastMessageStatus('sending');
        setErrorMessage(null);

        try {
            await sendMessage(conversationId, messageContent);
            setLastMessageStatus('sent');
            // Reset status after a short delay
            setTimeout(() => setLastMessageStatus(null), 2000);
        } catch (error: any) {
            console.error('Error sending message:', error);
            setLastMessageStatus('error');
            setErrorMessage(error.message || 'Failed to send');
            setNewMessage(messageContent); // Restore message on error
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
            setErrorMessage('Failed to edit message.');
        }
    };

    const handleDelete = async (messageId: string) => {
        if (window.confirm('Are you sure you want to delete this message?')) {
            try {
                await deleteMessage(messageId);
                // The subscription will automatically update the messages list
                // after the delete operation completes in the database
            } catch (error) {
                console.error('Error deleting message:', error);
                setErrorMessage('Failed to delete message.');
            }
        }
    };

    const startEditing = (message: Message) => {
        setEditingMessageId(message.id);
        setEditContent(message.content);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <Card className="fixed bottom-4 left-4 w-96 h-[600px] shadow-2xl border-border/50 bg-card/95 backdrop-blur-sm flex flex-col z-50">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary">
                            {recipientName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-semibold">{recipientName}</h3>
                        <p className="text-xs text-muted-foreground">Online</p>
                    </div>
                </div>
                <div className="flex gap-1">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => setShowRules(!showRules)}>
                                    <Info className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Chat Rules</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Rules Alert */}
            {showRules && (
                <div className="p-4 bg-muted/50 border-b border-border/50 text-xs">
                    <h4 className="font-semibold mb-2">Chat Rules:</h4>
                    <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                        <li>Only last 5 messages per person are kept.</li>
                        <li>You can edit your own messages.</li>
                        <li>You can delete messages (unless replied to).</li>
                        <li>Max 2 consecutive messages allowed (wait for reply).</li>
                    </ul>
                </div>
            )}

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef as any}>
                <div className="space-y-4">
                    {messages.map((message, index) => {
                        const isMe = message.sender_id === user?.id;
                        const isEditing = editingMessageId === message.id;

                        // Check if message has a reply (subsequent message from other user)
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
                                    <div className="flex flex-col gap-1 self-center ml-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 text-muted-foreground hover:text-foreground"
                                            onClick={() => startEditing(message)}
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
                {lastMessageStatus && (
                    <div className="mb-2 text-xs flex items-center gap-1">
                        {lastMessageStatus === 'sending' && (
                            <>
                                <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                                <span className="text-muted-foreground">Sending...</span>
                            </>
                        )}
                        {lastMessageStatus === 'sent' && (
                            <>
                                <CheckCheck className="h-3 w-3 text-green-500" />
                                <span className="text-green-500">Sent</span>
                            </>
                        )}
                        {lastMessageStatus === 'error' && (
                            <>
                                <X className="h-3 w-3 text-destructive" />
                                <span className="text-destructive">{errorMessage || 'Failed to send. Try again?'}</span>
                            </>
                        )}
                    </div>
                )}
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
        </Card>
    );
}
