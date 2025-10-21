import { useState } from 'react';
import Draggable from 'react-draggable';
import { X, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Widget } from '@shared/schema';

interface DraggableWidgetProps {
  widget: Widget;
  onRemove: (id: string) => void;
  onPositionChange: (id: string, x: number, y: number) => void;
  children: React.ReactNode;
  restrictedBounds?: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
}

export default function DraggableWidget({ widget, onRemove, onPositionChange, children, restrictedBounds }: DraggableWidgetProps) {
  const [isDragging, setIsDragging] = useState(false);

  const isInRestrictedZone = (x: number, y: number) => {
    if (!restrictedBounds) return false;
    const widgetRight = x + widget.size.width;
    const widgetBottom = y + widget.size.height;
    
    return !(
      widgetRight < restrictedBounds.left ||
      x > restrictedBounds.right ||
      widgetBottom < restrictedBounds.top ||
      y > restrictedBounds.bottom
    );
  };

  return (
    <Draggable
      handle=".drag-handle"
      position={{ x: widget.position.x, y: widget.position.y }}
      onStart={() => setIsDragging(true)}
      onDrag={(e, data) => {
        if (restrictedBounds && isInRestrictedZone(data.x, data.y)) {
          return false;
        }
      }}
      onStop={(e, data) => {
        setIsDragging(false);
        if (!restrictedBounds || !isInRestrictedZone(data.x, data.y)) {
          onPositionChange(widget.id, data.x, data.y);
        }
      }}
      bounds="parent"
    >
      <div
        className={`absolute rounded-xl ${isDragging ? 'shadow-2xl' : 'shadow-lg'} transition-shadow pointer-events-auto`}
        style={{
          width: widget.size.width,
          height: widget.size.height,
          background: 'hsl(var(--card))',
          border: '1px solid hsl(var(--border))',
          zIndex: isDragging ? 50 : 10,
        }}
        data-testid={`widget-${widget.id}`}
      >
        <div 
          className="drag-handle flex items-center justify-between p-2 border-b cursor-move hover-elevate"
          style={{
            borderColor: 'hsl(var(--border))',
          }}
        >
          <div className="flex items-center gap-2 text-muted-foreground">
            <GripVertical className="w-4 h-4" />
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={() => onRemove(widget.id)}
            data-testid={`button-remove-widget-${widget.id}`}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="overflow-auto" style={{ height: 'calc(100% - 40px)' }}>
          {children}
        </div>
      </div>
    </Draggable>
  );
}
