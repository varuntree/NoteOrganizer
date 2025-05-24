import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';

interface NotesContextType {
  inputText: string;
  setInputText: (text: string) => void;
  clearNotes: () => void;
  saveNotes: () => void;
}

// Create context with default values
const NotesContext = createContext<NotesContextType>({
  inputText: '',
  setInputText: () => {},
  clearNotes: () => {},
  saveNotes: () => {}
});

export const useNotesContext = () => {
  return useContext(NotesContext);
};

interface NotesProviderProps {
  children: React.ReactNode;
}

export const NotesProvider: React.FC<NotesProviderProps> = ({ children }) => {
  // Use localStorage to persist notes
  const [savedNotes, setSavedNotes] = useLocalStorage<string>('note-organizer-text', '');
  const [inputText, setInputText] = useState<string>(savedNotes || '');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Auto-save functionality
  useEffect(() => {
    if (inputText === '' && savedNotes === '') return;
    
    const autoSaveTimeout = setTimeout(() => {
      setSavedNotes(inputText);
      setLastSaved(new Date());
    }, 3000); // Auto-save after 3 seconds of inactivity
    
    return () => clearTimeout(autoSaveTimeout);
  }, [inputText, setSavedNotes, savedNotes]);

  // Clear notes function
  const clearNotes = () => {
    setInputText('');
    setSavedNotes('');
    setLastSaved(null);
  };

  // Save notes function
  const saveNotes = () => {
    setSavedNotes(inputText);
    setLastSaved(new Date());
  };

  // Create memoized context value
  const contextValue = useMemo(() => ({
    inputText,
    setInputText,
    clearNotes,
    saveNotes
  }), [inputText, setInputText, clearNotes, saveNotes]);

  return (
    <NotesContext.Provider value={contextValue}>
      {children}
    </NotesContext.Provider>
  );
};
