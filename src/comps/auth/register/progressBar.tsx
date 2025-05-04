import { useState } from 'react';

interface RegistrationProgressBarProps {
  currentPage: number;
}

const RegistrationProgressBar = ({ currentPage }: RegistrationProgressBarProps) => {
  // Ensure currentPage is between 0-2
  const pageRegis = Math.min(Math.max(0, currentPage), 2);

  // Define steps
  const steps = [
    { number: 1, active: pageRegis >= 0 },
    { number: 2, active: pageRegis >= 1 },
    { number: 3, active: pageRegis >= 2 }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto my-5">
      <div className="flex justify-between items-center relative">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2"></div>

        {/* Active Progress */}
        <div
          className="absolute top-1/2 left-0 h-1 bg-blue-500 -translate-y-1/2 transition-all duration-300"
          style={{ width: `${pageRegis * 50}%` }}
        ></div>

        {/* Step Circles */}
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center relative z-10">
            <div
              className={`flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium transition-colors duration-300 
                ${step.active ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border-2 border-blue-500'}`}
            >
              {step.number}
            </div>

            {/* Progress lines between steps */}
            {/* {index < steps.length - 1 && (
              <div 
                className={`absolute top-4 left-8 h-0.5 w-full transform -translate-y-1/2 transition-colors duration-300
                  ${steps[index + 1].active ? 'bg-blue-500' : 'bg-gray-200'}`}
              ></div>
            )} */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegistrationProgressBar;