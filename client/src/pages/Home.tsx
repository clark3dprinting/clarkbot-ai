import { useState, useRef, useEffect } from 'react';
import { Settings, ArrowLeft, Image as ImageIcon, Layout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Avatar from '@/components/Avatar';
import VoiceWaves from '@/components/VoiceWaves';
import MicrophoneButton from '@/components/MicrophoneButton';
import ChatHistory from '@/components/ChatHistory';
import SettingsPanel, { type AppSettings } from '@/components/SettingsPanel';
import ImageAnalysis from '@/components/ImageAnalysis';
import TranscriptionDisplay from '@/components/TranscriptionDisplay';
import ScreenCapture from '@/components/ScreenCapture';
import ChatSaver from '@/components/ChatSaver';
import WidgetManager from '@/components/WidgetManager';
import type { ChatMessage } from '@shared/schema';

export default function Home() {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [textInput, setTextInput] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showImageAnalysis, setShowImageAnalysis] = useState(false);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [showWidgets, setShowWidgets] = useState(false);
  const [capturedScreen, setCapturedScreen] = useState<string | null>(null);
  const [settings, setSettings] = useState<AppSettings>(() => {
    const stored = localStorage.getItem('clarkbot_settings');
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      voiceEnabled: true,
      voiceSpeed: 1.0,
      voicePitch: 1.0,
      autoSpeak: true,
      theme: 'dark',
      animationsEnabled: true,
      compactMode: false,
    };
  });

  useEffect(() => {
    localStorage.setItem('clarkbot_settings', JSON.stringify(settings));
    
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (settings.theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }

    if (!settings.animationsEnabled) {
      document.documentElement.style.setProperty('--animation-duration', '0s');
    } else {
      document.documentElement.style.removeProperty('--animation-duration');
    }
  }, [settings]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const widgetContainerRef = useRef<HTMLDivElement>(null);
  const [restrictedBounds, setRestrictedBounds] = useState({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  });

  useEffect(() => {
    const updateBounds = () => {
      if (contentRef.current && widgetContainerRef.current) {
        const contentRect = contentRef.current.getBoundingClientRect();
        const containerRect = widgetContainerRef.current.getBoundingClientRect();
        
        setRestrictedBounds({
          left: contentRect.left - containerRect.left,
          right: contentRect.right - containerRect.left,
          top: contentRect.top - containerRect.top,
          bottom: contentRect.bottom - containerRect.top,
        });
      }
    };

    updateBounds();
    window.addEventListener('resize', updateBounds);
    return () => window.removeEventListener('resize', updateBounds);
  }, [messages.length]);

  const handleAvatarClick = () => {
    if (isListening) {
      setIsListening(false);
      if (transcription) {
        handleSendMessage(transcription);
        setTranscription('');
      }
    } else {
      setIsListening(true);
      setTimeout(() => {
        setTranscription('Hello ClarkBot, can you help me today?');
      }, 1000);
    }
  };

  const handleChatMicClick = () => {
    if (isListening) {
      setIsListening(false);
      if (transcription) {
        handleSendMessage(transcription);
        setTranscription('');
      }
    } else {
      setIsListening(true);
      setTimeout(() => {
        setTranscription('Listening...');
      }, 500);
    }
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: text,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setTextInput('');

    setIsProcessing(true);
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: "I'm ClarkBot, your advanced AI assistant. I'm here to help you with speech recognition, image analysis, and intelligent conversations. How can I assist you?",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsProcessing(false);
    }, 1500);
  };

  const handleImageSelect = (file: File) => {
    console.log('Image selected:', file.name);
    setIsAnalyzingImage(true);
    setTimeout(() => {
      setIsAnalyzingImage(false);
      const analysisMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant' as const,
        content: `I've analyzed your image. It appears to be ${file.name}. This is a demonstration of image analysis capabilities.`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, analysisMessage]);
      setShowImageAnalysis(false);
    }, 2000);
  };

  const handleScreenCapture = (imageData: string) => {
    console.log('Screen captured');
    setCapturedScreen(imageData);
    setIsProcessing(true);
    setTimeout(() => {
      const analysisMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant' as const,
        content: "I've analyzed your screen capture. This is a demonstration of screen analysis capabilities. In a full implementation, I would analyze the content and provide insights.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, analysisMessage]);
      setIsProcessing(false);
    }, 2000);
  };

  const handleLoadChat = (loadedMessages: ChatMessage[]) => {
    setMessages(loadedMessages);
  };

  const handleBackToHome = () => {
    setMessages([]);
    setTextInput('');
    setTranscription('');
    setShowImageAnalysis(false);
    setCapturedScreen(null);
  };

  return (
    <div className={`relative h-screen overflow-hidden flex flex-col ${settings.compactMode ? 'compact-mode' : ''}`}>
      <div 
        className="absolute inset-0 -z-10"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(var(--background)) 0%, hsl(220 35% 4%) 100%)',
        }}
      >
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <header className="relative h-16 flex items-center justify-between px-6 border-b border-border/30 flex-shrink-0 z-40">
        <div className="flex items-center gap-4">
          {messages.length > 0 && (
            <Button 
              size="icon" 
              variant="ghost"
              onClick={handleBackToHome}
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <h1 className="text-3xl font-display font-bold text-foreground tracking-wider">
            <span className="text-primary">Clark</span>Bot
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            size="icon" 
            variant="ghost"
            onClick={() => setShowWidgets(!showWidgets)}
            data-testid="button-widgets"
          >
            <Layout className="w-5 h-5" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost"
            onClick={() => setSettingsOpen(true)}
            data-testid="button-settings"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main ref={contentRef} className="relative flex-1 overflow-y-auto flex flex-col items-center px-4 py-8">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-8 w-full max-w-3xl h-full">
            <div className="relative">
              <VoiceWaves isActive={isListening} />
              <Avatar 
                isActive={isListening} 
                isProcessing={isProcessing} 
                size="lg"
                onClick={handleAvatarClick}
              />
            </div>

            <div className="flex flex-col items-center gap-10 w-full">
              <TranscriptionDisplay text={transcription} isListening={isListening} />

              <div className="w-full flex gap-2">
                <Input
                  type="text"
                  placeholder="Or type your message here..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(textInput);
                    }
                  }}
                  className="flex-1 rounded-2xl px-4 py-3 text-base"
                  style={{
                    background: 'hsl(var(--card) / 0.5)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid hsl(var(--border))',
                  }}
                  data-testid="input-text-message"
                />
                <Button 
                  onClick={() => handleSendMessage(textInput)}
                  disabled={!textInput.trim()}
                  className="rounded-2xl px-6"
                  data-testid="button-send"
                >
                  Send
                </Button>
              </div>

              <div className="flex gap-3 flex-wrap justify-center">
                <Button 
                  variant="outline"
                  onClick={() => setShowImageAnalysis(!showImageAnalysis)}
                  className="gap-2"
                  data-testid="button-toggle-image"
                >
                  <ImageIcon className="w-4 h-4" />
                  {showImageAnalysis ? 'Hide' : 'Analyze'} Image
                </Button>
                
                <ScreenCapture onCapture={handleScreenCapture} />
              </div>
            </div>

            {showImageAnalysis && (
              <div className="w-full max-w-md">
                <ImageAnalysis 
                  onImageSelect={handleImageSelect}
                  isAnalyzing={isAnalyzingImage}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-6 w-full max-w-4xl h-full">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <ChatSaver messages={messages} onLoadChat={handleLoadChat} />
                {capturedScreen && (
                  <div 
                    className="relative rounded-lg overflow-hidden border"
                    style={{
                      width: '120px',
                      height: '68px',
                      borderColor: 'hsl(var(--primary))',
                    }}
                    data-testid="screen-preview"
                  >
                    <img 
                      src={capturedScreen} 
                      alt="Captured screen"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 right-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-5 w-5 bg-background/80 hover:bg-background"
                        onClick={() => setCapturedScreen(null)}
                        data-testid="button-close-preview"
                      >
                        <span className="text-xs">×</span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <ScreenCapture onCapture={handleScreenCapture} />
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <ChatHistory messages={messages} />
            </div>

            <div className="flex-shrink-0 flex flex-col gap-3 pb-4">
              <TranscriptionDisplay text={transcription} isListening={isListening} />
              
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Type your message..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(textInput);
                    }
                  }}
                  className="flex-1 rounded-2xl px-4 py-3 text-base"
                  style={{
                    background: 'hsl(var(--card) / 0.5)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid hsl(var(--border))',
                  }}
                  data-testid="input-chat-message"
                />
                <MicrophoneButton 
                  isListening={isListening}
                  isProcessing={isProcessing}
                  onClick={handleChatMicClick}
                />
                <Button 
                  onClick={() => handleSendMessage(textInput)}
                  disabled={!textInput.trim()}
                  className="rounded-2xl px-6"
                  data-testid="button-send-chat"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onSettingsChange={setSettings}
      />

      <div ref={widgetContainerRef} className="fixed inset-0 z-20" style={{ pointerEvents: 'none' }}>
        {showWidgets && (
          <WidgetManager 
            isOpen={showWidgets} 
            onToggle={() => setShowWidgets(!showWidgets)}
            restrictedBounds={restrictedBounds}
          />
        )}
      </div>
    </div>
  );
}
