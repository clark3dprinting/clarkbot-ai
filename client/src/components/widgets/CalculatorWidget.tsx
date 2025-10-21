import { useState } from 'react';
import { Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CalculatorWidget() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);

  const handleNumber = (num: string) => {
    if (display === '0') {
      setDisplay(num);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperation = (op: string) => {
    setPreviousValue(parseFloat(display));
    setOperation(op);
    setDisplay('0');
  };

  const handleEquals = () => {
    if (previousValue !== null && operation) {
      const current = parseFloat(display);
      let result = 0;
      
      switch (operation) {
        case '+':
          result = previousValue + current;
          break;
        case '-':
          result = previousValue - current;
          break;
        case '*':
          result = previousValue * current;
          break;
        case '/':
          result = previousValue / current;
          break;
      }
      
      setDisplay(result.toString());
      setPreviousValue(null);
      setOperation(null);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
  };

  const buttons = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', '=', '+'
  ];

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <Calculator className="w-4 h-4 text-primary" />
        <p className="text-xs text-muted-foreground">Calculator</p>
      </div>
      
      <div 
        className="p-3 rounded-lg text-right text-xl font-mono tabular-nums"
        style={{
          background: 'hsl(var(--background))',
          border: '1px solid hsl(var(--border))',
        }}
      >
        {display}
      </div>

      <div className="grid grid-cols-4 gap-1">
        {buttons.map((btn) => (
          <Button
            key={btn}
            size="sm"
            variant={['+', '-', '*', '/', '='].includes(btn) ? 'default' : 'outline'}
            onClick={() => {
              if (btn === '=') handleEquals();
              else if (['+', '-', '*', '/'].includes(btn)) handleOperation(btn);
              else handleNumber(btn);
            }}
            className="h-10"
            data-testid={`calc-button-${btn}`}
          >
            {btn}
          </Button>
        ))}
      </div>

      <Button 
        variant="outline" 
        size="sm" 
        className="w-full"
        onClick={handleClear}
        data-testid="calc-button-clear"
      >
        Clear
      </Button>
    </div>
  );
}
