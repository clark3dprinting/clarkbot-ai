import { CheckSquare, Plus, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoWidgetProps {
  widgetId: string;
}

export default function TodoWidget({ widgetId }: TodoWidgetProps) {
  const [todos, setTodos] = useState<TodoItem[]>(() => {
    const stored = localStorage.getItem(`widget_todos_${widgetId}`);
    return stored ? JSON.parse(stored) : [];
  });
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    localStorage.setItem(`widget_todos_${widgetId}`, JSON.stringify(todos));
  }, [todos, widgetId]);

  const addTodo = () => {
    if (!newTodo.trim()) return;
    setTodos([...todos, { id: Date.now().toString(), text: newTodo, completed: false }]);
    setNewTodo('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const removeTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="p-4 space-y-3 h-full flex flex-col">
      <div className="flex items-center gap-2">
        <CheckSquare className="w-4 h-4 text-primary" />
        <p className="text-xs text-muted-foreground">Todo List</p>
      </div>
      
      <div className="flex gap-2">
        <Input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a task..."
          className="flex-1 text-sm"
          data-testid="input-new-todo"
        />
        <Button
          size="icon"
          onClick={addTodo}
          disabled={!newTodo.trim()}
          data-testid="button-add-todo"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {todos.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No tasks yet</p>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center gap-2 p-2 rounded-lg hover-elevate"
              style={{ background: 'hsl(var(--muted) / 0.3)' }}
              data-testid={`todo-item-${todo.id}`}
            >
              <Checkbox
                checked={todo.completed}
                onCheckedChange={() => toggleTodo(todo.id)}
                data-testid={`checkbox-todo-${todo.id}`}
              />
              <span 
                className={`flex-1 text-sm ${todo.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}
              >
                {todo.text}
              </span>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={() => removeTodo(todo.id)}
                data-testid={`button-remove-todo-${todo.id}`}
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
