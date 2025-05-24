import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InputPane from '@/components/InputPane';
import OutputPane from '@/components/OutputPane';
import FeatureCard from '@/components/FeatureCard';
import ExampleCard from '@/components/ExampleCard';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-grow">
        {/* Introduction */}
        <div className="mb-6 max-w-3xl">
          <h2 className="text-2xl font-bold text-neutral-800 mb-2">Transform your messy notes</h2>
          <p className="text-neutral-600">Just start typing your unstructured notes on the left, and watch as they get instantly organized on the right.</p>
        </div>

        {/* Two-pane Layout */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 mobile-stack">
          <InputPane />
          <OutputPane />
        </div>

        {/* Feature Highlights */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <FeatureCard 
            icon="ri-magic-line" 
            title="Smart Organization" 
            description="Our AI automatically formats your messy notes into clean, structured documents with proper headings and bullet points."
          />
          <FeatureCard 
            icon="ri-flow-chart-line" 
            title="Visual Diagrams" 
            description="Switch to visualization mode to automatically transform your process notes into beautiful, clear diagrams."
          />
          <FeatureCard 
            icon="ri-save-line" 
            title="Auto-Save" 
            description="Never lose your work. Your notes are automatically saved as you type and can be accessed anytime."
          />
        </div>

        {/* Example Scenarios */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-neutral-800 mb-4">What can you organize?</h2>
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
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
