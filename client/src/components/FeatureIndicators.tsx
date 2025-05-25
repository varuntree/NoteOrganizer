import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const FeatureIndicators: React.FC = () => {
  const features = [
    {
      icon: 'ri-magic-line',
      title: 'Smart Organization',
      description: 'AI-powered note formatting',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      hoverBgColor: 'hover:bg-purple-100'
    },
    {
      icon: 'ri-flow-chart-line',
      title: 'Visual Diagrams',
      description: 'Auto-generated flowcharts',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      hoverBgColor: 'hover:bg-blue-100'
    },
    {
      icon: 'ri-save-line',
      title: 'Auto-Save',
      description: 'Never lose your work',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      hoverBgColor: 'hover:bg-green-100'
    }
  ];

  return (
    <TooltipProvider>
      <div className="flex items-center justify-center gap-4 py-4">
        {features.map((feature, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <div 
                className={`${feature.bgColor} ${feature.hoverBgColor} p-3 rounded-full transition-all duration-200 cursor-default transform hover:scale-110`}
              >
                <i className={`${feature.icon} ${feature.color} text-xl`}></i>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-center">
                <p className="font-semibold">{feature.title}</p>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};

export default FeatureIndicators;