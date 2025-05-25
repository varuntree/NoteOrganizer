import React, { useState, useEffect } from 'react';
import { useNotesContext } from '@/context/NotesContext';
import SettingsModal from './SettingsModal';
import HelpModal from './HelpModal';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';

interface FloatingNavProps {
  smartMode: boolean;
  onSmartModeChange: (value: boolean) => void;
}

const FloatingNav: React.FC<FloatingNavProps> = ({ smartMode, onSmartModeChange }) => {
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
        <nav className="fixed top-2 md:top-4 left-1/2 transform -translate-x-1/2 z-50 w-[calc(100%-1rem)] md:w-auto max-w-lg">
          <div className="bg-white/90 backdrop-blur-md shadow-lg rounded-full px-4 md:px-6 py-2 md:py-3 flex items-center justify-between md:justify-center gap-3 md:gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <i className="ri-quill-pen-line text-neutral-700 text-lg"></i>
              <span className="text-sm font-medium text-neutral-700 hidden sm:inline">NoteOrganizer</span>
            </div>
            
            {/* Divider */}
            <div className="h-4 w-px bg-neutral-200 hidden md:block"></div>
            
            {/* Smart Mode Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => onSmartModeChange(!smartMode)}>
                  <i className={`ri-brain-line text-sm ${smartMode ? 'text-blue-600' : 'text-neutral-400'}`}></i>
                  <span className="text-xs text-neutral-600 hidden sm:inline">Smart</span>
                  <div className={`w-8 h-4 rounded-full transition-all duration-200 relative ${
                    smartMode ? 'bg-blue-500' : 'bg-neutral-300'
                  }`}>
                    <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-all duration-200 absolute top-0.5 ${
                      smartMode ? 'left-4' : 'left-0.5'
                    }`}></div>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{smartMode ? 'AI decides format automatically' : 'Manual text/visual selection'}</p>
              </TooltipContent>
            </Tooltip>
            
            {/* Divider */}
            <div className="h-4 w-px bg-neutral-200 hidden md:block"></div>
            
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