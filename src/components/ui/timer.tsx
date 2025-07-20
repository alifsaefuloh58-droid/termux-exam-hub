import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimerProps {
  duration: number; // in seconds
  onTimeUp: () => void;
  className?: string;
}

export const Timer = ({ duration, onTimeUp, className }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const isWarning = timeLeft <= 300; // 5 minutes
  const isCritical = timeLeft <= 60; // 1 minute

  return (
    <div className={cn(
      "flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg font-semibold transition-colors",
      {
        "bg-card text-card-foreground": !isWarning,
        "bg-warning text-warning-foreground": isWarning && !isCritical,
        "bg-destructive text-destructive-foreground": isCritical,
      },
      className
    )}>
      <Clock className="h-5 w-5" />
      <span>{formatTime(timeLeft)}</span>
    </div>
  );
};