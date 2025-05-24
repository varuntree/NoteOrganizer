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
}

const SmartOutput: React.FC<SmartOutputProps> = ({ 
  result, 
  isProcessing, 
  mode, 
  onModeChange 
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
    <div className="flex-1 bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden flex flex-col mobile-full-height">
      <div className="px-4 py-3 bg-neutral-50 border-b border-neutral-200 flex justify-between items-center">
        <div className="flex items-center">
          <h3 className="font-medium text-neutral-700">Organized Result</h3>
          <div className="ml-4 flex items-center">
            <span className="text-sm text-neutral-500 mr-2">Mode:</span>
            <div className="flex items-center bg-neutral-100 rounded-full p-1">
              <button 
                className={`text-xs px-3 py-1 rounded-full transition-colors ${mode === 'organize' ? 'bg-primary text-white font-medium' : 'text-neutral-600 hover:bg-neutral-200'}`}
                onClick={() => onModeChange('organize')}
                disabled={isProcessing}
              >
                Organize
              </button>
              <button 
                className={`text-xs px-3 py-1 rounded-full transition-colors ${mode === 'visualize' ? 'bg-primary text-white font-medium' : 'text-neutral-600 hover:bg-neutral-200'}`}
                onClick={() => onModeChange('visualize')}
                disabled={isProcessing}
              >
                Visualize
              </button>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <button 
            className="text-neutral-500 hover:text-neutral-700 p-1 rounded" 
            title="Copy to clipboard"
            onClick={copyToClipboard}
            disabled={!result || isProcessing}
          >
            <i className="ri-file-copy-line text-lg"></i>
          </button>
          <button 
            className="text-neutral-500 hover:text-neutral-700 p-1 rounded" 
            title="Download as file"
            onClick={downloadContent}
            disabled={!result || isProcessing}
          >
            <i className="ri-download-line text-lg"></i>
          </button>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-auto">
        {isProcessing ? (
          <div className="flex h-full w-full items-center justify-center">
            <div className="text-center">
              <div className="animate-spin text-primary text-3xl mb-3">
                <i className="ri-loader-4-line"></i>
              </div>
              <p className="text-neutral-600">Processing your notes...</p>
            </div>
          </div>
        ) : result ? (
          result.format === 'markdown' ? (
            <div className="markdown-output" dangerouslySetInnerHTML={{ __html: result.content }}></div>
          ) : (
            <div ref={mermaidRef} className="mermaid">{result.content}</div>
          )
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-400">
            <div className="text-center max-w-md">
              <i className="ri-file-text-line text-5xl mb-3"></i>
              <p>Enter your notes on the left side to see them organized here.</p>
              <p className="text-sm mt-2">Try typing meeting notes, process steps, or project ideas.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartOutput;