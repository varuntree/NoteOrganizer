import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ open, onOpenChange, onSave }) => {
  const [apiKey, setApiKey] = useState('');
  const [isValid, setIsValid] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedKey = localStorage.getItem('GEMINI_API_KEY');
    if (savedKey) {
      setApiKey(savedKey);
      setIsValid(true);
    }
  }, [open]);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setApiKey(value);
    setIsValid(value.length > 30);
  };

  const handleSave = () => {
    if (isValid) {
      localStorage.setItem('GEMINI_API_KEY', apiKey);
      toast({
        title: "API Key saved",
        description: "Your Gemini API key has been saved successfully.",
      });
      onSave?.();
      onOpenChange(false);
    }
  };

  const handleRemove = () => {
    localStorage.removeItem('GEMINI_API_KEY');
    setApiKey('');
    setIsValid(false);
    toast({
      title: "API Key removed",
      description: "Your Gemini API key has been removed.",
    });
    onSave?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your Gemini API key to enable AI-powered note organization.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="api-key">Gemini API Key</Label>
            <Input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={handleApiKeyChange}
              placeholder="Enter your Gemini API key"
              className="font-mono text-sm"
            />
            <p className="text-sm text-muted-foreground">
              Get your API key from{' '}
              <a
                href="https://makersuite.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google AI Studio
              </a>
            </p>
          </div>
        </div>
        <div className="flex justify-between">
          {apiKey && (
            <Button variant="destructive" onClick={handleRemove}>
              Remove Key
            </Button>
          )}
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!isValid}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;