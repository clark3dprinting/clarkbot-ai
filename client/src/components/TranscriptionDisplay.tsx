interface TranscriptionDisplayProps {
  text: string;
  isListening: boolean;
}

export default function TranscriptionDisplay({ text, isListening }: TranscriptionDisplayProps) {
  if (!text && !isListening) return null;

  return (
    <div 
      className="w-full max-w-2xl mx-auto px-4 py-3 rounded-xl animate-slide-up"
      style={{
        background: 'hsl(var(--card) / 0.5)',
        backdropFilter: 'blur(10px)',
        border: '1px solid hsl(var(--border))',
      }}
      data-testid="transcription-display"
    >
      <p className="text-sm text-muted-foreground mb-1 font-ui">
        {isListening ? 'Listening...' : 'You said:'}
      </p>
      <p className="text-foreground">
        {text || '...'}
        {isListening && <span className="animate-pulse ml-1">|</span>}
      </p>
    </div>
  );
}
