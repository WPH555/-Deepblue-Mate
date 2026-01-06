
import { InventoryItem, ShipCertificate } from '../types';

const KEYS = {
  INVENTORY: 'db_inventory',
  CERTIFICATES: 'db_certificates',
  REST_HOURS: 'db_rest_hours'
};

export const roomDb = {
  // Inventory
  getInventory: (): InventoryItem[] => {
    const data = localStorage.getItem(KEYS.INVENTORY);
    if (!data) {
      const initial = [
        { id: '1', name: '主机喷油器', stock: 4, maxStock: 6, category: 'Mechanical' },
        { id: '2', name: '液压油 (桶)', stock: 2, maxStock: 10, category: 'Consumables' },
        { id: '3', name: '电焊条 (盒)', stock: 15, maxStock: 20, category: 'Consumables' },
      ];
      localStorage.setItem(KEYS.INVENTORY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  },
  saveInventory: (items: InventoryItem[]) => {
    localStorage.setItem(KEYS.INVENTORY, JSON.stringify(items));
  },
  addInventoryItem: (name: string, stock: number, maxStock: number) => {
    const items = roomDb.getInventory();
    const newItem: InventoryItem = {
      id: Date.now().toString(),
      name,
      stock,
      maxStock,
      category: 'General'
    };
    roomDb.saveInventory([...items, newItem]);
    return newItem;
  },

  // Certificates
  getCertificates: (): ShipCertificate[] => {
    const data = localStorage.getItem(KEYS.CERTIFICATES);
    if (!data) {
      const now = new Date();
      const initial = [
        { id: '1', name: '安全管理证书 (SMC)', expiryDate: new Date(now.getFullYear(), now.getMonth() + 5, 1).toISOString() },
        { id: '2', name: '防油污染证书 (IOPP)', expiryDate: new Date(now.getFullYear(), now.getMonth() + 1, 15).toISOString() },
        { id: '3', name: '载重线证书', expiryDate: new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString() },
      ];
      localStorage.setItem(KEYS.CERTIFICATES, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  },
  saveCertificates: (certs: ShipCertificate[]) => {
    localStorage.setItem(KEYS.CERTIFICATES, JSON.stringify(certs));
  },
  addCertificate: (name: string, expiryDate: string) => {
    const certs = roomDb.getCertificates();
    const newCert: ShipCertificate = {
      id: Date.now().toString(),
      name,
      expiryDate
    };
    roomDb.saveCertificates([...certs, newCert]);
    return newCert;
  },

  // Rest Hours
  getRestHours: (): boolean[] => {
    const data = localStorage.getItem(KEYS.REST_HOURS);
    return data ? JSON.parse(data) : Array(24).fill(false);
  },
  saveRestHours: (hours: boolean[]) => {
    localStorage.setItem(KEYS.REST_HOURS, JSON.stringify(hours));
  }
};
