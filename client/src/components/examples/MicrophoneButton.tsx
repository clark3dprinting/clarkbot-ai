import { useState } from 'react';
import MicrophoneButton from '../MicrophoneButton';

export default function MicrophoneButtonExample() {
  const [isListening, setIsListening] = useState(false);

  return (
    <MicrophoneButton
      isListening={isListening}
      isProcessing={false}
      onClick={() => setIsListening(!isListening)}
    />
  );
}
