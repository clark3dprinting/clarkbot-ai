import { useState, useEffect } from 'react';
import { StickyNote } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface NotesWidgetProps {
  widgetId: string;
}

export default function NotesWidget({ widgetId }: NotesWidgetProps) {
  const [notes, setNotes] = useState(() => {
    const stored = localStorage.getItem(`widget_notes_${widgetId}`);
    return stored || '';
  });

  useEffect(() => {
    localStorage.setItem(`widget_notes_${widgetId}`, notes);
  }, [notes, widgetId]);

  return (
    <div className="p-4 space-y-3 h-full flex flex-col">
      <div className="flex items-center gap-2">
        <StickyNote className="w-4 h-4 text-primary" />
        <p className="text-xs text-muted-foreground">Quick Notes</p>
      </div>
      
      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Type your notes here..."
        className="flex-1 resize-none text-sm"
        data-testid={`textarea-notes-${widgetId}`}
      />
    </div>
  );
}
