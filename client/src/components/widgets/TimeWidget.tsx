import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function TimeWidget() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <Clock className="w-4 h-4 text-primary" />
        <p className="text-xs text-muted-foreground">Current Time</p>
      </div>
      
      <div className="text-center">
        <p 
          className="text-4xl font-display font-bold text-foreground tabular-nums"
          data-testid="time-display"
        >
          {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </p>
        <p 
          className="text-sm text-muted-foreground mt-2"
          data-testid="date-display"
        >
          {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>
    </div>
  );
}
