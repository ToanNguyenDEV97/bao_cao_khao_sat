import React, { useState, useRef, useEffect } from 'react';
import { GeneralInfo, School } from '../types';

interface GeneralInfoSectionProps {
  info: GeneralInfo;
  onUpdate: (field: keyof GeneralInfo, value: string) => void;
  schools: School[];
}

const EditableCell: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  textAlign?: 'left' | 'center' | 'right';
}> = ({ value, onChange, placeholder = '...', className = '', textAlign = 'left' }) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full p-1 bg-transparent focus:outline-none focus:bg-gray-100 print:p-0 print:bg-transparent ${className}`}
    style={{ textAlign }}
  />
);

const GeneralInfoSection: React.FC<GeneralInfoSectionProps> = ({ info, onUpdate, schools }) => {
  const [suggestions, setSuggestions] = useState<School[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const schoolInputWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (schoolInputWrapperRef.current && !schoolInputWrapperRef.current.contains(event.target as Node)) {
        setIsDropdownVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filterSchools = (value: string) => {
    if (value.trim()) {
      const filtered = schools.filter(school =>
        school.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setIsDropdownVisible(filtered.length > 0);
    } else {
      setSuggestions([]);
      setIsDropdownVisible(false);
    }
  };

  const handleSchoolNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    onUpdate('schoolName', value);
    filterSchools(value);
  };

  const handleSuggestionClick = (school: School) => {
    onUpdate('schoolName', school.name);
    setIsDropdownVisible(false);
    setSuggestions([]);
  };

  const handleUpdate = (field: keyof GeneralInfo) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(field, e.target.value);
  };

  return (
    <table className="w-full border-collapse border border-black text-sm">
      <tbody className="divide-y divide-black">
        <tr>
          <td className="w-10 p-2 text-center border-r border-black font-semibold">1</td>
          <td className="p-2">
            <div className="relative" ref={schoolInputWrapperRef}>
              <div className="flex items-baseline">
                <span className="font-semibold mr-2 whitespace-nowrap">Tên trường:</span>
                <input
                  type="text"
                  value={info.schoolName}
                  onChange={handleSchoolNameChange}
                  onFocus={() => filterSchools(info.schoolName)}
                  placeholder="Chọn hoặc nhập tên trường..."
                  className="w-full p-1 bg-transparent focus:outline-none focus:bg-gray-100 print:p-0 print:bg-transparent"
                  autoComplete="off"
                />
              </div>
              {isDropdownVisible && (
                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto mt-1 print:hidden">
                  <ul className="py-1">
                    {suggestions.map(school => (
                      <li
                        key={school.id}
                        onClick={() => handleSuggestionClick(school)}
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 cursor-pointer"
                      >
                        {school.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </td>
        </tr>
        <tr>
          <td className="w-10 p-2 text-center border-r border-black font-semibold">2</td>
          <td className="p-2 flex items-baseline">
            <span className="font-semibold mr-2 whitespace-nowrap">Địa chỉ:</span>
            <EditableCell value={info.schoolAddress} onChange={handleUpdate('schoolAddress')} />
          </td>
        </tr>
        <tr>
          <td className="w-10 p-2 text-center border-r border-black font-semibold">3</td>
          <td className="p-2">
            <div className="flex items-center space-x-4">
              <div className="flex-1 flex items-baseline">
                <span className="font-semibold mr-2 whitespace-nowrap">Người liên hệ:</span>
                <EditableCell value={info.contactPerson} onChange={handleUpdate('contactPerson')} />
              </div>
              <div className="flex-1 flex items-baseline">
                <span className="font-semibold mr-2 whitespace-nowrap">SĐT:</span>
                <EditableCell value={info.contactPhone} onChange={handleUpdate('contactPhone')} />
              </div>
            </div>
          </td>
        </tr>
         <tr>
          <td className="w-10 p-2 text-center border-r border-black font-semibold">4</td>
          <td className="p-2">
            <div className="flex items-center space-x-4">
              <div className="flex-1 flex items-baseline">
                <span className="font-semibold mr-2 whitespace-nowrap">Số phòng máy:</span>
                <EditableCell value={info.labCount} onChange={handleUpdate('labCount')} />
              </div>
              <div className="flex-1 flex items-baseline">
                <span className="font-semibold mr-2 whitespace-nowrap">Băng thông:</span>
                <EditableCell value={info.bandwidth} onChange={handleUpdate('bandwidth')} />
              </div>
            </div>
          </td>
        </tr>
        <tr className="bg-green-50 print:bg-green-50">
           <td className="w-10 p-2 text-center border-r border-black font-semibold align-top">5</td>
           <td className="p-2 font-semibold italic">Kích thước phòng (áp dụng cho trường hợp đầu tư phòng máy mới)</td>
        </tr>
         <tr className="bg-green-50 print:bg-green-50">
            <td className="w-10 p-2 text-center border-r border-black font-semibold">5.1</td>
            <td className="p-2">
                <div className="flex">
                    <div className="flex-[3] flex items-baseline border-r border-black pr-2 mr-2">
                        <span className="whitespace-nowrap">Chiều dài phòng:</span>
                        <EditableCell value={info.roomLength} onChange={handleUpdate('roomLength')} className="mx-2" textAlign="right"/>
                        <span>mét</span>
                    </div>
                    <div className="flex-[2] flex items-baseline">
                        <span className="whitespace-nowrap">Ghi chú:</span>
                        <EditableCell value={info.roomNotes} onChange={handleUpdate('roomNotes')} className="ml-2"/>
                    </div>
                </div>
            </td>
        </tr>
        <tr className="bg-green-50 print:bg-green-50">
            <td className="w-10 p-2 text-center border-r border-black font-semibold">5.2</td>
            <td className="p-2 flex items-baseline">
                <span className="whitespace-nowrap">Chiều rộng phòng:</span>
                <EditableCell value={info.roomWidth} onChange={handleUpdate('roomWidth')} className="mx-2" textAlign="right"/>
                <span>mét</span>
            </td>
        </tr>
        <tr className="bg-green-50 print:bg-green-50">
            <td className="w-10 p-2 text-center border-r border-black font-semibold">5.3</td>
            <td className="p-2 flex items-baseline">
                <span className="whitespace-nowrap">Khoảng cách từ tủ điện/cable đến phòng:</span>
                <EditableCell value={info.cableDistance} onChange={handleUpdate('cableDistance')} className="mx-2" textAlign="right"/>
                <span>mét</span>
            </td>
        </tr>
      </tbody>
    </table>
  );
};

export default GeneralInfoSection;