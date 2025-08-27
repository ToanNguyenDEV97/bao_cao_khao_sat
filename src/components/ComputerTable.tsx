
import React, { useState } from 'react';
import { ComputerConfiguration } from '../types';
import { Trash2, PlusCircle, X, Copy, Plus } from 'lucide-react';

type EditableConfigFields = Omit<ComputerConfiguration, 'id' | 'notes'>;

interface ComputerConfigurationTableProps {
  configurations: ComputerConfiguration[];
  onDelete: (configId: number) => void;
  onAddNote: (configId: number, note: string) => void;
  onRemoveNote: (configId: number, noteIndex: number) => void;
  onUpdate: (configId: number, field: keyof EditableConfigFields, value: string) => void;
  onDuplicate: (configId: number) => void;
  onAddBlank: () => void;
  isReadOnly?: boolean;
}

const EditableCell: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  isReadOnly: boolean;
}> = ({ value, onChange, className = '', isReadOnly }) => (
  isReadOnly ? (
    <span className={`block w-full p-1 font-sans ${className}`}>{value || ''}</span>
  ) : (
    <input
        type="text"
        value={value}
        onChange={onChange}
        className={`w-full p-1 bg-transparent focus:outline-none focus:bg-yellow-100 print:p-0 print:bg-transparent font-sans ${className}`}
    />
  )
);

const ComputerConfigurationTable: React.FC<ComputerConfigurationTableProps> = ({ 
  configurations, 
  onDelete, 
  onAddNote, 
  onRemoveNote,
  onUpdate,
  onDuplicate,
  onAddBlank,
  isReadOnly = false,
}) => {
  const [newNotes, setNewNotes] = useState<Record<number, string>>({});
  const [configToDelete, setConfigToDelete] = useState<number | null>(null);

  const handleNoteInputChange = (configId: number, value: string) => {
    setNewNotes(prev => ({ ...prev, [configId]: value }));
  };

  const handleAddNote = (configId: number) => {
    const noteText = newNotes[configId]?.trim();
    if (noteText) {
      onAddNote(configId, noteText);
      handleNoteInputChange(configId, '');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, configId: number) => {
    if (e.key === 'Enter') handleAddNote(configId);
  };
  
  const handleConfirmDelete = () => {
    if (configToDelete !== null) {
      onDelete(configToDelete);
      setConfigToDelete(null);
    }
  };

  const headers = ['STT', 'CPU', 'RAM', 'Ổ cứng', 'Hệ điều hành', 'Màn hình', 'Office', 'Ghi chú'];
  if (!isReadOnly) {
    headers.push('Hành động');
  }

  return (
    <div className="overflow-x-auto print:overflow-visible">
      {!isReadOnly && configToDelete !== null && (
        <div role="dialog" aria-modal="true" aria-labelledby="delete-confirmation-title" className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 print:hidden">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-4 font-sans">
            <h2 id="delete-confirmation-title" className="text-lg font-bold text-gray-900">Xác nhận xóa</h2>
            <p className="mt-2 text-sm text-gray-600">Bạn có chắc chắn muốn xóa cấu hình này không? Hành động này không thể được hoàn tác.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setConfigToDelete(null)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none">Hủy</button>
              <button onClick={handleConfirmDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none">Xóa</button>
            </div>
          </div>
        </div>
      )}
      <table className="w-full border-collapse border border-black text-sm font-serif">
        <thead className="bg-gray-100 print:bg-gray-100">
          <tr>
            {headers.map(header => (
              <th key={header} className={`border border-black p-2 font-semibold uppercase text-center ${header === 'Hành động' ? 'print:hidden' : ''}`}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-black">
          {configurations.map((config, index) => (
            <tr key={config.id} className="hover:bg-gray-50 break-inside-avoid">
              <td className="border border-black p-2 text-center">{index + 1}</td>
              <td className="border border-black p-0"><EditableCell isReadOnly={isReadOnly} value={config.cpu} onChange={(e) => onUpdate(config.id, 'cpu', e.target.value)} /></td>
              <td className="border border-black p-0"><EditableCell isReadOnly={isReadOnly} value={config.ram} onChange={(e) => onUpdate(config.id, 'ram', e.target.value)} /></td>
              <td className="border border-black p-0"><EditableCell isReadOnly={isReadOnly} value={config.storage} onChange={(e) => onUpdate(config.id, 'storage', e.target.value)} /></td>
              <td className="border border-black p-0"><EditableCell isReadOnly={isReadOnly} value={config.os} onChange={(e) => onUpdate(config.id, 'os', e.target.value)} /></td>
              <td className="border border-black p-0"><EditableCell isReadOnly={isReadOnly} value={config.monitor} onChange={(e) => onUpdate(config.id, 'monitor', e.target.value)} /></td>
              <td className="border border-black p-0"><EditableCell isReadOnly={isReadOnly} value={config.office} onChange={(e) => onUpdate(config.id, 'office', e.target.value)} /></td>
              <td className="border border-black p-2 align-top text-left">
                <ul className="list-disc list-inside space-y-1 font-sans">
                  {config.notes.map((note, noteIndex) => (
                    <li key={noteIndex} className="group flex items-center justify-between">
                      <span>{note}</span>
                      {!isReadOnly && (
                        <button onClick={() => onRemoveNote(config.id, noteIndex)} className="print:hidden opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity ml-2">
                          <X size={14} />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
                {!isReadOnly && (
                  <div className="flex items-center mt-2 print:hidden">
                    <input
                      type="text"
                      value={newNotes[config.id] || ''}
                      onChange={(e) => handleNoteInputChange(config.id, e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, config.id)}
                      placeholder="Thêm ghi chú..."
                      className="flex-grow p-1 text-xs border rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
                    />
                    <button 
                      onClick={() => handleAddNote(config.id)} 
                      className="bg-blue-500 text-white p-1.5 rounded-r-md hover:bg-blue-600 disabled:bg-blue-300"
                      disabled={!newNotes[config.id]?.trim()}
                    >
                      <PlusCircle size={14} />
                    </button>
                  </div>
                )}
              </td>
              {!isReadOnly && (
                <td className="border border-black p-2 text-center align-middle print:hidden">
                  <div className="flex justify-center items-center gap-2">
                    <button onClick={() => onDuplicate(config.id)} className="text-blue-600 hover:text-blue-800" title="Nhân bản">
                      <Copy size={16} />
                    </button>
                    <button onClick={() => setConfigToDelete(config.id)} className="text-red-600 hover:text-red-800" title="Xóa">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {!isReadOnly && (
        <div className="mt-4 print:hidden">
          <button
            onClick={onAddBlank}
            className="w-full border-2 border-dashed border-gray-300 hover:border-gray-400 text-gray-500 hover:text-gray-600 font-bold py-2 px-4 rounded-lg flex items-center justify-center transition"
          >
            <Plus size={18} className="mr-2" /> Thêm máy
          </button>
        </div>
      )}
    </div>
  );
};

export default ComputerConfigurationTable;