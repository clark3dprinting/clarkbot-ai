import { z } from 'zod';

export const chatMessageSchema = z.object({
  id: z.string(),
  role: z.enum(['user', 'assistant']),
  content: z.string(),
  timestamp: z.number(),
});

export const savedChatSchema = z.object({
  id: z.string(),
  title: z.string(),
  messages: z.array(chatMessageSchema),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export const widgetSchema = z.object({
  id: z.string(),
  type: z.enum(['weather', 'time', 'notes', 'calculator', 'screen-analysis', 'fast-link', 'todo', 'tab-switcher', 'timer', 'stopwatch']),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  size: z.object({
    width: z.number(),
    height: z.number(),
  }),
  config: z.record(z.any()).optional(),
});

export const widgetLayoutSchema = z.object({
  id: z.string(),
  name: z.string(),
  widgets: z.array(widgetSchema),
  createdAt: z.number(),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type SavedChat = z.infer<typeof savedChatSchema>;
export type Widget = z.infer<typeof widgetSchema>;
export type WidgetLayout = z.infer<typeof widgetLayoutSchema>;
