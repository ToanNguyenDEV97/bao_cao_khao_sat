
import React from 'react';
import { Trash2, Sparkles } from 'lucide-react';
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
    onGenerateAiRecommendations: () => void;
    isGeneratingAiRecs: boolean;
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
    onGenerateAiRecommendations,
    isGeneratingAiRecs,
}) => {
  return (
    <div className="py-4 font-serif">
        <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold">IV. ĐỀ XUẤT</h2>
            <button
                onClick={onGenerateAiRecommendations}
                disabled={isGeneratingAiRecs}
                className="font-sans bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg inline-flex items-center transition duration-300 disabled:bg-purple-400 disabled:cursor-wait print:hidden"
            >
                {isGeneratingAiRecs ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang xử lý...
                    </>
                ) : (
                    <>
                        <Sparkles className="mr-2" size={18}/>
                        Gợi ý bằng AI
                    </>
                )}
            </button>
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
                        <p className="text-sm">Sử dụng biểu mẫu bên dưới hoặc AI để thêm đề xuất mới.</p>
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
