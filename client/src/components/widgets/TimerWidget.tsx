import { Timer as TimerIcon, Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function TimerWidget() {
  const [totalTime, setTotalTime] = useState(300000); // 5 minutes default in milliseconds
  const [timeLeft, setTimeLeft] = useState(300000);
  const [isRunning, setIsRunning] = useState(false);
  const [isSettingTime, setIsSettingTime] = useState(false);
  const [minutes, setMinutes] = useState('5');
  const [seconds, setSeconds] = useState('0');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 10) {
            setIsRunning(false);
            return 0;
          }
          return prevTime - 10;
        });
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
  }, [isRunning, timeLeft]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
    };
  };

  const handleStartPause = () => {
    if (!isRunning && timeLeft === 0) {
      setTimeLeft(totalTime);
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(totalTime);
  };

  const handleSetTime = () => {
    const totalMs = (parseInt(minutes) || 0) * 60000 + (parseInt(seconds) || 0) * 1000;
    if (totalMs > 0) {
      setTotalTime(totalMs);
      setTimeLeft(totalMs);
      setIsSettingTime(false);
    }
  };

  const adjustTime = (deltaMinutes: number) => {
    const newMs = Math.max(0, totalTime + deltaMinutes * 60000);
    setTotalTime(newMs);
    setTimeLeft(newMs);
  };

  const timeDisplay = formatTime(timeLeft);
  const progress = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0;

  return (
    <div className="p-4 space-y-4 h-full flex flex-col items-center justify-center">
      <div className="flex items-center gap-2">
        <TimerIcon className="w-4 h-4 text-primary" />
        <p className="text-xs text-muted-foreground">Countdown Timer</p>
      </div>

      {isSettingTime ? (
        <div className="space-y-3 w-full">
          <div className="flex gap-2 items-center justify-center">
            <div className="flex flex-col items-center gap-1">
              <label className="text-xs text-muted-foreground">Minutes</label>
              <Input
                type="number"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                className="w-16 text-center"
                min="0"
                max="99"
                data-testid="input-minutes"
              />
            </div>
            <span className="text-2xl font-bold text-muted-foreground mt-5">:</span>
            <div className="flex flex-col items-center gap-1">
              <label className="text-xs text-muted-foreground">Seconds</label>
              <Input
                type="number"
                value={seconds}
                onChange={(e) => setSeconds(e.target.value)}
                className="w-16 text-center"
                min="0"
                max="59"
                data-testid="input-seconds"
              />
            </div>
          </div>
          <Button
            onClick={handleSetTime}
            variant="default"
            className="w-full"
            data-testid="button-set-time"
          >
            Set Time
          </Button>
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center gap-2 w-full">
            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-4xl font-bold text-foreground">{timeDisplay.hours}</span>
              <span className="text-2xl text-muted-foreground">:</span>
              <span className="text-4xl font-bold text-foreground">{timeDisplay.minutes}</span>
              <span className="text-2xl text-muted-foreground">:</span>
              <span className="text-4xl font-bold text-foreground">{timeDisplay.seconds}</span>
            </div>
            
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'hsl(var(--muted))' }}>
              <div
                className="h-full transition-all duration-100"
                style={{ 
                  width: `${progress}%`,
                  background: timeLeft === 0 ? 'hsl(var(--destructive))' : 'hsl(var(--primary))',
                }}
              />
            </div>
          </div>

          {!isRunning && (
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => adjustTime(-1)}
                data-testid="button-minus-1"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsSettingTime(true)}
                data-testid="button-set-custom"
              >
                Set Time
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={() => adjustTime(1)}
                data-testid="button-plus-1"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handleStartPause}
              variant={isRunning ? "default" : "outline"}
              data-testid="button-timer-start-pause"
            >
              {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isRunning ? 'Pause' : timeLeft === 0 ? 'Restart' : 'Start'}
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              data-testid="button-timer-reset"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
