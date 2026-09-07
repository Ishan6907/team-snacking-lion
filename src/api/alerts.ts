import { apiClient } from './client';
import { mockData } from './mockData';
import type { Alert, AlertFilters } from '@/types/alert';

export interface AlertsListResponse {
  items: Alert[];
  total: number;
}

export const alertsApi = {
  list: async (filters: AlertFilters): Promise<AlertsListResponse> => {
    try {
      const { data } = await apiClient.get<AlertsListResponse>('/alerts', { params: filters });
      return data;
    } catch {
      const mock = mockData.getAlerts();
      let items = mock.items;
      if (filters.severity) items = items.filter(a => a.severity === filters.severity);
      if (filters.isRead !== undefined) items = items.filter(a => a.isRead === filters.isRead);
      const start = filters.page * filters.pageSize;
      return { items: items.slice(start, start + filters.pageSize), total: items.length };
    }
  },

  getUnreadCount: async (): Promise<number> => {
    try {
      const { data } = await apiClient.get<{ count: number }>('/alerts/unread-count');
      return data.count;
    } catch {
      return mockData.getUnreadAlertCount();
    }
  },

  markAsRead: async (alertId: string): Promise<void> => {
    try {
      await apiClient.patch(`/alerts/${alertId}/read`);
    } catch {
      // Silently succeed in demo mode
      console.log(`[Demo] Marked alert ${alertId} as read`);
    }
  },

  markAllAsRead: async (): Promise<void> => {
    try {
      await apiClient.patch('/alerts/read-all');
    } catch {
      console.log('[Demo] Marked all alerts as read');
    }
  },
};
