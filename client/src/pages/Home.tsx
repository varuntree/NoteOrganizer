import React, { useState } from 'react';
import FloatingNav from '@/components/FloatingNav';
import SmartInput from '@/components/SmartInput';
import SmartOutput from '@/components/SmartOutput';
import { ProcessedNote } from '@/lib/api';

const Home: React.FC = () => {
  const [mode, setMode] = useState<'organize' | 'visualize'>('organize');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessedNote | null>(null);

  const handleModeChange = (newMode: 'organize' | 'visualize') => {
    setMode(newMode);
  };

  const handleProcessing = (processing: boolean) => {
    setIsProcessing(processing);
  };

  const handleResult = (newResult: ProcessedNote) => {
    setResult(newResult);
    // If result suggests a different mode, update the mode
    if (newResult.mode !== mode) {
      setMode(newResult.mode);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-neutral-50">
      <FloatingNav />
      
      <main className="h-full pt-20 px-8">
        <div className="h-full flex gap-8">
          <SmartInput 
            onProcessing={handleProcessing} 
            onResult={handleResult} 
            mode={mode} 
          />
          <SmartOutput 
            result={result} 
            isProcessing={isProcessing} 
            mode={mode} 
            onModeChange={handleModeChange} 
          />
        </div>
      </main>
    </div>
  );
};

export default Home;
