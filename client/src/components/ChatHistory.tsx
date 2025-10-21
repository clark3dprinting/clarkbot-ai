import { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatHistoryProps {
  messages: Message[];
}

export default function ChatHistory({ messages }: ChatHistoryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);

  if (messages.length === 0) return null;

  return (
    <div 
      ref={scrollRef}
      className="w-full max-w-4xl mx-auto px-4 py-6 rounded-2xl animate-slide-up"
      style={{
        background: 'hsl(var(--background) / 0.5)',
        backdropFilter: 'blur(10px)',
        border: '1px solid hsl(var(--border))',
      }}
      data-testid="chat-history"
    >
      <ScrollArea className="h-96">
        <div className="space-y-4 pr-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} role={message.role} content={message.content} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
