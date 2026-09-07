import { apiClient } from './client';
import { mockData } from './mockData';
import type { Project, ProjectListItem, ProjectFilters, PaginatedResponse } from '@/types/project';

export const projectsApi = {
  list: async (filters: ProjectFilters): Promise<PaginatedResponse<ProjectListItem>> => {
    try {
      const { data } = await apiClient.get('/projects', { params: filters });
      return data;
    } catch {
      // Fallback to mock data when backend is unavailable
      return mockData.getProjectsList(filters);
    }
  },

  getById: async (id: string): Promise<Project> => {
    try {
      const { data } = await apiClient.get(`/projects/${id}`);
      return data;
    } catch {
      return mockData.getProject(id);
    }
  },

  getByState: async (): Promise<{ state: string; count: number; avgDelay: number }[]> => {
    try {
      const { data } = await apiClient.get('/projects/by-state');
      return data;
    } catch {
      return mockData.getProjectsByState();
    }
  },
};
