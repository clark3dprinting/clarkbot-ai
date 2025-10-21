import { Clock, Play, Pause, RotateCcw } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';

export default function StopwatchWidget() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);

    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
      milliseconds: ms.toString().padStart(2, '0'),
    };
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
  };

  const timeDisplay = formatTime(time);

  return (
    <div className="p-4 space-y-4 h-full flex flex-col items-center justify-center">
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-primary" />
        <p className="text-xs text-muted-foreground">Stopwatch</p>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="flex items-baseline gap-1 font-mono">
          <span className="text-4xl font-bold text-foreground">{timeDisplay.hours}</span>
          <span className="text-2xl text-muted-foreground">:</span>
          <span className="text-4xl font-bold text-foreground">{timeDisplay.minutes}</span>
          <span className="text-2xl text-muted-foreground">:</span>
          <span className="text-4xl font-bold text-foreground">{timeDisplay.seconds}</span>
          <span className="text-xl text-muted-foreground">.{timeDisplay.milliseconds}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleStartPause}
          variant={isRunning ? "default" : "outline"}
          data-testid="button-start-pause"
        >
          {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
          {isRunning ? 'Pause' : 'Start'}
        </Button>
        <Button
          onClick={handleReset}
          variant="outline"
          data-testid="button-reset"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>
    </div>
  );
}
