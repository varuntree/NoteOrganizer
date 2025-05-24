import React, { useState, useEffect } from 'react';
import { saveApiKey } from '@/lib/api';

interface ApiKeyInputProps {
  onSave: () => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onSave }) => {
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  
  // Check if API key already exists in localStorage
  useEffect(() => {
    const savedKey = localStorage.getItem('GEMINI_API_KEY');
    if (savedKey) {
      setIsSaved(true);
    }
  }, []);
  
  const handleSave = () => {
    if (apiKey.trim()) {
      saveApiKey(apiKey.trim());
      setIsSaved(true);
      onSave();
    }
  };
  
  const handleClear = () => {
    localStorage.removeItem('GEMINI_API_KEY');
    setApiKey('');
    setIsSaved(false);
  };
  
  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-4 mb-4">
      <h3 className="text-lg font-medium mb-3">Gemini API Key</h3>
      
      {isSaved ? (
        <div>
          <p className="text-green-600 mb-3 flex items-center">
            <i className="ri-check-line mr-2"></i>
            API key is saved and ready to use
          </p>
          <button
            onClick={handleClear}
            className="text-sm text-red-600 hover:text-red-800 flex items-center"
          >
            <i className="ri-delete-bin-line mr-1"></i>
            Remove API key
          </button>
        </div>
      ) : (
        <div>
          <p className="text-neutral-600 mb-3">
            Please enter your Gemini API key to enable AI-powered note organization.
            <a 
              href="https://ai.google.dev/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline ml-1"
            >
              Get a key
            </a>
          </p>
          
          <div className="flex space-x-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Gemini API key"
              className="flex-1 border border-neutral-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
              onClick={handleSave}
              disabled={!apiKey.trim()}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiKeyInput;