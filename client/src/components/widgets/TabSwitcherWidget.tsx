import { LayoutGrid, Plus, X, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface QuickTab {
  id: string;
  title: string;
  url: string;
}

interface TabSwitcherWidgetProps {
  widgetId: string;
}

export default function TabSwitcherWidget({ widgetId }: TabSwitcherWidgetProps) {
  const [tabs, setTabs] = useState<QuickTab[]>(() => {
    const stored = localStorage.getItem(`widget_quick_tabs_${widgetId}`);
    return stored ? JSON.parse(stored) : [
      { id: '1', title: 'ClarkBot', url: window.location.origin }
    ];
  });
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    localStorage.setItem(`widget_quick_tabs_${widgetId}`, JSON.stringify(tabs));
  }, [tabs, widgetId]);

  const addTab = () => {
    if (!newTitle.trim() || !newUrl.trim()) return;
    
    let url = newUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    setTabs([...tabs, { id: Date.now().toString(), title: newTitle, url }]);
    setNewTitle('');
    setNewUrl('');
    setIsAdding(false);
  };

  const removeTab = (id: string) => {
    setTabs(tabs.filter(tab => tab.id !== id));
  };

  const openTab = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="p-4 space-y-3 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-primary" />
          <p className="text-xs text-muted-foreground">Saved Links</p>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6"
          onClick={() => setIsAdding(!isAdding)}
          data-testid="button-toggle-add-tab"
        >
          <Plus className="w-3 h-3" />
        </Button>
      </div>

      {isAdding && (
        <div className="space-y-2 p-3 rounded-lg" style={{ background: 'hsl(var(--muted) / 0.3)' }}>
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Tab title..."
            className="text-sm"
            data-testid="input-tab-title"
          />
          <div className="flex gap-2">
            <Input
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTab()}
              placeholder="URL..."
              className="flex-1 text-sm"
              data-testid="input-tab-url"
            />
            <Button
              size="sm"
              onClick={addTab}
              disabled={!newTitle.trim() || !newUrl.trim()}
              data-testid="button-confirm-add-tab"
            >
              Add
            </Button>
          </div>
        </div>
      )}

      <ScrollArea className="flex-1">
        <div className="space-y-2">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className="flex items-center gap-2 p-3 rounded-lg hover-elevate active-elevate-2 border"
              style={{
                background: 'hsl(var(--muted) / 0.3)',
                borderColor: 'hsl(var(--border))',
              }}
              data-testid={`tab-item-${tab.id}`}
            >
              <button
                onClick={() => openTab(tab.url)}
                className="flex-1 text-left min-w-0"
                data-testid={`button-open-tab-${tab.id}`}
              >
                <p className="text-sm font-medium text-foreground truncate">{tab.title}</p>
                <p className="text-xs text-muted-foreground truncate">{tab.url}</p>
              </button>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 flex-shrink-0"
                onClick={() => openTab(tab.url)}
              >
                <ExternalLink className="w-3 h-3" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 flex-shrink-0"
                onClick={() => removeTab(tab.id)}
                data-testid={`button-remove-tab-${tab.id}`}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="pt-2 border-t text-center" style={{ borderColor: 'hsl(var(--border))' }}>
        <p className="text-xs text-muted-foreground">
          Save your favorite websites for quick access
        </p>
      </div>
    </div>
  );
}
