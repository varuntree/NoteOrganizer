import React, { useEffect, useRef } from 'react';
import { useToastNotification } from '@/components/ui/toast-notification';
import { ProcessedNote } from '@/lib/api';
import mermaid from 'mermaid';

// Initialize mermaid
mermaid.initialize({
  startOnLoad: true,
  theme: 'neutral',
  fontSize: 16
});

interface SmartOutputProps {
  result: ProcessedNote | null;
  isProcessing: boolean;
  mode: 'organize' | 'visualize';
  onModeChange: (mode: 'organize' | 'visualize') => void;
  smartMode?: boolean;
}

const SmartOutput: React.FC<SmartOutputProps> = ({ 
  result, 
  isProcessing, 
  mode, 
  onModeChange,
  smartMode = false
}) => {
  const { showToast } = useToastNotification();
  const mermaidRef = useRef<HTMLDivElement>(null);
  
  // Render mermaid diagrams when needed
  useEffect(() => {
    if (result && result.format === 'mermaid' && mermaidRef.current) {
      setTimeout(() => {
        mermaid.contentLoaded();
      }, 100);
    }
  }, [result]);
  
  const copyToClipboard = () => {
    if (!result) return;
    
    const contentToCopy = result.content;
    navigator.clipboard.writeText(contentToCopy)
      .then(() => showToast('Copied to clipboard!', 'success'))
      .catch(err => console.error('Failed to copy: ', err));
  };

  const downloadContent = () => {
    if (!result) return;
    
    const contentToDownload = result.content;
    const fileExtension = result.format === 'markdown' ? 'md' : 'mmd';
    const filename = `notes.${fileExtension}`;
    
    const element = document.createElement('a');
    const file = new Blob([contentToDownload], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col relative min-h-[50vh] lg:min-h-0">
      {/* Minimal controls */}
      {result && !isProcessing && (
        <div className="absolute top-2 md:top-4 right-2 md:right-4 z-10 flex items-center gap-1 md:gap-2">
          <button 
            className="text-neutral-400 hover:text-neutral-600 p-1.5 md:p-2 hover:bg-neutral-100 rounded-full transition-all" 
            title="Copy"
            onClick={copyToClipboard}
          >
            <i className="ri-file-copy-line text-xs md:text-sm"></i>
          </button>
          <button 
            className="text-neutral-400 hover:text-neutral-600 p-1.5 md:p-2 hover:bg-neutral-100 rounded-full transition-all" 
            title="Download"
            onClick={downloadContent}
          >
            <i className="ri-download-line text-xs md:text-sm"></i>
          </button>
          {!smartMode && (
            <div className="ml-1 md:ml-2 flex items-center bg-neutral-100/80 backdrop-blur-sm rounded-full p-0.5 md:p-1">
              <button 
                className={`text-xs px-2 md:px-3 py-0.5 md:py-1 rounded-full transition-all ${mode === 'organize' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500'}`}
                onClick={() => onModeChange('organize')}
                disabled={isProcessing}
              >
                <span className="hidden sm:inline">Text</span>
                <span className="sm:hidden">T</span>
              </button>
              <button 
                className={`text-xs px-2 md:px-3 py-0.5 md:py-1 rounded-full transition-all ${mode === 'visualize' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500'}`}
                onClick={() => onModeChange('visualize')}
                disabled={isProcessing}
              >
                <span className="hidden sm:inline">Visual</span>
                <span className="sm:hidden">V</span>
              </button>
            </div>
          )}
        </div>
      )}
      
      <div className="flex-1 p-4 md:p-8 overflow-auto">
        {isProcessing ? (
          <div className="flex h-full w-full items-center justify-center">
            <div className="text-center">
              <div className="animate-spin text-neutral-300 text-2xl mb-2">
                <i className="ri-loader-4-line"></i>
              </div>
              <p className="text-neutral-400 text-sm">Processing...</p>
            </div>
          </div>
        ) : result ? (
          result.format === 'markdown' ? (
            <div className="markdown-output" dangerouslySetInnerHTML={{ __html: result.content }}></div>
          ) : (
            <div ref={mermaidRef} className="mermaid">{result.content}</div>
          )
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-300">
            <div className="text-center max-w-md">
              <i className="ri-file-text-line text-4xl mb-2"></i>
              <p className="text-sm">Your organized notes will appear here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartOutput;