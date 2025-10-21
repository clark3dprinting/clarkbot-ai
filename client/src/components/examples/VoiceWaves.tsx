import VoiceWaves from '../VoiceWaves';

export default function VoiceWavesExample() {
  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      <VoiceWaves isActive={true} />
      <div className="w-32 h-32 rounded-full bg-primary/20" />
    </div>
  );
}
