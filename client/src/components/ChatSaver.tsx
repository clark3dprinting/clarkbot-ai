import { useState } from 'react';
import { Save, FolderOpen, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import type { ChatMessage, SavedChat } from '@shared/schema';

interface ChatSaverProps {
  messages: ChatMessage[];
  onLoadChat: (messages: ChatMessage[]) => void;
}

export default function ChatSaver({ messages, onLoadChat }: ChatSaverProps) {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [chatTitle, setChatTitle] = useState('');
  const [savedChats, setSavedChats] = useState<SavedChat[]>(() => {
    const stored = localStorage.getItem('clarkbot_saved_chats');
    return stored ? JSON.parse(stored) : [];
  });
  const { toast } = useToast();

  const saveChat = () => {
    if (!chatTitle.trim()) {
      toast({
        title: 'Title required',
        description: 'Please enter a title for your chat.',
        variant: 'destructive',
      });
      return;
    }

    const newChat: SavedChat = {
      id: Date.now().toString(),
      title: chatTitle,
      messages,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const updated = [...savedChats, newChat];
    setSavedChats(updated);
    localStorage.setItem('clarkbot_saved_chats', JSON.stringify(updated));

    toast({
      title: 'Chat saved',
      description: `"${chatTitle}" has been saved.`,
    });

    setChatTitle('');
    setSaveDialogOpen(false);
  };

  const loadChat = (chat: SavedChat) => {
    onLoadChat(chat.messages);
    setLoadDialogOpen(false);
    toast({
      title: 'Chat loaded',
      description: `"${chat.title}" has been loaded.`,
    });
  };

  const deleteChat = (id: string) => {
    const updated = savedChats.filter(c => c.id !== id);
    setSavedChats(updated);
    localStorage.setItem('clarkbot_saved_chats', JSON.stringify(updated));
    toast({
      title: 'Chat deleted',
      description: 'The chat has been removed.',
    });
  };

  return (
    <div className="flex gap-2">
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={messages.length === 0}
            data-testid="button-save-chat"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Chat
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Chat</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Enter chat title..."
              value={chatTitle}
              onChange={(e) => setChatTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && saveChat()}
              data-testid="input-chat-title"
            />
            <Button onClick={saveChat} className="w-full" data-testid="button-confirm-save">
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            data-testid="button-load-chat"
          >
            <FolderOpen className="w-4 h-4 mr-2" />
            Load Chat
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Load Saved Chat</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-96">
            <div className="space-y-2">
              {savedChats.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No saved chats yet
                </p>
              ) : (
                savedChats.map((chat) => (
                  <div
                    key={chat.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover-elevate active-elevate-2"
                    style={{
                      background: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                    }}
                  >
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => loadChat(chat)}
                      data-testid={`chat-item-${chat.id}`}
                    >
                      <p className="font-ui font-medium text-foreground">{chat.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {chat.messages.length} messages • {new Date(chat.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChat(chat.id);
                      }}
                      data-testid={`button-delete-${chat.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
