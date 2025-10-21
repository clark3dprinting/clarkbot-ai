interface AvatarProps {
  isActive?: boolean;
  isProcessing?: boolean;
  size?: 'md' | 'lg';
  onClick?: () => void;
}

export default function Avatar({ isActive = false, isProcessing = false, size = 'lg', onClick }: AvatarProps) {
  const sizeClasses = {
    md: 'w-32 h-32',
    lg: 'w-48 h-48 lg:w-64 lg:h-64',
  };

  const textSizeClasses = {
    md: 'text-sm',
    lg: 'text-base lg:text-lg',
  };

  return (
    <div className="relative flex items-center justify-center" data-testid="avatar-container">
      <div 
        className={`${sizeClasses[size]} rounded-full relative overflow-visible flex items-center justify-center transition-all ${
          onClick ? 'cursor-pointer hover-elevate active-elevate-2' : ''
        }`}
        style={{
          background: 'radial-gradient(circle, hsl(var(--glow-primary) / 0.4) 0%, hsl(var(--glow-secondary) / 0.2) 50%, transparent 100%)',
          boxShadow: `
            0 0 15px hsl(var(--glow-primary) / ${isActive ? '0.6' : '0.3'}),
            0 0 30px hsl(var(--glow-primary) / ${isActive ? '0.4' : '0.2'}),
            0 0 45px hsl(var(--glow-primary) / ${isActive ? '0.2' : '0.1'})
          `,
        }}
        onClick={onClick}
        data-testid="avatar-clickable"
      >
        <div 
          className={`absolute inset-4 rounded-full border ${isProcessing ? 'animate-pulse-glow' : isActive ? 'animate-pulse' : 'animate-pulse'}`}
          style={{
            borderColor: `hsl(var(--glow-primary) / ${isActive ? '0.6' : '0.4'})`,
            background: 'radial-gradient(circle, hsl(var(--glow-secondary) / 0.15) 0%, transparent 70%)',
          }}
        />
        
        <div 
          className="absolute inset-8 rounded-full"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--glow-primary) / 0.2) 0%, hsl(var(--glow-secondary) / 0.1) 100%)',
            boxShadow: 'inset 0 0 15px hsl(var(--glow-primary) / 0.2)',
          }}
        />
        
        <div 
          className={`relative z-10 text-primary ${textSizeClasses[size]} font-display font-bold tracking-wider`}
          data-testid="avatar-text"
        >
          ClarkBot
        </div>

        {onClick && !isActive && !isProcessing && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mt-4">
            <p className="text-sm text-muted-foreground">Click to talk</p>
          </div>
        )}

        {isProcessing && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full mb-4">
            <div className="w-5 h-5 border-4 border-t-transparent border-primary rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
