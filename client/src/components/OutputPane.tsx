import React, { useState, useEffect } from 'react';
import { useNotesContext } from '@/context/NotesContext';
import { useToastNotification } from '@/components/ui/toast-notification';
import { processText, generateDiagram } from '@/lib/text-processor';
import mermaid from 'mermaid';

// Initialize mermaid
mermaid.initialize({
  startOnLoad: true,
  theme: 'neutral',
  fontSize: 16
});

type Mode = 'organize' | 'visualize';

const OutputPane: React.FC = () => {
  const { inputText } = useNotesContext();
  const [mode, setMode] = useState<Mode>('organize');
  const [processedContent, setProcessedContent] = useState<string>('');
  const [diagram, setDiagram] = useState<string>('');
  const { showToast } = useToastNotification();

  useEffect(() => {
    if (inputText) {
      // Process the input text based on the current mode
      if (mode === 'organize') {
        const content = processText(inputText);
        setProcessedContent(content);
      } else {
        // Generate diagram in Mermaid syntax
        const mermaidContent = generateDiagram(inputText);
        setDiagram(mermaidContent);
        
        // Render the mermaid diagram
        setTimeout(() => {
          mermaid.contentLoaded();
        }, 100);
      }
    } else {
      setProcessedContent('');
      setDiagram('');
    }
  }, [inputText, mode]);

  const copyToClipboard = () => {
    const contentToCopy = mode === 'organize' ? processedContent : diagram;
    navigator.clipboard.writeText(contentToCopy)
      .then(() => showToast('Copied to clipboard!', 'success'))
      .catch(err => console.error('Failed to copy: ', err));
  };

  const downloadContent = () => {
    const contentToDownload = mode === 'organize' ? processedContent : diagram;
    const fileExtension = mode === 'organize' ? 'md' : 'mmd';
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
                onClick={() => setMode('organize')}
              >
                Organize
              </button>
              <button 
                className={`text-xs px-3 py-1 rounded-full transition-colors ${mode === 'visualize' ? 'bg-primary text-white font-medium' : 'text-neutral-600 hover:bg-neutral-200'}`}
                onClick={() => setMode('visualize')}
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
          >
            <i className="ri-file-copy-line text-lg"></i>
          </button>
          <button 
            className="text-neutral-500 hover:text-neutral-700 p-1 rounded" 
            title="Download as markdown"
            onClick={downloadContent}
          >
            <i className="ri-download-line text-lg"></i>
          </button>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-auto">
        {mode === 'organize' ? (
          <div className="markdown-output" dangerouslySetInnerHTML={{ __html: processedContent }}></div>
        ) : (
          <div className="mermaid">{diagram}</div>
        )}
      </div>
    </div>
  );
};

export default OutputPane;
