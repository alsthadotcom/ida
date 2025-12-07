import { MessageCircle } from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

export default function FloatingMessageButton() {
    const { conversations } = useChat();
    const navigate = useNavigate();
    const location = useLocation();

    // Don't show on messages page
    if (location.pathname === '/messages') return null;

    // Calculate unread count (for now, just show conversation count as badge)
    const messageCount = conversations.length;

    return (
        <button
            onClick={() => navigate('/messages')}
            className="fixed bottom-6 left-6 z-50 flex items-center justify-center w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-110 transition-transform duration-200 group"
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
    );
}
