
import React from 'react';
import ComputerConfigurationTable from './ComputerTable';
import { ComputerConfiguration } from '../types';

interface Step2ConfigurationProps {
  configurations: ComputerConfiguration[];
  computerStats: {
    total: number;
    working: number;
    faulty: number;
    noteLabels: string;
  };
  onDelete: (configId: number) => void;
  onAddNote: (configId: number, note: string) => void;
  onRemoveNote: (configId: number, noteIndex: number) => void;
  onUpdate: (configId: number, field: keyof Omit<ComputerConfiguration, 'id' | 'notes'>, value: string) => void;
  onDuplicate: (configId: number) => void;
  onAddBlank: () => void;
}

const Step2Configuration: React.FC<Step2ConfigurationProps> = (props) => {
  const { configurations, computerStats, ...tableProps } = props;
  
  return (
    <div className="py-4 font-serif">
        <h2 className="text-lg font-bold mb-3">II. TÌNH TRẠNG PHÒNG MÁY</h2>
        <div className="bg-gray-50 p-4 rounded-lg border leading-relaxed mb-4">
            <p><strong>- Tổng số máy:</strong> {computerStats.total} máy</p>
            <p><strong>- Số máy hoạt động tốt:</strong> {computerStats.working} máy</p>
            <p><strong>- Số máy bị lỗi:</strong> {computerStats.faulty > 0 ? `${computerStats.faulty} máy (${computerStats.noteLabels})` : '0 máy'}</p>
        </div>
        <p className="mt-4 mb-2 font-semibold">- Cấu hình chi tiết từng máy:</p>
        <ComputerConfigurationTable 
            configurations={configurations}
            {...tableProps}
        />
    </div>
  );
};

export default Step2Configuration;