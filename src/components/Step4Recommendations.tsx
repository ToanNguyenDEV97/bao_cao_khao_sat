
import React from 'react';
import { Trash2 } from 'lucide-react';
import { Recommendation, RecommendationCategory } from '../types';
import { RECOMMENDATION_CATEGORIES } from '../constants';

interface Step4RecommendationsProps {
    recommendations: Recommendation[];
    groupedRecommendations: Record<RecommendationCategory, Recommendation[]>;
    newRecText: string;
    newRecCategory: RecommendationCategory;
    onNewRecTextChange: (text: string) => void;
    onNewRecCategoryChange: (category: RecommendationCategory) => void;
    onAddRecommendation: () => void;
    onRemoveRecommendation: (id: number) => void;
}

const Step4Recommendations: React.FC<Step4RecommendationsProps> = ({
    recommendations,
    groupedRecommendations,
    newRecText,
    newRecCategory,
    onNewRecTextChange,
    onNewRecCategoryChange,
    onAddRecommendation,
    onRemoveRecommendation,
}) => {
  return (
    <div className="py-4 font-serif">
        <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold">IV. ĐỀ XUẤT</h2>
        </div>
        <div className="space-y-4 min-h-[150px]">
            {recommendations.length > 0 ? 
                Object.entries(groupedRecommendations).map(([category, recs]) => {
                    const categoryInfo = RECOMMENDATION_CATEGORIES.find(c => c.value === category);
                    if (!recs || recs.length === 0) return null;
                    return (
                        <div key={category}>
                            <h3 className="text-md font-semibold text-gray-800 mt-2">{categoryInfo?.label}:</h3>
                            <ul className="list-disc list-inside space-y-1 pl-4">
                                {recs.map(rec => (
                                    <li key={rec.id} className="group flex items-center justify-between">
                                        <span>{rec.text}</span>
                                        <button onClick={() => onRemoveRecommendation(rec.id)} className="print:hidden opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity">
                                            <Trash2 size={16} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )
                })
                : (
                    <div className="text-center text-gray-500 py-8">
                        <p>Chưa có đề xuất nào.</p>
                        <p className="text-sm">Sử dụng biểu mẫu bên dưới để thêm đề xuất mới.</p>
                    </div>
                )
            }
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mt-4 pt-4 border-t print:hidden font-sans">
            <select 
                value={newRecCategory} 
                onChange={e => onNewRecCategoryChange(e.target.value as RecommendationCategory)}
                className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:w-1/4"
            >
                {RECOMMENDATION_CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
            </select>
            <input 
                type="text"
                value={newRecText}
                onChange={e => onNewRecTextChange(e.target.value)}
                placeholder="Nhập nội dung đề xuất..."
                className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
                onClick={onAddRecommendation}
                disabled={!newRecText.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:bg-indigo-300 disabled:cursor-not-allowed"
            >
                Thêm
            </button>
        </div>
    </div>
  );
};

export default Step4Recommendations;