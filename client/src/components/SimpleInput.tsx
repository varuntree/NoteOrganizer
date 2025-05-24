import React, { useState, useEffect } from 'react';
import { useNotesContext } from '@/context/NotesContext';

const SimpleInput: React.FC = () => {
  const [localText, setLocalText] = useState('');
  const { setInputText } = useNotesContext();
  
  // Update the context when local text changes
  useEffect(() => {
    setInputText(localText);
  }, [localText, setInputText]);

  return (
    <div className="flex-1 bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden flex flex-col mobile-full-height">
      <div className="px-4 py-3 bg-neutral-50 border-b border-neutral-200 flex justify-between items-center">
        <h3 className="font-medium text-neutral-700">Your Notes</h3>
        <div className="flex space-x-2">
          <button 
            className="text-neutral-500 hover:text-neutral-700 p-1 rounded" 
            title="Clear input"
            onClick={() => setLocalText('')}
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
      ></textarea>
    </div>
  );
};

export default SimpleInput;