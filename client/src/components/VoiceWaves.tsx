interface VoiceWavesProps {
  isActive: boolean;
}

export default function VoiceWaves({ isActive }: VoiceWavesProps) {
  if (!isActive) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" data-testid="voice-waves">
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className="absolute w-40 h-40 lg:w-48 lg:h-48 rounded-full border animate-wave-expand"
          style={{
            borderColor: 'hsl(var(--glow-secondary) / 0.4)',
            animationDelay: `${index * 0.4}s`,
            filter: 'blur(1px)',
          }}
        />
      ))}
    </div>
  );
}
