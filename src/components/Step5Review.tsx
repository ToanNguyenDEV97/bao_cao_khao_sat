

import React from 'react';
import { Printer, Download, FileText } from 'lucide-react';
import { GeneralInfo, ComputerConfiguration, Recommendation, RecommendationCategory, School } from '../types';
import { RECOMMENDATION_CATEGORIES } from '../constants';
import ComputerConfigurationTable from './ComputerTable';
import ImageGallery from './ImageGallery';
import Logo from './Logo';

interface PdfOptions {
  includePageNumbers: boolean;
  customFooterText: string;
}

interface Step5ReviewProps {
    generalInfo: GeneralInfo;
    configurations: ComputerConfiguration[];
    images: string[];
    recommendations: Recommendation[];
    computerStats: { total: number; working: number; faulty: number; noteLabels: string; };
    groupedRecommendations: Record<RecommendationCategory, Recommendation[]>;
    schools: School[];
    pdfOptions: PdfOptions;
    onPdfOptionsChange: (option: keyof PdfOptions, value: string | boolean) => void;
    isGeneratingPdf: boolean;
    isGeneratingWord: boolean;
    handleDownloadPdf: () => void;
    handleDownloadWord: () => void;
    handlePrint: () => void;
}

const Step5Review: React.FC<Step5ReviewProps> = ({
    generalInfo,
    configurations,
    images,
    recommendations,
    computerStats,
    groupedRecommendations,
    pdfOptions,
    onPdfOptionsChange,
    isGeneratingPdf,
    isGeneratingWord,
    handleDownloadPdf,
    handleDownloadWord,
    handlePrint,
}) => {
    // A complete, read-only version of the info section
    const ReadOnlyGeneralInfo = () => (
         <table className="w-full border-collapse border border-black text-sm">
            <tbody className="divide-y divide-black">
                <tr>
                    <td className="w-10 p-2 text-center border-r border-black font-semibold">1</td>
                    <td className="p-2"><span className="font-semibold mr-2">Tên trường:</span>{generalInfo.schoolName}</td>
                </tr>
                <tr>
                    <td className="w-10 p-2 text-center border-r border-black font-semibold">2</td>
                    <td className="p-2"><span className="font-semibold mr-2">Địa chỉ:</span>{generalInfo.schoolAddress}</td>
                </tr>
                <tr>
                    <td className="w-10 p-2 text-center border-r border-black font-semibold">3</td>
                    <td className="p-2">
                         <div className="flex items-center space-x-8">
                            <span><span className="font-semibold mr-2">Người liên hệ:</span>{generalInfo.contactPerson}</span>
                            <span><span className="font-semibold mr-2">SĐT:</span>{generalInfo.contactPhone}</span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td className="w-10 p-2 text-center border-r border-black font-semibold">4</td>
                    <td className="p-2">
                        <div className="flex items-center space-x-8">
                            <span><span className="font-semibold mr-2">Số phòng máy:</span>{generalInfo.labCount}</span>
                            <span><span className="font-semibold mr-2">Băng thông:</span>{generalInfo.bandwidth || '...'}</span>
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
                                <span className="flex-grow text-right px-2">{generalInfo.roomLength || '...'}</span>
                                <span>mét</span>
                            </div>
                            <div className="flex-[2] flex items-baseline">
                                <span className="whitespace-nowrap">Ghi chú:</span>
                                <span className="pl-2">{generalInfo.roomNotes || '...'}</span>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr className="bg-green-50 print:bg-green-50">
                    <td className="w-10 p-2 text-center border-r border-black font-semibold">5.2</td>
                    <td className="p-2 flex items-baseline">
                        <span className="whitespace-nowrap">Chiều rộng phòng:</span>
                        <span className="flex-grow text-right px-2">{generalInfo.roomWidth || '...'}</span>
                        <span>mét</span>
                    </td>
                </tr>
                <tr className="bg-green-50 print:bg-green-50">
                    <td className="w-10 p-2 text-center border-r border-black font-semibold">5.3</td>
                    <td className="p-2 flex items-baseline">
                        <span className="whitespace-nowrap">Khoảng cách từ tủ điện/cable đến phòng:</span>
                        <span className="flex-grow text-right px-2">{generalInfo.cableDistance || '...'}</span>
                        <span>mét</span>
                    </td>
                </tr>
            </tbody>
         </table>
    );

    return (
        <div className="py-4">
            <div className="mb-8 p-4 bg-yellow-50 border border-yellow-300 rounded-lg text-yellow-800 print:hidden">
                <h2 className="font-bold text-lg">Xem lại & Xuất Báo cáo</h2>
                <p>Kiểm tra lại tất cả thông tin dưới đây. Khi đã sẵn sàng, bạn có thể tải file PDF, Word hoặc in báo cáo trực tiếp.</p>
                
                <div className="mt-4 pt-4 border-t border-yellow-400/60 font-sans">
                    <h3 className="font-semibold text-md mb-2 text-yellow-900">Tùy chọn xuất PDF:</h3>
                    <div className="space-y-3">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="includePageNumbers"
                                checked={pdfOptions.includePageNumbers}
                                onChange={(e) => onPdfOptionsChange('includePageNumbers', e.target.checked)}
                                className="h-4 w-4 rounded border-gray-400 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="includePageNumbers" className="ml-2 block text-sm text-gray-900">
                                Thêm số trang
                            </label>
                        </div>
                        <div className="flex-grow">
                            <label htmlFor="customFooterText" className="sr-only">Văn bản chân trang tùy chỉnh</label>
                            <input
                                type="text"
                                id="customFooterText"
                                value={pdfOptions.customFooterText}
                                onChange={(e) => onPdfOptionsChange('customFooterText', e.target.value)}
                                placeholder="Văn bản chân trang tùy chỉnh..."
                                className="w-full p-2 border border-yellow-300 rounded-md text-sm shadow-sm placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>

                 <div className="flex items-center gap-2 mt-4 pt-4 border-t border-yellow-400/60">
                    <button 
                        onClick={handleDownloadPdf}
                        disabled={isGeneratingPdf || isGeneratingWord}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg inline-flex items-center transition duration-300 disabled:bg-red-400 disabled:cursor-wait"
                    >
                        {isGeneratingPdf ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Đang tạo...
                            </>
                        ) : (
                            <>
                                <Download className="mr-2" size={20}/>
                                Tải PDF
                            </>
                        )}
                    </button>
                    <button 
                        onClick={handleDownloadWord}
                        disabled={isGeneratingPdf || isGeneratingWord}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg inline-flex items-center transition duration-300 disabled:bg-blue-400 disabled:cursor-wait"
                    >
                        {isGeneratingWord ? (
                             <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Đang tạo...
                            </>
                        ) : (
                           <>
                                <FileText className="mr-2" size={20}/>
                                Tải Word
                            </>
                        )}
                    </button>
                    <button 
                        onClick={handlePrint}
                        disabled={isGeneratingPdf || isGeneratingWord}
                        className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg inline-flex items-center transition duration-300 disabled:opacity-50"
                    >
                        <Printer className="mr-2" size={20}/>
                        In Báo Cáo
                    </button>
                </div>
            </div>

            <div className="bg-gray-200 p-8 print:p-0 print:bg-transparent">
                <main id="report-content" className="bg-white shadow-lg print:shadow-none print:border-none font-serif mx-auto border border-black" style={{ width: '210mm', minHeight: '297mm', padding: '15mm' }}>
                    <header className="flex justify-between items-start pb-4 border-b-2 border-black">
                        <Logo />
                        <div className="text-center flex-grow pt-2">
                            <h1 className="text-2xl font-bold tracking-wider">BÁO CÁO KHẢO SÁT PHÒNG MÁY</h1>
                        </div>
                    </header>
                    
                    <section id="review-section-info" className="my-8 break-inside-avoid">
                        <h2 className="text-lg font-bold mb-3">I. Thông tin chung:</h2>
                        <ReadOnlyGeneralInfo />
                    </section>

                    <section id="review-section-config" className="my-8 break-inside-avoid">
                        <h2 className="text-lg font-bold mb-3">II. TÌNH TRẠNG PHÒNG MÁY</h2>
                        <div className="bg-gray-50 p-4 rounded-lg border leading-relaxed">
                            <p><strong>- Tổng số máy:</strong> {computerStats.total} máy</p>
                            <p><strong>- Số máy hoạt động tốt:</strong> {computerStats.working} máy</p>
                            <p><strong>- Số máy bị lỗi:</strong> {computerStats.faulty > 0 ? `${computerStats.faulty} máy (${computerStats.noteLabels})` : '0 máy'}</p>
                        </div>
                        <p className="mt-4 mb-2 font-semibold">- Cấu hình chi tiết từng máy:</p>
                        <ComputerConfigurationTable 
                            configurations={configurations}
                            onDelete={() => {}} onAddNote={() => {}} onRemoveNote={() => {}}
                            onUpdate={() => {}} onDuplicate={() => {}} onAddBlank={() => {}}
                            isReadOnly={true}
                        />
                    </section>

                    <section id="review-section-images" className="my-8 break-inside-avoid">
                        <h2 className="text-lg font-bold mb-3">III. HÌNH ẢNH</h2>
                        <ImageGallery images={images} onImageUpload={() => {}} isReadOnly={true} />
                    </section>

                    <section id="review-section-recs" className="my-8 break-inside-avoid">
                        <h2 className="text-lg font-bold mb-3">IV. ĐỀ XUẤT</h2>
                         <div className="space-y-4">
                            {Object.entries(groupedRecommendations).map(([category, recs]) => {
                                const categoryInfo = RECOMMENDATION_CATEGORIES.find(c => c.value === category);
                                if (!recs || recs.length === 0) return null;
                                return (
                                    <div key={category}>
                                        <h3 className="text-md font-semibold text-gray-800 mt-2">{categoryInfo?.label}:</h3>
                                        <ul className="list-disc list-inside space-y-1 pl-4">
                                            {recs.map(rec => <li key={rec.id}><span>{rec.text}</span></li>)}
                                        </ul>
                                    </div>
                                )
                            })}
                        </div>
                    </section>
                    
                    <footer id="review-footer" className="mt-12 pt-8 break-before-page">
                        <div className="flex justify-around text-center">
                            <div>
                                <p className="font-bold">Người khảo sát</p>
                                <p className="mt-20">(Ký, ghi rõ họ tên)</p>
                            </div>
                            <div>
                                <p className="font-bold">Đại diện đơn vị</p>
                                <p className="mt-20">(Ký, ghi rõ họ tên)</p>
                            </div>
                        </div>
                    </footer>
                </main>
            </div>
        </div>
    );
};

export default Step5Review;