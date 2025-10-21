import ImageAnalysis from '../ImageAnalysis';

export default function ImageAnalysisExample() {
  return (
    <ImageAnalysis
      onImageSelect={(file) => console.log('Image selected:', file.name)}
      isAnalyzing={false}
    />
  );
}
