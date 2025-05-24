import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-neutral-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <i className="ri-quill-pen-line text-primary text-xl"></i>
            <span className="text-neutral-800 font-medium">NoteOrganizer</span>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-neutral-500 hover:text-neutral-700 text-sm">Privacy Policy</a>
            <a href="#" className="text-neutral-500 hover:text-neutral-700 text-sm">Terms of Service</a>
            <a href="#" className="text-neutral-500 hover:text-neutral-700 text-sm">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
