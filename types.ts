export interface GeneralInfo {
  schoolName: string;
  schoolAddress: string;
  contactPerson: string;
  contactPhone: string;
  labCount: string;
  bandwidth: string;
  roomLength: string;
  roomWidth: string;
  cableDistance: string;
  roomNotes: string;
}

export interface ComputerConfiguration {
  id: number;
  cpu: string;
  ram: string;
  storage: string;
  os: string;
  monitor: string;
  office: string;
  notes: string[];
}

export enum RecommendationCategory {
  MAINTENANCE = 'MAINTENANCE',
  REPLACEMENT = 'REPLACEMENT',
  UPGRADE = 'UPGRADE',
  NEW_PURCHASE = 'NEW_PURCHASE',
}

export interface Recommendation {
  id: number;
  category: RecommendationCategory;
  text: string;
}

export interface School {
  id: string;
  name: string;
  address: string;
  contactPerson: string;
  contactPhone: string;
}
