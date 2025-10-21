import { useState } from 'react';
import { Monitor, Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ScreenCaptureProps {
  onCapture: (imageData: string) => void;
}

export default function ScreenCapture({ onCapture }: ScreenCaptureProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const { toast } = useToast();

  const captureScreen = async () => {
    try {
      setIsCapturing(true);
      
      const stream = await (navigator.mediaDevices as any).getDisplayMedia({
        video: true
      });

      const video = document.createElement('video');
      video.srcObject = stream;
      
      await new Promise<void>((resolve) => {
        video.onloadedmetadata = () => {
          video.play();
          resolve();
        };
      });

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);

      stream.getTracks().forEach(track => track.stop());

      const imageData = canvas.toDataURL('image/png');
      onCapture(imageData);

      toast({
        title: 'Screen captured',
        description: 'Analyzing your screen...',
      });
    } catch (error) {
      console.error('Screen capture error:', error);
      toast({
        title: 'Capture failed',
        description: 'Unable to capture screen. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={captureScreen}
      disabled={isCapturing}
      className="gap-2"
      data-testid="button-screen-capture"
    >
      <Monitor className="w-4 h-4" />
      {isCapturing ? 'Capturing...' : 'Analyze Screen'}
    </Button>
  );
}
