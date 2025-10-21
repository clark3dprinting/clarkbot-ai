import { useState } from 'react';
import SettingsPanel from '../SettingsPanel';

export default function SettingsPanelExample() {
  const [settings, setSettings] = useState({
    voiceEnabled: true,
    voiceSpeed: 1.0,
    voicePitch: 1.0,
    autoSpeak: true,
  });

  return (
    <SettingsPanel
      isOpen={true}
      onClose={() => console.log('Close settings')}
      settings={settings}
      onSettingsChange={setSettings}
    />
  );
}
