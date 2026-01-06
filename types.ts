
export enum AppSection {
  OPERATIONS = 'OPERATIONS', // 作业感知
  TOOLS = 'TOOLS',           // 专业工具
  MANAGEMENT = 'MANAGEMENT', // 合规管理
  CARE = 'CARE'              // 心灵港湾
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  maxStock: number;
  category: string;
}

export interface ShipCertificate {
  id: string;
  name: string;
  expiryDate: string; // ISO string
}

export interface AISettings {
  baseUrl: string;
  modelName: string;
  provider: 'XiaomiMimo' | 'DeepSeek' | 'Gemini';
}
