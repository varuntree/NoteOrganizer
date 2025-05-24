import React from 'react';
import { useNotesContext } from '@/context/NotesContext';

const Header: React.FC = () => {
  const { saveNotes } = useNotesContext();
  
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <i className="ri-quill-pen-line text-primary text-2xl"></i>
          <h1 className="text-xl font-semibold text-neutral-800">NoteOrganizer</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            type="button" 
            className="text-neutral-500 hover:text-neutral-700 flex items-center text-sm"
          >
            <i className="ri-question-line mr-1"></i>
            <span className="hidden sm:inline">Help</span>
          </button>
          <button 
            type="button" 
            className="bg-primary-50 text-primary hover:bg-primary-100 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
            onClick={saveNotes}
          >
            <i className="ri-save-line mr-1"></i>
            <span className="hidden sm:inline">Save</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
