
import React from 'react';
import GeneralInfoSection from './GeneralInfoSection';
import { GeneralInfo, School } from '../types';

interface Step1GeneralInfoProps {
  info: GeneralInfo;
  onUpdate: (field: keyof GeneralInfo, value: string) => void;
  schools: School[];
}

const Step1GeneralInfo: React.FC<Step1GeneralInfoProps> = ({ info, onUpdate, schools }) => {
  return (
    <div className="py-4 font-serif">
        <h2 className="text-lg font-bold mb-3">I. Thông tin chung:</h2>
        <div className="print:border-none print:p-0 print:mb-4">
            <GeneralInfoSection 
            info={info} 
            onUpdate={onUpdate}
            schools={schools}
            />
        </div>
    </div>
  );
};

export default Step1GeneralInfo;