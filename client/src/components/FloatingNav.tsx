import React, { useState, useEffect } from 'react';
import { useNotesContext } from '@/context/NotesContext';
import SettingsModal from './SettingsModal';
import HelpModal from './HelpModal';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const FloatingNav: React.FC = () => {
  const { saveNotes, isSaving } = useNotesContext();
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
      <TooltipProvider>
        <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-full px-6 py-3 flex items-center gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <i className="ri-quill-pen-line text-neutral-700 text-lg"></i>
              <span className="text-sm font-medium text-neutral-700">NoteOrganizer</span>
            </div>
            
            {/* Divider */}
            <div className="h-4 w-px bg-neutral-200"></div>
            
            {/* API Key Status */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setSettingsOpen(true)}
                  className="relative p-1 hover:bg-neutral-100 rounded-full transition-colors"
                >
                  <div className={`w-2 h-2 rounded-full ${hasApiKey ? 'bg-green-500' : 'bg-neutral-300'}`}></div>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{hasApiKey ? 'API Key Set' : 'Add API Key'}</p>
              </TooltipContent>
            </Tooltip>
            
            {/* Help */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setHelpOpen(true)}
                  className="text-neutral-500 hover:text-neutral-700 p-1 hover:bg-neutral-100 rounded-full transition-colors"
                >
                  <i className="ri-question-line text-sm"></i>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Help</p>
              </TooltipContent>
            </Tooltip>
            
            {/* Save Status */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={saveNotes}
                  className="text-neutral-500 hover:text-neutral-700 p-1 hover:bg-neutral-100 rounded-full transition-colors"
                >
                  {isSaving ? (
                    <i className="ri-loader-4-line text-sm animate-spin"></i>
                  ) : (
                    <i className="ri-check-line text-sm text-green-500"></i>
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{isSaving ? 'Saving...' : 'Saved'}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </nav>
      </TooltipProvider>
      
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

export default FloatingNav;