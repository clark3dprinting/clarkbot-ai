import { Search, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function WebSearchWidget() {
  const [query, setQuery] = useState('');
  const [searchUrl, setSearchUrl] = useState('');

  const handleSearch = () => {
    if (!query.trim()) return;
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    setSearchUrl(url);
    window.open(url, '_blank');
  };

  return (
    <div className="p-4 space-y-3 h-full flex flex-col">
      <div className="flex items-center gap-2">
        <Search className="w-4 h-4 text-primary" />
        <p className="text-xs text-muted-foreground">Web Search</p>
      </div>
      
      <div className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search the web..."
          className="flex-1"
          data-testid="input-web-search"
        />
        <Button
          size="sm"
          onClick={handleSearch}
          disabled={!query.trim()}
          data-testid="button-web-search"
        >
          <ExternalLink className="w-4 h-4" />
        </Button>
      </div>

      {searchUrl && (
        <div className="flex-1 overflow-hidden rounded-lg border" style={{ borderColor: 'hsl(var(--border))' }}>
          <iframe
            src={searchUrl}
            className="w-full h-full"
            title="Web search"
            sandbox="allow-same-origin allow-scripts"
            data-testid="iframe-web-search"
          />
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Searches will open in a new tab
      </p>
    </div>
  );
}
