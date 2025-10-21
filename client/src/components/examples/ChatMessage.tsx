import ChatMessage from '../ChatMessage';

export default function ChatMessageExample() {
  return (
    <div className="space-y-4 w-full max-w-4xl">
      <ChatMessage role="user" content="Hello ClarkBot, can you help me today?" />
      <ChatMessage role="assistant" content="Hello! I'm ClarkBot, your advanced AI assistant. I'm here to help you with anything you need. How can I assist you today?" />
    </div>
  );
}
