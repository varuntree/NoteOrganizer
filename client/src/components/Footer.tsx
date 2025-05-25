import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-neutral-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-center space-x-2">
          <i className="ri-quill-pen-line text-primary text-lg"></i>
          <span className="text-neutral-600 text-sm">NoteOrganizer</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
