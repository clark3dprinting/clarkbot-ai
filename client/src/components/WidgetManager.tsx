import { useState } from 'react';
import { Plus, Layout, Save, FolderOpen, Trash2, Cloud, Clock, StickyNote, Calculator, Monitor, Link2, CheckSquare, LayoutGrid, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import DraggableWidget from './DraggableWidget';
import WeatherWidget from './widgets/WeatherWidget';
import TimeWidget from './widgets/TimeWidget';
import NotesWidget from './widgets/NotesWidget';
import CalculatorWidget from './widgets/CalculatorWidget';
import ScreenAnalysisWidget from './widgets/ScreenAnalysisWidget';
import FastLinkWidget from './widgets/FastLinkWidget';
import TodoWidget from './widgets/TodoWidget';
import TabSwitcherWidget from './widgets/TabSwitcherWidget';
import TimerWidget from './widgets/TimerWidget';
import StopwatchWidget from './widgets/StopwatchWidget';
import type { Widget, WidgetLayout } from '@shared/schema';

interface WidgetManagerProps {
  isOpen: boolean;
  onToggle: () => void;
  restrictedBounds?: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
}

export default function WidgetManager({ isOpen, onToggle, restrictedBounds }: WidgetManagerProps) {
  const [widgets, setWidgets] = useState<Widget[]>(() => {
    const stored = localStorage.getItem('clarkbot_widgets');
    return stored ? JSON.parse(stored) : [];
  });
  const [layouts, setLayouts] = useState<WidgetLayout[]>(() => {
    const stored = localStorage.getItem('clarkbot_widget_layouts');
    return stored ? JSON.parse(stored) : [];
  });
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [saveLayoutDialogOpen, setSaveLayoutDialogOpen] = useState(false);
  const [loadLayoutDialogOpen, setLoadLayoutDialogOpen] = useState(false);
  const [layoutName, setLayoutName] = useState('');
  const { toast } = useToast();

  const saveWidgets = (newWidgets: Widget[]) => {
    setWidgets(newWidgets);
    localStorage.setItem('clarkbot_widgets', JSON.stringify(newWidgets));
  };

  const saveLayout = () => {
    if (!layoutName.trim()) {
      toast({
        title: 'Name required',
        description: 'Please enter a name for your layout.',
        variant: 'destructive',
      });
      return;
    }

    const newLayout: WidgetLayout = {
      id: Date.now().toString(),
      name: layoutName,
      widgets: widgets,
      createdAt: Date.now(),
    };

    const updatedLayouts = [...layouts, newLayout];
    setLayouts(updatedLayouts);
    localStorage.setItem('clarkbot_widget_layouts', JSON.stringify(updatedLayouts));

    toast({
      title: 'Layout saved',
      description: `"${layoutName}" has been saved.`,
    });

    setLayoutName('');
    setSaveLayoutDialogOpen(false);
  };

  const loadLayout = (layout: WidgetLayout) => {
    saveWidgets(layout.widgets);
    setLoadLayoutDialogOpen(false);
    toast({
      title: 'Layout loaded',
      description: `"${layout.name}" has been loaded.`,
    });
  };

  const deleteLayout = (id: string) => {
    const updatedLayouts = layouts.filter(l => l.id !== id);
    setLayouts(updatedLayouts);
    localStorage.setItem('clarkbot_widget_layouts', JSON.stringify(updatedLayouts));
    toast({
      title: 'Layout deleted',
      description: 'The layout has been removed.',
    });
  };

  const getWidgetSize = (type: Widget['type']) => {
    switch (type) {
      case 'calculator':
        return { width: 250, height: 400 };
      case 'notes':
      case 'todo':
      case 'fast-link':
        return { width: 300, height: 300 };
      case 'screen-analysis':
        return { width: 400, height: 350 };
      case 'tab-switcher':
        return { width: 300, height: 350 };
      case 'timer':
      case 'stopwatch':
        return { width: 280, height: 250 };
      default:
        return { width: 300, height: 200 };
    }
  };

  const addWidget = (type: Widget['type']) => {
    const newWidget: Widget = {
      id: Date.now().toString(),
      type,
      position: { x: 50 + (widgets.length * 20), y: 50 + (widgets.length * 20) },
      size: getWidgetSize(type),
    };

    saveWidgets([...widgets, newWidget]);
    setAddDialogOpen(false);
  };

  const removeWidget = (id: string) => {
    saveWidgets(widgets.filter(w => w.id !== id));
  };

  const updateWidgetPosition = (id: string, x: number, y: number) => {
    saveWidgets(widgets.map(w => 
      w.id === id ? { ...w, position: { x, y } } : w
    ));
  };

  const renderWidget = (widget: Widget) => {
    switch (widget.type) {
      case 'weather':
        return <WeatherWidget />;
      case 'time':
        return <TimeWidget />;
      case 'notes':
        return <NotesWidget widgetId={widget.id} />;
      case 'calculator':
        return <CalculatorWidget />;
      case 'screen-analysis':
        return <ScreenAnalysisWidget />;
      case 'fast-link':
        return <FastLinkWidget widgetId={widget.id} />;
      case 'todo':
        return <TodoWidget widgetId={widget.id} />;
      case 'tab-switcher':
        return <TabSwitcherWidget widgetId={widget.id} />;
      case 'timer':
        return <TimerWidget />;
      case 'stopwatch':
        return <StopwatchWidget />;
      default:
        return null;
    }
  };

  const widgetTypes = [
    { type: 'weather' as const, icon: Cloud, label: 'Weather' },
    { type: 'time' as const, icon: Clock, label: 'Time' },
    { type: 'notes' as const, icon: StickyNote, label: 'Notes' },
    { type: 'todo' as const, icon: CheckSquare, label: 'Todo' },
    { type: 'calculator' as const, icon: Calculator, label: 'Calculator' },
    { type: 'fast-link' as const, icon: Link2, label: 'Fast Link' },
    { type: 'tab-switcher' as const, icon: LayoutGrid, label: 'Saved Links' },
    { type: 'stopwatch' as const, icon: Clock, label: 'Stopwatch' },
    { type: 'timer' as const, icon: Timer, label: 'Timer' },
    { type: 'screen-analysis' as const, icon: Monitor, label: 'Screen Analysis' },
  ];

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed top-20 right-6 z-30 flex gap-2 pointer-events-auto">
        <Dialog open={saveLayoutDialogOpen} onOpenChange={setSaveLayoutDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={widgets.length === 0}
              data-testid="button-save-layout"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Layout
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Widget Layout</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Enter layout name..."
                value={layoutName}
                onChange={(e) => setLayoutName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveLayout()}
                data-testid="input-layout-name"
              />
              <Button onClick={saveLayout} className="w-full" data-testid="button-confirm-save-layout">
                Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={loadLayoutDialogOpen} onOpenChange={setLoadLayoutDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              data-testid="button-load-layout"
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              Load Layout
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Load Widget Layout</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-96">
              <div className="space-y-2">
                {layouts.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No saved layouts yet
                  </p>
                ) : (
                  layouts.map((layout) => (
                    <div
                      key={layout.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover-elevate active-elevate-2"
                      style={{
                        background: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                      }}
                    >
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => loadLayout(layout)}
                        data-testid={`layout-item-${layout.id}`}
                      >
                        <p className="font-ui font-medium text-foreground">{layout.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {layout.widgets.length} widgets • {new Date(layout.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteLayout(layout.id);
                        }}
                        data-testid={`button-delete-layout-${layout.id}`}
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

        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="default"
              size="sm"
              data-testid="button-add-widget"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Widget
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Add Widget</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-3 gap-3">
              {widgetTypes.map(({ type, icon: Icon, label }) => (
                <Button
                  key={type}
                  variant="outline"
                  className="h-24 flex flex-col gap-2"
                  onClick={() => addWidget(type)}
                  data-testid={`button-add-${type}`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-xs">{label}</span>
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        <Button
          variant="outline"
          size="sm"
          onClick={onToggle}
          data-testid="button-close-widgets"
        >
          Close Widgets
        </Button>
      </div>

      <div className="relative w-full h-full">
        {widgets.map((widget) => (
          <DraggableWidget
            key={widget.id}
            widget={widget}
            onRemove={removeWidget}
            onPositionChange={updateWidgetPosition}
            restrictedBounds={restrictedBounds}
          >
            {renderWidget(widget)}
          </DraggableWidget>
        ))}
      </div>
    </>
  );
}
