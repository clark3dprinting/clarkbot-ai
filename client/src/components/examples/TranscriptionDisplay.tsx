import TranscriptionDisplay from '../TranscriptionDisplay';

export default function TranscriptionDisplayExample() {
  return (
    <TranscriptionDisplay
      text="Hello ClarkBot, how are you today?"
      isListening={false}
    />
  );
}
