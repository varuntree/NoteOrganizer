import React, { useState, useEffect, useRef } from 'react';
import { useNotesContext } from '@/context/NotesContext';
import { processNotes } from '@/lib/api';
import EmotionalEyes from './EmotionalEyes';

// The delay before automatically processing notes (in ms)
const DEBOUNCE_DELAY = 2000;

interface SmartInputProps {
  onProcessing: (isProcessing: boolean) => void;
  onResult: (result: any) => void;
  mode: 'organize' | 'visualize';
  smartMode?: boolean;
}

const SmartInput: React.FC<SmartInputProps> = ({ onProcessing, onResult, mode, smartMode = false }) => {
  const [localText, setLocalText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastProcessedText, setLastProcessedText] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const { setInputText } = useNotesContext();
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
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

  // Main function to process notes
  const processUserNotes = async () => {
    if (isProcessing || localText.trim().length < 10) return;
    
    try {
      setIsProcessing(true);
      onProcessing(true);
      
      const result = await processNotes(localText, smartMode ? null : mode);
      onResult(result);
      setLastProcessedText(localText);
      
    } catch (error) {
      console.error('Failed to process notes:', error);
    } finally {
      setIsProcessing(false);
      onProcessing(false);
    }
  };
  
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalText(e.target.value);
    setCursorPosition(e.target.selectionStart);
  };

  const handleSelectionChange = () => {
    if (textareaRef.current) {
      setCursorPosition(textareaRef.current.selectionStart);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (textareaRef.current) {
      setCursorPosition(textareaRef.current.selectionStart);
    }
  };

  const handleBlurExtended = () => {
    handleBlur();
    setIsFocused(false);
  };

  return (
    <div className="flex-1 flex flex-col min-h-[50vh] lg:min-h-0">
      {/* Emotional Eyes */}
      <div className="flex justify-center py-4 bg-white rounded-t-lg shadow-sm">
        <EmotionalEyes 
          inputValue={localText}
          cursorPosition={cursorPosition}
          isActive={isFocused}
        />
      </div>
      
      <div className="flex-1 bg-white rounded-b-lg shadow-sm overflow-hidden flex flex-col relative">
        <textarea 
        ref={textareaRef}
        id="input-area"
        className="w-full h-full p-4 md:p-8 text-neutral-800 focus:outline-none resize-none bg-transparent" 
        placeholder="Just start typing your unorganized notes here..."
        value={localText}
        onChange={handleTextareaChange}
        onFocus={handleFocus}
        onBlur={handleBlurExtended}
        onSelect={handleSelectionChange}
        onKeyUp={handleSelectionChange}
        onClick={handleSelectionChange}
        disabled={isProcessing}
        style={{ fontSize: '16px', lineHeight: '1.6' }}
      ></textarea>
      
      {isProcessing && (
        <div className="absolute bottom-4 left-4">
          <div className="flex items-center text-sm text-neutral-400">
            <div className="animate-spin mr-2">
              <i className="ri-loader-4-line"></i>
            </div>
            <span>Processing...</span>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default SmartInput;