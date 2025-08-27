
import React from 'react';

interface StepperProps {
  steps: string[];
  currentStep: number;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="w-full py-4 px-8">
      <div className="flex">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <React.Fragment key={step}>
              <div className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-lg font-semibold ${
                    isCompleted ? 'bg-green-500 text-white' : isActive ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {isCompleted ? '✓' : stepNumber}
                </div>
                <div className={`ml-4 text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                  {step}
                </div>
              </div>
              {stepNumber < steps.length && (
                <div className={`flex-auto border-t-2 transition-colors duration-500 mx-4 self-center ${isCompleted ? 'border-green-500' : 'border-gray-300'}`}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;