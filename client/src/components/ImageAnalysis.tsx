import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageAnalysisProps {
  onImageSelect: (file: File) => void;
  isAnalyzing: boolean;
}

export default function ImageAnalysis({ onImageSelect, isAnalyzing }: ImageAnalysisProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageSelect(file);
    }
  };

  const clearImage = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div 
      className="w-full p-4 rounded-xl animate-slide-up"
      style={{
        background: 'hsl(var(--card))',
        border: '1px solid hsl(var(--border))',
      }}
      data-testid="image-analysis"
    >
      {!preview ? (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            data-testid="input-image-file"
          />
          
          <div 
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover-elevate active-elevate-2 transition-all"
            style={{
              borderColor: 'hsl(var(--primary) / 0.3)',
              background: 'hsl(var(--background) / 0.3)',
            }}
            onClick={() => fileInputRef.current?.click()}
            data-testid="button-upload-zone"
          >
            <Upload className="w-8 h-8 mx-auto mb-3 text-primary" />
            <p className="text-foreground font-ui text-sm mb-1">Upload an image</p>
            <p className="text-xs text-muted-foreground">Click to select or drag and drop</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative rounded-lg overflow-hidden max-h-48">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-auto object-contain"
              data-testid="img-preview"
            />
            {isAnalyzing && (
              <div 
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  background: 'hsl(var(--background) / 0.8)',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <div className="text-center">
                  <div 
                    className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-2"
                    style={{ borderColor: 'hsl(var(--primary))' }}
                  />
                  <p className="text-foreground font-ui text-sm">Analyzing...</p>
                </div>
              </div>
            )}
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            className="w-full"
            onClick={clearImage}
            data-testid="button-clear-image"
          >
            <X className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>
      )}
    </div>
  );
}
