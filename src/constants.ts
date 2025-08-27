import { Recommendation, RecommendationCategory, ComputerConfiguration } from './types';

// This function unrolls the configurations from a count-based format to a single-row-per-machine format.
const generateInitialConfigurations = (): ComputerConfiguration[] => {
    const configs: ComputerConfiguration[] = [];
    let idCounter = Date.now();

    const baseConfig = { cpu: "G3240", ram: "4GB", storage: "SSD 120GB", os: "Win10", monitor: "19inch", office: "Office19" };

    // 17 working machines
    for (let i = 0; i < 17; i++) {
        configs.push({
            id: idCounter++,
            ...baseConfig,
            notes: [],
        });
    }

    // 1 faulty machine
    configs.push({
        id: idCounter++,
        ...baseConfig,
        notes: ["Lỗi màn hình"],
    });

    return configs;
};

export const INITIAL_CONFIGURATIONS: ComputerConfiguration[] = generateInitialConfigurations();


export const INITIAL_RECOMMENDATIONS: Recommendation[] = [
  { id: 1, category: RecommendationCategory.MAINTENANCE, text: 'Vệ sinh, bảo trì định kỳ toàn bộ hệ thống máy tính.' },
  { id: 2, category: RecommendationCategory.UPGRADE, text: 'Nâng cấp RAM cho các máy cấu hình thấp để đáp ứng yêu cầu phần mềm giảng dạy.' },
];

export const RECOMMENDATION_CATEGORIES = [
    { value: RecommendationCategory.MAINTENANCE, label: 'Bảo trì, sửa chữa' },
    { value: RecommendationCategory.REPLACEMENT, label: 'Thay thế' },
    { value: RecommendationCategory.UPGRADE, label: 'Nâng cấp' },
    { value: RecommendationCategory.NEW_PURCHASE, label: 'Đầu tư mới' },
];