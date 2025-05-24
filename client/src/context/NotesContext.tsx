import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';

interface NotesContextType {
  inputText: string;
  setInputText: (text: string) => void;
  clearNotes: () => void;
  saveNotes: () => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const useNotesContext = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotesContext must be used within a NotesProvider');
  }
  return context;
};

interface NotesProviderProps {
  children: React.ReactNode;
}

export const NotesProvider: React.FC<NotesProviderProps> = ({ children }) => {
  const [savedNotes, setSavedNotes] = useLocalStorage<string>('note-organizer-text', '');
  const [inputText, setInputText] = useState<string>('');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Load saved notes on initial render
  useEffect(() => {
    if (savedNotes) {
      setInputText(savedNotes);
    }
  }, [savedNotes]);

  // Auto-save functionality
  useEffect(() => {
    if (!inputText) return;
    
    const autoSaveTimeout = setTimeout(() => {
      setSavedNotes(inputText);
      setLastSaved(new Date());
    }, 3000); // Auto-save after 3 seconds of inactivity
    
    return () => clearTimeout(autoSaveTimeout);
  }, [inputText, setSavedNotes]);

  const clearNotes = () => {
    setInputText('');
    setSavedNotes('');
    setLastSaved(null);
  };

  const saveNotes = () => {
    setSavedNotes(inputText);
    setLastSaved(new Date());
  };

  return (
    <NotesContext.Provider value={{ 
      inputText, 
      setInputText,
      clearNotes,
      saveNotes
    }}>
      {children}
    </NotesContext.Provider>
  );
};
