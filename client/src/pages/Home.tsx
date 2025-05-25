import React, { useState, useEffect } from 'react';
import FloatingNav from '@/components/FloatingNav';
import SmartInput from '@/components/SmartInput';
import SmartOutput from '@/components/SmartOutput';
import { ProcessedNote } from '@/lib/api';

const Home: React.FC = () => {
  const [mode, setMode] = useState<'organize' | 'visualize'>('organize');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessedNote | null>(null);
  const [smartMode, setSmartMode] = useState(() => {
    const saved = localStorage.getItem('smartMode');
    return saved !== null ? saved === 'true' : true;
  });
  
  // Save smart mode preference
  useEffect(() => {
    localStorage.setItem('smartMode', smartMode.toString());
  }, [smartMode]);

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
    <div className="min-h-screen lg:h-screen overflow-hidden lg:overflow-hidden bg-neutral-50">
      <FloatingNav smartMode={smartMode} onSmartModeChange={setSmartMode} />
      
      <main className="min-h-screen lg:h-full pt-16 md:pt-20 px-4 md:px-8 pb-4 lg:pb-0">
        <div className="h-full flex flex-col lg:flex-row gap-4 lg:gap-8">
          <SmartInput 
            onProcessing={handleProcessing} 
            onResult={handleResult} 
            mode={smartMode ? (result?.mode || 'organize') : mode}
            smartMode={smartMode}
          />
          <SmartOutput 
            result={result} 
            isProcessing={isProcessing} 
            mode={mode} 
            onModeChange={handleModeChange}
            smartMode={smartMode}
          />
        </div>
      </main>
    </div>
  );
};

export default Home;
