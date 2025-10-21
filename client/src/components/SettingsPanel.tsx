import { useState, useEffect } from 'react';
import { X, Volume2, Palette, Sliders, Moon, Sun, Monitor, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

export interface AppSettings {
  voiceEnabled: boolean;
  voiceSpeed: number;
  voicePitch: number;
  autoSpeak: boolean;
  theme?: string;
  animationsEnabled?: boolean;
  compactMode?: boolean;
  selectedMicrophone?: string;
}

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
}

export default function SettingsPanel({ isOpen, onClose, settings, onSettingsChange }: SettingsPanelProps) {
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
  const [microphoneError, setMicrophoneError] = useState<string | null>(null);

  useEffect(() => {
    const getMicrophones = async () => {
      let stream: MediaStream | null = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devices.filter(device => device.kind === 'audioinput');
        setMicrophones(audioInputs);
        setMicrophoneError(null);
      } catch (error) {
        console.error('Error getting microphones:', error);
        setMicrophones([]);
        setMicrophoneError('Unable to access microphones. Please grant microphone permissions.');
      } finally {
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      }
    };

    if (isOpen) {
      getMicrophones();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const updateSetting = (key: string, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
        data-testid="settings-overlay"
      />
      
      <div 
        className="fixed right-0 top-0 h-full w-full max-w-md z-50 overflow-y-auto animate-slide-in-right"
        style={{
          background: 'hsl(var(--card))',
          borderLeft: '1px solid hsl(var(--border))',
          boxShadow: '-4px 0 20px hsl(0 0% 0% / 0.3)',
        }}
        data-testid="settings-panel"
      >
        <div className="sticky top-0 z-10 p-6 border-b" style={{
          background: 'hsl(var(--card))',
          borderColor: 'hsl(var(--border))',
        }}>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-bold text-foreground">Settings</h2>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={onClose}
              data-testid="button-close-settings"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          <Tabs defaultValue="voice" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="voice" data-testid="tab-voice">
                <Volume2 className="w-4 h-4 mr-2" />
                Voice
              </TabsTrigger>
              <TabsTrigger value="appearance" data-testid="tab-appearance">
                <Palette className="w-4 h-4 mr-2" />
                Appearance
              </TabsTrigger>
              <TabsTrigger value="advanced" data-testid="tab-advanced">
                <Sliders className="w-4 h-4 mr-2" />
                Advanced
              </TabsTrigger>
            </TabsList>

            <TabsContent value="voice" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="voice-enabled" className="text-foreground font-medium">Voice Responses</Label>
                    <p className="text-xs text-muted-foreground mt-1">Enable text-to-speech for responses</p>
                  </div>
                  <Switch
                    id="voice-enabled"
                    checked={settings.voiceEnabled}
                    onCheckedChange={(checked) => updateSetting('voiceEnabled', checked)}
                    data-testid="switch-voice-enabled"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-speak" className="text-foreground font-medium">Auto-speak Responses</Label>
                    <p className="text-xs text-muted-foreground mt-1">Automatically read out responses</p>
                  </div>
                  <Switch
                    id="auto-speak"
                    checked={settings.autoSpeak}
                    onCheckedChange={(checked) => updateSetting('autoSpeak', checked)}
                    data-testid="switch-auto-speak"
                  />
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="text-foreground font-medium">Microphone</Label>
                  <Select 
                    value={settings.selectedMicrophone || 'default'}
                    onValueChange={(value) => updateSetting('selectedMicrophone', value)}
                    disabled={!!microphoneError}
                  >
                    <SelectTrigger data-testid="select-microphone">
                      <SelectValue placeholder="Select microphone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">
                        <div className="flex items-center gap-2">
                          <Mic className="w-4 h-4" />
                          Default Microphone
                        </div>
                      </SelectItem>
                      {microphones.map((mic) => (
                        <SelectItem key={mic.deviceId} value={mic.deviceId}>
                          <div className="flex items-center gap-2">
                            <Mic className="w-4 h-4" />
                            {mic.label || `Microphone ${mic.deviceId.substring(0, 8)}`}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {microphoneError ? (
                    <p className="text-xs text-destructive">
                      {microphoneError}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Choose which microphone to use for voice input
                    </p>
                  )}
                </div>

                <Separator />

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="voice-speed" className="text-foreground font-medium">
                      Voice Speed
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Current: {settings.voiceSpeed.toFixed(1)}x
                    </p>
                  </div>
                  <Slider
                    id="voice-speed"
                    min={0.5}
                    max={2}
                    step={0.1}
                    value={[settings.voiceSpeed]}
                    onValueChange={([value]) => updateSetting('voiceSpeed', value)}
                    data-testid="slider-voice-speed"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0.5x Slow</span>
                    <span>2.0x Fast</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="voice-pitch" className="text-foreground font-medium">
                      Voice Pitch
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Current: {settings.voicePitch.toFixed(1)}
                    </p>
                  </div>
                  <Slider
                    id="voice-pitch"
                    min={0.5}
                    max={2}
                    step={0.1}
                    value={[settings.voicePitch]}
                    onValueChange={([value]) => updateSetting('voicePitch', value)}
                    data-testid="slider-voice-pitch"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0.5x Low</span>
                    <span>2.0x High</span>
                  </div>
                </div>
              </div>

              <div 
                className="p-4 rounded-xl mt-6"
                style={{
                  background: 'hsl(var(--muted) / 0.3)',
                  border: '1px solid hsl(var(--border))',
                }}
              >
                <p className="text-sm text-muted-foreground">
                  Voice settings use your browser's speech synthesis. Click on ClarkBot's avatar to start voice input.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label className="text-foreground font-medium">Theme</Label>
                  <Select 
                    value={settings.theme || 'dark'}
                    onValueChange={(value) => updateSetting('theme', value)}
                  >
                    <SelectTrigger data-testid="select-theme">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                          <Moon className="w-4 h-4" />
                          Dark Mode
                        </div>
                      </SelectItem>
                      <SelectItem value="light">
                        <div className="flex items-center gap-2">
                          <Sun className="w-4 h-4" />
                          Light Mode
                        </div>
                      </SelectItem>
                      <SelectItem value="auto">
                        <div className="flex items-center gap-2">
                          <Monitor className="w-4 h-4" />
                          System
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="animations" className="text-foreground font-medium">Animations</Label>
                    <p className="text-xs text-muted-foreground mt-1">Enable smooth animations and transitions</p>
                  </div>
                  <Switch
                    id="animations"
                    checked={settings.animationsEnabled !== false}
                    onCheckedChange={(checked) => updateSetting('animationsEnabled', checked)}
                    data-testid="switch-animations"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="compact" className="text-foreground font-medium">Compact Mode</Label>
                    <p className="text-xs text-muted-foreground mt-1">Reduce spacing for more content</p>
                  </div>
                  <Switch
                    id="compact"
                    checked={settings.compactMode || false}
                    onCheckedChange={(checked) => updateSetting('compactMode', checked)}
                    data-testid="switch-compact"
                  />
                </div>
              </div>

              <div 
                className="p-4 rounded-xl mt-6"
                style={{
                  background: 'hsl(var(--muted) / 0.3)',
                  border: '1px solid hsl(var(--border))',
                }}
              >
                <p className="text-sm text-muted-foreground">
                  Customize ClarkBot's appearance to match your preferences. Changes take effect immediately.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-ui font-semibold text-foreground mb-4">Data & Storage</h3>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        localStorage.clear();
                        window.location.reload();
                      }}
                      data-testid="button-clear-data"
                    >
                      Clear All Data
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Remove all saved chats, widgets, and settings
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-ui font-semibold text-foreground mb-4">About</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p><strong className="text-foreground">Version:</strong> 2.0.0</p>
                    <p><strong className="text-foreground">Features:</strong> Voice Input, Screen Capture, Chat Saving, Widgets</p>
                    <p className="pt-2">ClarkBot is your advanced AI assistant with customizable widgets and intelligent conversations.</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
