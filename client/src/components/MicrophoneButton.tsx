import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MicrophoneButtonProps {
  isListening: boolean;
  isProcessing: boolean;
  onClick: () => void;
}

export default function MicrophoneButton({ isListening, isProcessing, onClick }: MicrophoneButtonProps) {
  return (
    <Button
      size="icon"
      variant="default"
      onClick={onClick}
      disabled={isProcessing}
      className={`w-16 h-16 rounded-full text-primary-foreground ${
        isListening ? 'animate-pulse-glow' : ''
      }`}
      style={{
        background: isListening 
          ? 'hsl(var(--glow-secondary))' 
          : 'hsl(var(--primary))',
        boxShadow: isListening 
          ? '0 0 15px hsl(var(--glow-secondary) / 0.5), 0 0 30px hsl(var(--glow-secondary) / 0.3)' 
          : '0 0 8px hsl(var(--primary) / 0.4)',
      }}
      data-testid="button-microphone"
    >
      {isProcessing ? (
        <div className="w-5 h-5 border-4 border-t-transparent border-primary-foreground rounded-full animate-spin" />
      ) : isListening ? (
        <Mic className="w-8 h-8" />
      ) : (
        <MicOff className="w-8 h-8" />
      )}
    </Button>
  );
}
