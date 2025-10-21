import ChatHistory from '../ChatHistory';

export default function ChatHistoryExample() {
  const messages = [
    { id: '1', role: 'user' as const, content: 'What can you do?' },
    { id: '2', role: 'assistant' as const, content: 'I can help you with voice commands, image analysis, and intelligent conversations. Just ask me anything!' },
    { id: '3', role: 'user' as const, content: 'That sounds amazing!' },
  ];

  return <ChatHistory messages={messages} />;
}
