import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ExampleCard from '@/components/ExampleCard';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>What can you organize?</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <ExampleCard 
              title="Meeting Notes" 
              input={`meeting with marketing team
sarah discussed q1 results
budget increased by 15%
new campaign starts may 1
need to hire designer`}
              output={
                <div className="bg-neutral-100 rounded p-3 text-sm">
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
              }
            />
            <ExampleCard 
              title="Process Documentation" 
              input={`user signup process
first user enters email
then creates password
system sends verification email
user clicks link
account activated`}
              output={
                <div className="bg-neutral-100 rounded p-3 text-sm text-center">
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
              }
            />
          </div>
          
          <div className="text-sm text-neutral-600">
            <p className="mb-2">NoteOrganizer can help you organize:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Meeting notes and action items</li>
              <li>Project plans and task lists</li>
              <li>Process documentation and workflows</li>
              <li>Research notes and findings</li>
              <li>Ideas and brainstorming sessions</li>
              <li>Daily logs and journal entries</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HelpModal;