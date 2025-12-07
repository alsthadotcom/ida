import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { RealtimeChannel } from '@supabase/supabase-js';

export type Message = {
    id: string;
    conversation_id: string;
    sender_id: string;
    content: string;
    created_at: Date;
    read: boolean;
};

export type Conversation = {
    id: string;
    participant_1: string;
    participant_2: string;
    participant_names?: { [key: string]: string };
    last_message: string;
    updated_at: Date;
    created_at: Date;
    unread_count?: number;
};

type ChatContextType = {
    conversations: Conversation[];
    loading: boolean;
    sendMessage: (conversationId: string, content: string) => Promise<void>;
    editMessage: (messageId: string, newContent: string) => Promise<void>;
    deleteMessage: (messageId: string) => Promise<void>;
    createConversation: (recipientId: string, recipientName: string) => Promise<string>;
    getOrCreateConversation: (recipientId: string, recipientName: string) => Promise<string>;
    getMessages: (conversationId: string) => Promise<Message[]>;
    subscribeToMessages: (conversationId: string, callback: (messages: Message[]) => void) => () => void;
};

const ChatContext = createContext<ChatContextType>({
    conversations: [],
    loading: true,
    sendMessage: async () => { },
    editMessage: async () => { },
    deleteMessage: async () => { },
    createConversation: async () => '',
    getOrCreateConversation: async () => '',
    getMessages: async () => [],
    subscribeToMessages: () => () => { },
});

export const ChatProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [channel, setChannel] = useState<RealtimeChannel | null>(null);

    useEffect(() => {
        if (!user) {
            setConversations([]);
            setLoading(false);
            return;
        }

        loadConversations();

        // Set up realtime subscription for conversations
        const conversationChannel = supabase
            .channel('conversations-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'conversations',
                    filter: `participant_1=eq.${user.id}`,
                },
                () => loadConversations()
            )
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'conversations',
                    filter: `participant_2=eq.${user.id}`,
                },
                () => loadConversations()
            )
            .subscribe();

        setChannel(conversationChannel);

        return () => {
            conversationChannel.unsubscribe();
        };
    }, [user]);

    const loadConversations = async () => {
        if (!user) return;

        try {
            const { data, error } = await supabase
                .from('conversations')
                .select('*')
                .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
                .order('updated_at', { ascending: false });

            if (error) throw error;

            // Fetch participant profiles for names AND unread counts
            const conversationsWithNames = await Promise.all(
                (data || []).map(async (conv) => {

                    const otherParticipantId = conv.participant_1 === user.id ? conv.participant_2 : conv.participant_1;

                    // Fetch profile
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('full_name, email')
                        .eq('id', otherParticipantId)
                        .single();

                    // Fetch unread count
                    const { count } = await supabase
                        .from('messages')
                        .select('*', { count: 'exact', head: true })
                        .eq('conversation_id', conv.id)
                        .eq('read', false)
                        .neq('sender_id', user.id);

                    const otherUserName = profile?.full_name || (profile?.email ? profile.email.split('@')[0] : 'User');
                    const myName = user.user_metadata?.full_name || (user.email ? user.email.split('@')[0] : 'You');

                    return {
                        ...conv,
                        participant_names: {
                            [user.id]: myName,
                            [otherParticipantId]: otherUserName,
                        },
                        unread_count: count || 0,
                        created_at: new Date(conv.created_at),
                        updated_at: new Date(conv.updated_at),
                    };
                })
            );

            setConversations(conversationsWithNames);
        } catch (error) {
            console.error('Error loading conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (conversationId: string, content: string) => {
        if (!user) throw new Error('User not authenticated');

        // SPAM PROTECTION: Check last 2 messages
        const { data: messages } = await supabase
            .from('messages')
            .select('sender_id')
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: false })
            .limit(2);

        if (messages && messages.length >= 2) {
            const allMine = messages.every(m => m.sender_id === user.id);
            if (allMine) {
                throw new Error("Limit reached (2 msgs). Please edit your previous message instead.");
            }
        }

        const { error } = await supabase
            .from('messages')
            .insert({
                conversation_id: conversationId,
                sender_id: user.id,
                content: content.trim(),
                read: false,
            });

        if (error) throw error;
    };

    const editMessage = async (messageId: string, newContent: string) => {
        if (!user) throw new Error('User not authenticated');

        const { error } = await supabase
            .from('messages')
            .update({ content: newContent })
            .eq('id', messageId)
            .eq('sender_id', user.id); // Security check

        if (error) throw error;
    };

    const deleteMessage = async (messageId: string) => {
        if (!user) throw new Error('User not authenticated');

        const { error } = await supabase
            .from('messages')
            .delete()
            .eq('id', messageId)
            .eq('sender_id', user.id); // Security check

        if (error) throw error;
    };

    const createConversation = async (recipientId: string, recipientName: string): Promise<string> => {
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('conversations')
            .insert({
                participant_1: user.id,
                participant_2: recipientId,
                last_message: '',
            })
            .select()
            .single();

        if (error) throw error;
        return data.id;
    };

    const getOrCreateConversation = async (recipientId: string, recipientName: string): Promise<string> => {
        if (!user) throw new Error('User not authenticated');

        // Check if conversation already exists
        const { data: existing } = await supabase
            .from('conversations')
            .select('id')
            .or(`and(participant_1.eq.${user.id},participant_2.eq.${recipientId}),and(participant_1.eq.${recipientId},participant_2.eq.${user.id})`)
            .maybeSingle();

        if (existing) {
            return existing.id;
        }

        return createConversation(recipientId, recipientName);
    };

    const getMessages = async (conversationId: string) => {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: true });

        if (error) throw error;

        return (data || []).map(msg => ({
            ...msg,
            created_at: new Date(msg.created_at),
        }));
    };

    const subscribeToMessages = (conversationId: string, callback: (messages: Message[]) => void) => {
        // Initial load
        getMessages(conversationId).then(callback);

        // Set up realtime subscription
        const messageChannel = supabase
            .channel(`messages-${conversationId}`)
            .on(
                'postgres_changes',
                {
                    event: '*', // Listen to INSERT and UPDATE
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${conversationId}`,
                },
                () => {
                    getMessages(conversationId).then(callback);
                }
            )
            .subscribe();

        return () => {
            messageChannel.unsubscribe();
        };
    };

    return (
        <ChatContext.Provider value={{
            conversations,
            loading,
            sendMessage,
            editMessage,
            deleteMessage,
            createConversation,
            getOrCreateConversation,
            getMessages,
            subscribeToMessages,
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    return useContext(ChatContext);
};
