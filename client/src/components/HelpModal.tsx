import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface HelpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>How to use NoteOrganizer</DialogTitle>
          <DialogDescription>
            Learn how to transform your messy notes into organized content
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="examples" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="examples">Examples</TabsTrigger>
            <TabsTrigger value="tips">Tips & Tricks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="examples" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Meeting Notes</h3>
                <div className="grid gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Input:</p>
                    <pre className="bg-muted p-2 rounded text-sm">meeting with marketing team
sarah discussed q1 results
budget increased by 15%
new campaign starts may 1
need to hire designer</pre>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Output:</p>
                    <div className="bg-muted p-3 rounded text-sm">
                      <p className="font-medium mb-2">Marketing Team Meeting</p>
                      <p><strong>Participants:</strong> Sarah</p>
                      <p><strong>Updates:</strong></p>
                      <ul className="list-disc pl-5 mb-2">
                        <li>Q1 results discussed</li>
                        <li>Budget increased by 15%</li>
                      </ul>
                      <p><strong>Action Items:</strong></p>
                      <ul className="list-disc pl-5">
                        <li>New campaign launch: May 1</li>
                        <li>Hire designer</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Process Documentation</h3>
                <div className="grid gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Input:</p>
                    <pre className="bg-muted p-2 rounded text-sm">user signup process
first user enters email
then creates password
system sends verification email
user clicks link
account activated</pre>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Output (Visualization mode):</p>
                    <div className="bg-muted p-3 rounded text-sm text-center">
                      <div className="inline-block text-left">
                        <div className="border border-neutral-300 rounded px-3 py-1 mb-2 bg-white">User enters email</div>
                        <div className="text-neutral-400 text-center">↓</div>
                        <div className="border border-neutral-300 rounded px-3 py-1 my-2 bg-white">Creates password</div>
                        <div className="text-neutral-400 text-center">↓</div>
                        <div className="border border-neutral-300 rounded px-3 py-1 my-2 bg-white">System sends verification</div>
                        <div className="text-neutral-400 text-center">↓</div>
                        <div className="border border-neutral-300 rounded px-3 py-1 my-2 bg-white">User clicks link</div>
                        <div className="text-neutral-400 text-center">↓</div>
                        <div className="border border-neutral-300 rounded px-3 py-1 mt-2 bg-white">Account activated</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="tips" className="space-y-4 mt-4">
            <div className="space-y-3">
              <div className="flex gap-3">
                <i className="ri-lightbulb-line text-primary text-lg mt-0.5"></i>
                <div>
                  <h4 className="font-semibold mb-1">Auto-processing</h4>
                  <p className="text-sm text-muted-foreground">Your notes are automatically processed after 2 seconds of no typing. No need to click any buttons!</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <i className="ri-toggle-line text-primary text-lg mt-0.5"></i>
                <div>
                  <h4 className="font-semibold mb-1">Smart Mode Detection</h4>
                  <p className="text-sm text-muted-foreground">The AI automatically detects whether to organize your text or create a diagram based on your content.</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <i className="ri-save-line text-primary text-lg mt-0.5"></i>
                <div>
                  <h4 className="font-semibold mb-1">Auto-save</h4>
                  <p className="text-sm text-muted-foreground">Your notes are automatically saved after 3 seconds of inactivity. You can also manually save with the Save button.</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <i className="ri-key-line text-primary text-lg mt-0.5"></i>
                <div>
                  <h4 className="font-semibold mb-1">API Key Required</h4>
                  <p className="text-sm text-muted-foreground">To use AI features, you need a Gemini API key. Click the API Key button in the header to add yours.</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <i className="ri-refresh-line text-primary text-lg mt-0.5"></i>
                <div>
                  <h4 className="font-semibold mb-1">Manual Processing</h4>
                  <p className="text-sm text-muted-foreground">You can manually trigger processing by clicking outside the input area or switching between organize/visualize modes.</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default HelpModal;