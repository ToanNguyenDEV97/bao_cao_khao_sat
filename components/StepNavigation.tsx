
import React from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  isNextDisabled?: boolean;
}

const StepNavigation: React.FC<StepNavigationProps> = ({ currentStep, totalSteps, onPrev, onNext, isNextDisabled = false }) => {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="mt-8 pt-6 border-t flex justify-between items-center">
      <div>
        {!isFirstStep && (
          <button
            onClick={onPrev}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg inline-flex items-center transition duration-300"
          >
            <ArrowLeft className="mr-2" size={20} />
            Quay lại
          </button>
        )}
      </div>
      <div>
        {!isLastStep && (
            <button
            onClick={onNext}
            disabled={isNextDisabled}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg inline-flex items-center transition duration-300 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
            Tiếp theo
            <ArrowRight className="ml-2" size={20} />
            </button>
        )}
         {isLastStep && (
            <button
            onClick={onNext}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg inline-flex items-center transition duration-300"
            >
            Xem lại & Xuất báo cáo
            <Check className="ml-2" size={20} />
            </button>
        )}
      </div>
    </div>
  );
};

export default StepNavigation;
