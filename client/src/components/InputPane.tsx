import React, { useEffect, useRef } from 'react';
import { useNotesContext } from '@/context/NotesContext';

const InputPane: React.FC = () => {
  const { inputText, setInputText, clearNotes } = useNotesContext();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(prev => prev + ' ' + transcript);
      };
      
      recognition.start();
    } else {
      alert('Speech recognition is not supported in your browser.');
    }
  };
  
  useEffect(() => {
    // Auto-focus the textarea when component mounts
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  return (
    <div className="flex-1 bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden flex flex-col mobile-full-height">
      <div className="px-4 py-3 bg-neutral-50 border-b border-neutral-200 flex justify-between items-center">
        <h3 className="font-medium text-neutral-700">Your Notes</h3>
        <div className="flex space-x-2">
          <button 
            className="text-neutral-500 hover:text-neutral-700 p-1 rounded" 
            title="Paste from clipboard"
            onClick={handlePasteFromClipboard}
          >
            <i className="ri-clipboard-line text-lg"></i>
          </button>
          <button 
            className="text-neutral-500 hover:text-neutral-700 p-1 rounded" 
            title="Voice input"
            onClick={handleVoiceInput}
          >
            <i className="ri-mic-line text-lg"></i>
          </button>
          <button 
            className="text-neutral-500 hover:text-neutral-700 p-1 rounded" 
            title="Clear input"
            onClick={clearNotes}
          >
            <i className="ri-delete-bin-line text-lg"></i>
          </button>
        </div>
      </div>
      <textarea 
        id="input-area" 
        ref={textareaRef}
        className="flex-1 p-4 w-full text-neutral-800 focus:outline-none resize-none" 
        placeholder="Just start typing your unorganized notes here..."
        defaultValue=""
        onChange={(e) => setInputText(e.target.value)}
      ></textarea>
    </div>
  );
};

export default InputPane;
