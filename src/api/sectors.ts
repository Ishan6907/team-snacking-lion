import { apiClient } from './client';
import { mockData } from './mockData';

export interface SectorSummary {
  id: string;
  name: string;
  projectCount: number;
  totalBudget: number;
  avgProgress: number;
  atRiskCount: number;
  avgDelay: number;
}

export const sectorsApi = {
  list: async (): Promise<SectorSummary[]> => {
    try {
      const { data } = await apiClient.get('/sectors');
      return data;
    } catch {
      return mockData.getSectors();
    }
  },

  getById: async (sectorId: string): Promise<SectorSummary> => {
    try {
      const { data } = await apiClient.get(`/sectors/${sectorId}`);
      return data;
    } catch {
      const sectors = mockData.getSectors();
      return sectors.find(s => s.id === sectorId) ?? sectors[0];
    }
  },
};
