import React, { useState, useEffect } from 'react';
import { useNotesContext } from '@/context/NotesContext';
import SettingsModal from './SettingsModal';
import HelpModal from './HelpModal';

const Header: React.FC = () => {
  const { saveNotes } = useNotesContext();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  
  useEffect(() => {
    const apiKey = localStorage.getItem('GEMINI_API_KEY');
    setHasApiKey(!!apiKey);
  }, []);
  
  const handleApiKeySave = () => {
    const apiKey = localStorage.getItem('GEMINI_API_KEY');
    setHasApiKey(!!apiKey);
  };
  
  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <i className="ri-quill-pen-line text-primary text-2xl"></i>
            <h1 className="text-xl font-semibold text-neutral-800">NoteOrganizer</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              type="button" 
              className={`flex items-center text-sm px-3 py-1.5 rounded-md transition-colors ${
                hasApiKey 
                  ? 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50' 
                  : 'text-orange-600 hover:text-orange-700 hover:bg-orange-50'
              }`}
              onClick={() => setSettingsOpen(true)}
            >
              <i className={`${hasApiKey ? 'ri-key-line' : 'ri-key-line'} mr-1`}></i>
              <span className="hidden sm:inline">API Key</span>
            </button>
            <button 
              type="button" 
              className="text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50 px-3 py-1.5 rounded-md flex items-center text-sm transition-colors"
              onClick={() => setHelpOpen(true)}
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
      
      <SettingsModal 
        open={settingsOpen} 
        onOpenChange={setSettingsOpen}
        onSave={handleApiKeySave}
      />
      
      <HelpModal 
        open={helpOpen} 
        onOpenChange={setHelpOpen}
      />
    </>
  );
};

export default Header;
