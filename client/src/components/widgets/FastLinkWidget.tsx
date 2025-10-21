import { Link2, ExternalLink, Plus, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface LinkItem {
  id: string;
  name: string;
  url: string;
}

interface FastLinkWidgetProps {
  widgetId: string;
}

export default function FastLinkWidget({ widgetId }: FastLinkWidgetProps) {
  const [links, setLinks] = useState<LinkItem[]>(() => {
    const stored = localStorage.getItem(`widget_links_${widgetId}`);
    return stored ? JSON.parse(stored) : [];
  });
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');

  useEffect(() => {
    localStorage.setItem(`widget_links_${widgetId}`, JSON.stringify(links));
  }, [links, widgetId]);

  const addLink = () => {
    if (!newName.trim() || !newUrl.trim()) return;
    
    let url = newUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    setLinks([...links, { id: Date.now().toString(), name: newName, url }]);
    setNewName('');
    setNewUrl('');
  };

  const removeLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
  };

  const openLink = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="p-4 space-y-3 h-full flex flex-col">
      <div className="flex items-center gap-2">
        <Link2 className="w-4 h-4 text-primary" />
        <p className="text-xs text-muted-foreground">Fast Links</p>
      </div>
      
      <div className="space-y-2">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Link name..."
          className="text-sm"
          data-testid="input-link-name"
        />
        <div className="flex gap-2">
          <Input
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addLink()}
            placeholder="URL..."
            className="flex-1 text-sm"
            data-testid="input-link-url"
          />
          <Button
            size="icon"
            onClick={addLink}
            disabled={!newName.trim() || !newUrl.trim()}
            data-testid="button-add-link"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {links.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No links yet</p>
        ) : (
          links.map((link) => (
            <div
              key={link.id}
              className="flex items-center gap-2 p-2 rounded-lg hover-elevate active-elevate-2"
              style={{ background: 'hsl(var(--muted) / 0.3)' }}
              data-testid={`link-item-${link.id}`}
            >
              <button
                onClick={() => openLink(link.url)}
                className="flex-1 text-left"
                data-testid={`button-open-link-${link.id}`}
              >
                <p className="text-sm font-medium text-foreground">{link.name}</p>
                <p className="text-xs text-muted-foreground truncate">{link.url}</p>
              </button>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={() => openLink(link.url)}
              >
                <ExternalLink className="w-3 h-3" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={() => removeLink(link.id)}
                data-testid={`button-remove-link-${link.id}`}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
