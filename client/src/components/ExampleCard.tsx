import React from 'react';

interface ExampleCardProps {
  title: string;
  input: string;
  output: React.ReactNode;
}

const ExampleCard: React.FC<ExampleCardProps> = ({ title, input, output }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
      <div className="px-4 py-3 bg-neutral-50 border-b border-neutral-200">
        <h3 className="font-medium text-neutral-700">{title}</h3>
      </div>
      <div className="p-4">
        <div className="bg-neutral-50 rounded p-3 text-sm text-neutral-600 font-mono mb-3">
          {input.split('\n').map((line, index) => (
            <React.Fragment key={`line-${index}`}>
              {line}
              {index < input.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
        <i className="ri-arrow-down-line block text-center text-neutral-400 my-2"></i>
        {output}
      </div>
    </div>
  );
};

export default ExampleCard;
