import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div 
      className={`flex gap-3 animate-slide-up ${isUser ? 'justify-end' : 'justify-start'}`}
      data-testid={`message-${role}`}
    >
      {!isUser && (
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: 'hsl(var(--glow-primary) / 0.15)',
            border: '1px solid hsl(var(--glow-primary) / 0.4)',
          }}
        >
          <Bot className="w-4 h-4 text-primary" />
        </div>
      )}
      
      <div 
        className={`max-w-2xl px-4 py-3 rounded-2xl ${
          isUser 
            ? 'text-primary-foreground' 
            : 'text-foreground'
        }`}
        style={{
          background: isUser 
            ? 'hsl(var(--primary))' 
            : 'hsl(var(--card))',
          boxShadow: isUser 
            ? '0 0 8px hsl(var(--primary) / 0.2)' 
            : 'none',
          border: isUser 
            ? '1px solid hsl(var(--primary))' 
            : '1px solid hsl(var(--border))',
        }}
      >
        <p className="text-sm md:text-base leading-relaxed">{content}</p>
      </div>

      {isUser && (
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: 'hsl(var(--primary) / 0.15)',
            border: '1px solid hsl(var(--primary) / 0.4)',
          }}
        >
          <User className="w-4 h-4 text-primary" />
        </div>
      )}
    </div>
  );
}
