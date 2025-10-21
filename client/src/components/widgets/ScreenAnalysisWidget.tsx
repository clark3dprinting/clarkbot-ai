import { Monitor, ZoomIn } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function ScreenAnalysisWidget() {
  const [lastCapture, setLastCapture] = useState<string | null>(null);

  return (
    <div className="p-4 space-y-3 h-full flex flex-col">
      <div className="flex items-center gap-2">
        <Monitor className="w-4 h-4 text-primary" />
        <p className="text-xs text-muted-foreground">Screen Analysis</p>
      </div>
      
      {lastCapture ? (
        <div className="flex-1 overflow-hidden rounded-lg border relative" style={{ borderColor: 'hsl(var(--border))' }}>
          <img 
            src={lastCapture} 
            alt="Screen capture" 
            className="w-full h-full object-contain"
            data-testid="screen-analysis-preview"
          />
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2"
            onClick={() => window.open(lastCapture, '_blank')}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div 
          className="flex-1 flex items-center justify-center border rounded-lg"
          style={{ 
            borderColor: 'hsl(var(--border))',
            background: 'hsl(var(--muted) / 0.3)',
          }}
        >
          <p className="text-sm text-muted-foreground text-center px-4">
            No screen captures yet.<br />
            Use the Analyze Screen button to capture.
          </p>
        </div>
      )}
    </div>
  );
}
