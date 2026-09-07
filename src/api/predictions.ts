import { apiClient } from './client';
import { mockData } from './mockData';
import type { DelayPrediction, PredictionTrend } from '@/types/prediction';

export const predictionsApi = {
  getForProject: async (projectId: string): Promise<DelayPrediction> => {
    try {
      const { data } = await apiClient.get(`/predictions/${projectId}`);
      return data;
    } catch {
      return mockData.getPrediction(projectId);
    }
  },

  getTrend: async (projectId: string): Promise<PredictionTrend[]> => {
    try {
      const { data } = await apiClient.get(`/predictions/${projectId}/trend`);
      return data;
    } catch {
      return mockData.getPredictionTrend(projectId);
    }
  },

  getPortfolioSummary: async (): Promise<{
    totalProjects: number;
    atRiskCount: number;
    avgPredictedDelay: number;
    delayDistribution: { bucket: string; count: number }[];
    sectorBreakdown: { sector: string; avgDelay: number; projectCount: number }[];
  }> => {
    try {
      const { data } = await apiClient.get('/predictions/portfolio-summary');
      return data;
    } catch {
      return mockData.getPortfolioSummary();
    }
  },
};
