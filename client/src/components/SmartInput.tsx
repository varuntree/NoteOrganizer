import React, { useState, useEffect, useRef } from 'react';
import { useNotesContext } from '@/context/NotesContext';
import { processNotes } from '@/lib/api';

// The delay before automatically processing notes (in ms)
const DEBOUNCE_DELAY = 2000;

interface SmartInputProps {
  onProcessing: (isProcessing: boolean) => void;
  onResult: (result: any) => void;
  mode: 'organize' | 'visualize';
}

const SmartInput: React.FC<SmartInputProps> = ({ onProcessing, onResult, mode }) => {
  const [localText, setLocalText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastProcessedText, setLastProcessedText] = useState('');
  const { setInputText } = useNotesContext();
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Update the context when local text changes
  useEffect(() => {
    setInputText(localText);
  }, [localText, setInputText]);
  
  // Process notes with debouncing
  useEffect(() => {
    // Don't process if text is too short or already processing
    if (localText.trim().length < 10 || localText === lastProcessedText) {
      return;
    }
    
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Set up new timer for debouncing
    debounceTimerRef.current = setTimeout(() => {
      processUserNotes();
    }, DEBOUNCE_DELAY);
    
    // Cleanup
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [localText, mode]);
  
  // Process notes on blur
  const handleBlur = () => {
    if (localText.trim().length >= 10 && localText !== lastProcessedText && !isProcessing) {
      processUserNotes();
    }
  };
  
  // Process notes immediately
  const handleProcessNow = () => {
    if (localText.trim().length >= 10 && !isProcessing) {
      // Clear debounce timer if it exists
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      processUserNotes();
    }
  };
  
  // Main function to process notes
  const processUserNotes = async () => {
    if (isProcessing || localText.trim().length < 10) return;
    
    try {
      setIsProcessing(true);
      onProcessing(true);
      
      const result = await processNotes(localText, mode);
      onResult(result);
      setLastProcessedText(localText);
      
    } catch (error) {
      console.error('Failed to process notes:', error);
    } finally {
      setIsProcessing(false);
      onProcessing(false);
    }
  };
  
  return (
    <div className="flex-1 bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden flex flex-col mobile-full-height">
      <div className="px-4 py-3 bg-neutral-50 border-b border-neutral-200 flex justify-between items-center">
        <h3 className="font-medium text-neutral-700">Your Notes</h3>
        <div className="flex space-x-2">
          <button 
            className="bg-primary text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleProcessNow}
            disabled={isProcessing || localText.trim().length < 10}
          >
            {isProcessing ? 'Processing...' : 'Organize Now'}
          </button>
          <button 
            className="text-neutral-500 hover:text-neutral-700 p-1 rounded" 
            title="Clear input"
            onClick={() => {
              setLocalText('');
              setLastProcessedText('');
            }}
          >
            <i className="ri-delete-bin-line text-lg"></i>
          </button>
        </div>
      </div>
      <textarea 
        id="input-area"
        className="flex-1 p-4 w-full text-neutral-800 focus:outline-none resize-none" 
        placeholder="Just start typing your unorganized notes here..."
        value={localText}
        onChange={(e) => setLocalText(e.target.value)}
        onBlur={handleBlur}
        disabled={isProcessing}
      ></textarea>
      
      {isProcessing && (
        <div className="bg-primary-50 py-2 px-4 text-sm text-primary border-t border-primary-100">
          <div className="flex items-center">
            <div className="animate-spin mr-2">
              <i className="ri-loader-4-line"></i>
            </div>
            <span>Organizing your notes...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartInput;