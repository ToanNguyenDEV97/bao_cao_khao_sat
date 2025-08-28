

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Recommendation, RecommendationCategory, ComputerConfiguration, GeneralInfo, School } from './types';
import { INITIAL_RECOMMENDATIONS, INITIAL_CONFIGURATIONS } from './constants';
import { SCHOOL_DATA } from './data/schools';
import { Download, Upload, RotateCw } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


import Stepper from './components/Stepper';
import StepNavigation from './components/StepNavigation';
import Step1GeneralInfo from './components/Step1GeneralInfo';
import Step2Configuration from './components/Step2Configuration';
import Step3Images from './components/Step3Images';
import Step4Recommendations from './components/Step4Recommendations';
import Step5Review from './components/Step5Review';


const STEPS = [
    'Thông tin chung',
    'Cấu hình máy',
    'Hình ảnh',
    'Đề xuất',
];

const STORAGE_KEY = 'computerLabReportData';

interface PdfOptions {
  includePageNumbers: boolean;
  customFooterText: string;
}

interface AppState {
    currentStep: number;
    generalInfo: GeneralInfo;
    configurations: ComputerConfiguration[];
    recommendations: Recommendation[];
    images: string[];
    pdfOptions: PdfOptions;
}


const App: React.FC = () => {
  
  // Load state from localStorage on initial render
  const loadState = (): AppState | undefined => {
    try {
      const serializedState = localStorage.getItem(STORAGE_KEY);
      if (serializedState === null) {
        return undefined;
      }
      const state = JSON.parse(serializedState);
      // Basic validation
      if (state.generalInfo && state.configurations && state.recommendations && state.images && state.currentStep) {
          return state;
      }
      return undefined;
    } catch (err) {
      console.error("Could not load state from localStorage", err);
      return undefined;
    }
  };

  const persistedState = loadState();

  const [currentStep, setCurrentStep] = useState(persistedState?.currentStep || 1);
  const [generalInfo, setGeneralInfo] = useState<GeneralInfo>(persistedState?.generalInfo || {
    schoolName: 'THCS Bình Tây',
    schoolAddress: '36A Đ.Bình Tây, Phường 1, Quận 6, Hồ Chí Minh, Việt Nam',
    contactPerson: 'Cô Lan',
    contactPhone: '0901234567',
    labCount: '3',
    bandwidth: '',
    roomLength: '',
    roomWidth: '',
    cableDistance: '',
    roomNotes: '',
  });
  const [configurations, setConfigurations] = useState<ComputerConfiguration[]>(persistedState?.configurations || INITIAL_CONFIGURATIONS);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(persistedState?.recommendations || INITIAL_RECOMMENDATIONS);
  const [images, setImages] = useState<string[]>(persistedState?.images || []);
  const [pdfOptions, setPdfOptions] = useState<PdfOptions>(persistedState?.pdfOptions || {
    includePageNumbers: true,
    customFooterText: '',
  });

  const [newRecText, setNewRecText] = useState('');
  const [newRecCategory, setNewRecCategory] = useState<RecommendationCategory>(RecommendationCategory.MAINTENANCE);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isGeneratingWord, setIsGeneratingWord] = useState(false);
  const [schools, setSchools] = useState<School[]>(SCHOOL_DATA);
  const importInputRef = useRef<HTMLInputElement>(null);


  // Save state to localStorage whenever it changes
  useEffect(() => {
    const stateToSave: AppState = {
      currentStep,
      generalInfo,
      configurations,
      recommendations,
      images,
      pdfOptions,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (err) {
      console.error("Could not save state to localStorage", err);
    }
  }, [currentStep, generalInfo, configurations, recommendations, images, pdfOptions]);

  useEffect(() => {
    const { schoolName, schoolAddress, contactPerson, contactPhone } = generalInfo;
    if (schoolName && schoolAddress && contactPerson && contactPhone) {
        const schoolExists = schools.some(s => s.name.toLowerCase() === schoolName.toLowerCase());
        if (!schoolExists) {
            const newSchool: School = {
                id: schoolName.toLowerCase().replace(/\s+/g, '_'),
                name: schoolName,
                address: schoolAddress,
                contactPerson: contactPerson,
                contactPhone: contactPhone,
            };
            setSchools(prevSchools => [...prevSchools, newSchool]);
        }
    }
  }, [generalInfo, schools]);

  const handleGeneralInfoChange = (field: keyof GeneralInfo, value: string) => {
      let updatedInfo: GeneralInfo = { ...generalInfo, [field]: value };
      if (field === 'schoolName') {
        const selectedSchool = schools.find(s => s.name === value);
        if (selectedSchool) {
          updatedInfo = {
            ...generalInfo,
            schoolName: selectedSchool.name,
            schoolAddress: selectedSchool.address,
            contactPerson: selectedSchool.contactPerson,
            contactPhone: selectedSchool.contactPhone,
          };
        }
      }
      setGeneralInfo(updatedInfo);
  };
  
  const handlePdfOptionsChange = (option: keyof PdfOptions, value: string | boolean) => {
    setPdfOptions(prev => ({ ...prev, [option]: value }));
  };

  const handleImageUpload = (newImages: string[]) => {
      setImages(newImages.slice(0, 4));
  };

  const handleAddRecommendation = () => {
    if (newRecText.trim() === '') return;
    const newRec: Recommendation = {
        id: Date.now(),
        category: newRecCategory,
        text: newRecText.trim(),
    };
    setRecommendations([...recommendations, newRec]);
    setNewRecText('');
    setNewRecCategory(RecommendationCategory.MAINTENANCE);
  };

  const handleRemoveRecommendation = (id: number) => {
    setRecommendations(recommendations.filter(rec => rec.id !== id));
  };
  
  const computerStats = useMemo(() => {
    const total = configurations.length;
    const faultyConfigs = configurations.filter(c => c.notes.length > 0);
    const faulty = faultyConfigs.length;
    const working = total - faulty;
    const allNotes = faultyConfigs.flatMap(c => c.notes);
    const uniqueNotes = [...new Set(allNotes)];
    const noteLabels = uniqueNotes.join(', ');
    return { total, working, faulty, noteLabels };
  }, [configurations]);

  const groupedRecommendations = useMemo(() => {
    return recommendations.reduce((acc, rec) => {
        (acc[rec.category] = acc[rec.category] || []).push(rec);
        return acc;
    }, {} as Record<RecommendationCategory, Recommendation[]>);
  }, [recommendations]);

  const handleUpdateConfiguration = (configId: number, field: keyof Omit<ComputerConfiguration, 'id' | 'notes'>, value: string | number) => {
    setConfigurations(configurations.map(config => 
      config.id === configId ? { ...config, [field]: value } : config
    ));
  };

  const handleDuplicateConfiguration = (configId: number) => {
    const configToDuplicate = configurations.find(c => c.id === configId);
    if (configToDuplicate) {
      const newConfig = { ...configToDuplicate, id: Date.now() };
      const index = configurations.findIndex(c => c.id === configId);
      const newConfigurations = [...configurations];
      newConfigurations.splice(index + 1, 0, newConfig);
      setConfigurations(newConfigurations);
    }
  };
  
  const handleAddBlankConfiguration = () => {
    const newConfig: ComputerConfiguration = {
      id: Date.now(), cpu: '', ram: '', storage: '', os: 'Win10', monitor: '', office: 'Office19', notes: [],
    };
    setConfigurations([...configurations, newConfig]);
  };
  
  const handleDeleteConfiguration = (configId: number) => {
      setConfigurations(configurations.filter(config => config.id !== configId));
  };
  
  const handleAddNoteToConfiguration = (configId: number, note: string) => {
      setConfigurations(configurations.map(config => 
          config.id === configId ? { ...config, notes: [...config.notes, note] } : config
      ));
  };
  
  const handleRemoveNoteFromConfiguration = (configId: number, noteIndex: number) => {
      setConfigurations(configurations.map(config => 
          config.id === configId ? { ...config, notes: config.notes.filter((_, index) => index !== noteIndex) } : config
      ));
  };
  
  const handlePrint = () => window.print();

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    const reportElement = document.getElementById('report-content');
    if (!reportElement) {
        alert("Không thể tạo PDF, không tìm thấy nội dung báo cáo.");
        setIsGeneratingPdf(false);
        return;
    }

    try {
        const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
        const MARGIN = 15;
        const PAGE_WIDTH = pdf.internal.pageSize.getWidth();
        const PAGE_HEIGHT = pdf.internal.pageSize.getHeight();
        const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
        
        let y = MARGIN;
        let pageNumber = 1;
        const PADDING_BETWEEN_ELEMENTS = 4;

        const addPageFooter = (pageNum: number) => {
            if (!pdfOptions.includePageNumbers && !pdfOptions.customFooterText) return;
            const originalFontSize = pdf.getFontSize();
            const originalTextColor = pdf.getTextColor();
            pdf.setFontSize(9);
            pdf.setTextColor(128, 128, 128);
            const footerY = PAGE_HEIGHT - 10;
            const footerTextParts: string[] = [];
            if (pdfOptions.customFooterText) footerTextParts.push(pdfOptions.customFooterText);
            if (pdfOptions.includePageNumbers) footerTextParts.push(`Trang ${pageNum}`);
            const footerText = footerTextParts.join('  |  ');
            pdf.text(footerText, PAGE_WIDTH / 2, footerY, { align: 'center' });
            pdf.setFontSize(originalFontSize);
            pdf.setTextColor(originalTextColor);
        };
        
        const addPage = () => {
            addPageFooter(pageNumber);
            pdf.addPage();
            pageNumber++;
            return MARGIN;
        };

        const addElement = async (element: HTMLElement | null, currentY: number): Promise<number> => {
            if (!element) return currentY;
            const canvas = await html2canvas(element, { scale: 2, useCORS: true });
            const imgProps = pdf.getImageProperties(canvas);
            const elementHeight = (imgProps.height * CONTENT_WIDTH) / imgProps.width;

            if (currentY + elementHeight > PAGE_HEIGHT - MARGIN && currentY > MARGIN) {
                currentY = addPage();
            }
            
            pdf.addImage(canvas, 'PNG', MARGIN, currentY, CONTENT_WIDTH, elementHeight);
            return currentY + elementHeight + PADDING_BETWEEN_ELEMENTS;
        };

        // Process elements sequentially
        y = await addElement(reportElement.querySelector('header'), y);
        y = await addElement(document.getElementById('review-section-info'), y);

        // --- Handle Config Section with Table ---
        const configSection = document.getElementById('review-section-config');
        if (configSection) {
            y = await addElement(configSection.querySelector('h2'), y);
            y = await addElement(configSection.querySelector('.bg-gray-50'), y);
            y = await addElement(configSection.querySelector('p.font-semibold'), y);

            const tableEl = configSection.querySelector('table');
            if (tableEl) {
                const thead = tableEl.querySelector('thead');
                const tbodyRows = Array.from(tableEl.querySelectorAll('tbody tr')) as HTMLElement[];
                
                let headerCanvas: HTMLCanvasElement | null = null;
                let headerHeight = 0;

                if (thead) {
                    headerCanvas = await html2canvas(thead, { scale: 2 });
                    const headerProps = pdf.getImageProperties(headerCanvas);
                    headerHeight = (headerProps.height * CONTENT_WIDTH) / headerProps.width;
                }

                const addTableHeader = (currentY: number) => {
                    if (!headerCanvas) return currentY;
                    if (currentY + headerHeight > PAGE_HEIGHT - MARGIN && currentY > MARGIN) {
                        currentY = addPage();
                    }
                    pdf.addImage(headerCanvas, 'PNG', MARGIN, currentY, CONTENT_WIDTH, headerHeight);
                    return currentY + headerHeight;
                };

                y = addTableHeader(y);

                for (const row of tbodyRows) {
                    const canvas = await html2canvas(row, { scale: 2 });
                    const imgProps = pdf.getImageProperties(canvas);
                    const rowHeight = (imgProps.height * CONTENT_WIDTH) / imgProps.width;
                    
                    if (y + rowHeight > PAGE_HEIGHT - MARGIN) {
                        y = addPage();
                        y = addTableHeader(y);
                    }
                    pdf.addImage(canvas, 'PNG', MARGIN, y, CONTENT_WIDTH, rowHeight);
                    y += rowHeight;
                }
                 y += PADDING_BETWEEN_ELEMENTS;
            }
        }
        
        y = await addElement(document.getElementById('review-section-images'), y);
        
        // --- Handle Recommendations Section ---
        const recsSection = document.getElementById('review-section-recs');
        if(recsSection) {
            y = await addElement(recsSection.querySelector('h2'), y);
            const recGroups = Array.from(recsSection.querySelectorAll('.space-y-4 > div')) as HTMLElement[];
            for (const group of recGroups) {
                y = await addElement(group, y);
            }
        }

        // --- Handle Footer ---
        const footerEl = document.getElementById('review-footer');
        if (footerEl) {
            if (y > MARGIN + 1) { 
                 y = addPage();
            }
            y = await addElement(footerEl, y);
        }

        addPageFooter(pageNumber);
        pdf.save('BaoCaoKhaoSat.pdf');
    } catch (error) {
        console.error("Lỗi khi tạo PDF:", error);
        alert("Đã có lỗi xảy ra trong quá trình tạo tệp PDF.");
    } finally {
        setIsGeneratingPdf(false);
    }
  };

  const handleDownloadWord = async () => {
    setIsGeneratingWord(true);
    const reportElement = document.getElementById('report-content');
    if (!reportElement) {
        alert("Không tìm thấy nội dung báo cáo.");
        setIsGeneratingWord(false);
        return;
    }

    try {
        const wordStyles = `
            @page {
                size: 210mm 297mm; /* A4 */
                margin: 15mm;
            }
            body { font-family: "Times New Roman", Times, serif; font-size: 11pt; line-height: 1.15; }
            h1, h2, h3 { font-family: "Times New Roman", Times, serif; font-weight: bold; margin: 0; padding: 0; }
            h1 { font-size: 16pt; text-align: center; }
            h2 { font-size: 13pt; margin-top: 1.5em; margin-bottom: 0.5em; }
            h3 { font-size: 11pt; margin-top: 1em; margin-bottom: 0.25em; }
            table { width: 100%; border-collapse: collapse; border: 1px solid black; font-size: 10pt; }
            th, td { border: 1px solid black; padding: 5px; text-align: left; vertical-align: top; page-break-inside: avoid; }
            th { font-weight: bold; background-color: #E7E6E6; text-align: center; }
            tr { page-break-inside: avoid; }
            ul { margin-top: 0; padding-left: 25px; }
            li { margin-bottom: 4px; }
            .computer-stats-box { background-color: #F3F4F6; padding: 12px; border: 1px solid #E5E7EB; line-height: 1.5; margin-bottom: 1em; }
            .computer-stats-box p { margin: 0; }
            img { max-width: 100%; height: auto; }
        `;
        
        const clonedReport = reportElement.cloneNode(true) as HTMLElement;

        // 1. Transform Header (Flex -> Table)
        const headerEl = clonedReport.querySelector('header');
        if (headerEl) {
            const logoHTML = `
                <table style="width: 120px; height: 40px; border: 1px solid black; font-family: sans-serif;">
                    <tr>
                        <td style="width: 6px; padding: 0; border: none; background-color: black;">
                            <div style="width: 6px; height: 38px; background-color: black; margin-left: 4px;"></div>
                        </td>
                        <td style="border: none; text-align: center; vertical-align: middle; padding: 0 8px;">
                            <div style="font-weight: bold; font-size: 14pt; color: #007A33; line-height: 1;">IIG</div>
                            <div style="font-weight: 600; font-size: 8pt; letter-spacing: 0.1em;">VIET NAM</div>
                        </td>
                    </tr>
                </table>`;
            const titleEl = headerEl.querySelector('div.text-center');
            headerEl.style.borderBottom = '2px solid black';
            headerEl.style.paddingBottom = '1rem';
            headerEl.innerHTML = `
              <table style="width:100%; border:none;">
                <tr>
                  <td style="width:130px; border:none; vertical-align:top;">${logoHTML}</td>
                  <td style="border:none; vertical-align:top; text-align:center;">${titleEl ? titleEl.innerHTML : ''}</td>
                </tr>
              </table>`;
        }

        // 2. Add class to stats box
        const statsBox = clonedReport.querySelector('.bg-gray-50.p-4.rounded-lg');
        if (statsBox) {
            statsBox.className = 'computer-stats-box';
        }

        // 3. Transform Image Gallery (Grid -> Table)
        const imagesSection = Array.from(clonedReport.querySelectorAll('h2')).find(h2 => h2.textContent?.includes('III. HÌNH ẢNH'))?.parentElement;
        if (imagesSection) {
            const gridDiv = imagesSection.querySelector('.grid');
            if (gridDiv) {
                const imageContainers = Array.from(gridDiv.children);
                let tableHTML = '<table style="width: 100%; border: none;"><tbody>';
                for (let i = 0; i < imageContainers.length; i += 2) {
                    tableHTML += '<tr>';
                    const cell1 = imageContainers[i];
                    const cell2 = imageContainers[i + 1];
                    const processCell = (cell: Element) => `<td style="width: 50%; border: none; padding: 4px;">${cell ? cell.innerHTML : ''}</td>`;
                    tableHTML += processCell(cell1);
                    tableHTML += processCell(cell2);
                    tableHTML += '</tr>';
                }
                tableHTML += '</tbody></table>';
                gridDiv.outerHTML = tableHTML;
            }
        }
        
        // 4. Transform Footer (Flex -> Table)
        // Fix: Corrected variable declaration. 'footerEl' was used in its own declaration.
        const footerEl = clonedReport.querySelector('footer');
        if(footerEl) {
            const signatureDivs = footerEl.querySelectorAll('div > div');
             if (signatureDivs.length === 2) {
                footerEl.style.pageBreakBefore = 'always';
                footerEl.innerHTML = `
                <table style="width: 100%; border: none; text-align: center;">
                    <tr>
                        <td style="border: none; width: 50%;">${signatureDivs[0].innerHTML}</td>
                        <td style="border: none; width: 50%;">${signatureDivs[1].innerHTML}</td>
                    </tr>
                </table>`;
            }
        }


        const header = `
            <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
            <head><meta charset='utf-8'><title>Báo Cáo Khảo Sát Phòng Máy</title><style>${wordStyles}</style></head>
            <body>`;
        const footer = "</body></html>";
        const sourceHTML = header + clonedReport.innerHTML + footer;
        
        const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
        const fileDownload = document.createElement("a");
        document.body.appendChild(fileDownload);
        fileDownload.href = source;
        const schoolName = generalInfo.schoolName.replace(/ /g, '_') || 'report';
        fileDownload.download = `BaoCao_${schoolName}.doc`;
        fileDownload.click();
        document.body.removeChild(fileDownload);
    } catch (error) {
        console.error("Error generating Word doc:", error);
        alert("Đã xảy ra lỗi khi tạo tài liệu Word.");
    } finally {
        setTimeout(() => setIsGeneratingWord(false), 500);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length + 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleExport = () => {
    const stateToSave: AppState = { currentStep, generalInfo, configurations, recommendations, images, pdfOptions };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(stateToSave, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    const schoolName = generalInfo.schoolName.replace(/ /g, '_') || 'report';
    downloadAnchorNode.setAttribute("download", `BaoCao_${schoolName}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const text = e.target?.result;
            if (typeof text !== 'string') throw new Error("File is not readable");
            const importedState: AppState = JSON.parse(text);

            if (importedState.generalInfo && importedState.configurations && importedState.recommendations && importedState.images && importedState.currentStep) {
                if (window.confirm("Tải lên tệp này sẽ ghi đè lên tiến trình hiện tại của bạn. Bạn có muốn tiếp tục không?")) {
                    setGeneralInfo(importedState.generalInfo);
                    setConfigurations(importedState.configurations);
                    setRecommendations(importedState.recommendations);
                    setImages(importedState.images);
                    setCurrentStep(importedState.currentStep);
                    setPdfOptions(importedState.pdfOptions || { includePageNumbers: true, customFooterText: '' });
                }
            } else {
                alert("Định dạng tệp không hợp lệ.");
            }
        } catch (error) {
            console.error("Error parsing imported file:", error);
            alert("Đã xảy ra lỗi khi đọc hoặc phân tích cú pháp tệp.");
        } finally {
            // Reset file input to allow importing the same file again
            if (importInputRef.current) {
                importInputRef.current.value = "";
            }
        }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm("Bạn có chắc chắn muốn bắt đầu một báo cáo mới không? Tất cả dữ liệu chưa được xuất sẽ bị mất.")) {
        localStorage.removeItem(STORAGE_KEY);
        window.location.reload();
    }
  };


  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1GeneralInfo info={generalInfo} onUpdate={handleGeneralInfoChange} schools={schools} />;
      case 2:
        return <Step2Configuration 
                configurations={configurations}
                computerStats={computerStats}
                onDelete={handleDeleteConfiguration}
                onAddNote={handleAddNoteToConfiguration}
                onRemoveNote={handleRemoveNoteFromConfiguration}
                onUpdate={handleUpdateConfiguration}
                onDuplicate={handleDuplicateConfiguration}
                onAddBlank={handleAddBlankConfiguration}
               />;
      case 3:
        return <Step3Images images={images} onImageUpload={handleImageUpload} />;
      case 4:
        return <Step4Recommendations 
                recommendations={recommendations}
                groupedRecommendations={groupedRecommendations}
                newRecText={newRecText}
                newRecCategory={newRecCategory}
                onNewRecTextChange={setNewRecText}
                onNewRecCategoryChange={setNewRecCategory}
                onAddRecommendation={handleAddRecommendation}
                onRemoveRecommendation={handleRemoveRecommendation}
                />;
      case 5:
        return <Step5Review 
                generalInfo={generalInfo}
                configurations={configurations}
                images={images}
                recommendations={recommendations}
                computerStats={computerStats}
                groupedRecommendations={groupedRecommendations}
                schools={schools}
                pdfOptions={pdfOptions}
                onPdfOptionsChange={handlePdfOptionsChange}
                isGeneratingPdf={isGeneratingPdf}
                isGeneratingWord={isGeneratingWord}
                handleDownloadPdf={handleDownloadPdf}
                handleDownloadWord={handleDownloadWord}
                handlePrint={handlePrint}
                />;
      default:
        return null;
    }
  };


  return (
    <div className="bg-gray-100 min-h-screen font-sans text-gray-800 print:bg-white">
        {(isGeneratingPdf || isGeneratingWord) && (
          <div role="status" aria-live="polite" className="fixed inset-0 bg-black bg-opacity-60 z-50 flex flex-col items-center justify-center print:hidden">
            <div className="bg-white p-8 rounded-lg shadow-xl text-center flex flex-col items-center">
              <svg className="animate-spin h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <h2 className="mt-5 text-xl font-bold text-gray-800">Đang tạo tệp...</h2>
              <p className="mt-2 text-sm text-gray-600">Quá trình này có thể mất một vài giây, vui lòng không đóng trang.</p>
            </div>
          </div>
        )}

      <main className="max-w-4xl mx-auto my-8">
        <div className="bg-white shadow-lg rounded-lg p-4 mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
            <div className="text-sm text-gray-600 font-medium">
                <p>Quản lý báo cáo:</p>
                <p className="text-xs text-gray-500">Tiến trình của bạn được tự động lưu vào trình duyệt.</p>
            </div>
            <div className="flex items-center gap-2">
                 <button 
                    onClick={handleExport}
                    className="px-3 py-2 text-sm font-semibold text-blue-700 bg-blue-100 border border-blue-200 rounded-lg hover:bg-blue-200 inline-flex items-center gap-2 transition-colors"
                    title="Xuất báo cáo hiện tại ra file JSON"
                 >
                    <Download size={16} /> Xuất file
                </button>
                 <button 
                    onClick={() => importInputRef.current?.click()}
                    className="px-3 py-2 text-sm font-semibold text-green-700 bg-green-100 border border-green-200 rounded-lg hover:bg-green-200 inline-flex items-center gap-2 transition-colors"
                    title="Nhập báo cáo từ file JSON"
                >
                    <Upload size={16} /> Nhập file
                </button>
                <input type="file" ref={importInputRef} onChange={handleImport} className="hidden" accept=".json" />
                 <button 
                    onClick={handleReset}
                    className="px-3 py-2 text-sm font-semibold text-red-700 bg-red-100 border border-red-200 rounded-lg hover:bg-red-200 inline-flex items-center gap-2 transition-colors"
                    title="Xóa dữ liệu hiện tại và bắt đầu lại"
                 >
                    <RotateCw size={16} /> Bắt đầu lại
                </button>
            </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 lg:p-8">
            <header className="mb-6 pb-4">
                <h1 className="text-2xl font-bold text-gray-900 text-center">Báo Cáo Khảo Sát Phòng Máy</h1>
                {currentStep <= STEPS.length && <Stepper steps={STEPS} currentStep={currentStep} />}
            </header>

            <div className="min-h-[400px]">
                {renderStepContent()}
            </div>
            
            {currentStep <= STEPS.length && (
                 <StepNavigation 
                    currentStep={currentStep}
                    totalSteps={STEPS.length}
                    onNext={nextStep}
                    onPrev={prevStep}
                 />
            )}
            {currentStep === STEPS.length + 1 && (
                <div className="mt-8 pt-6 border-t flex justify-start">
                     <button
                        onClick={prevStep}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg inline-flex items-center transition duration-300 print:hidden"
                    >
                        Chỉnh sửa
                    </button>
                </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default App;