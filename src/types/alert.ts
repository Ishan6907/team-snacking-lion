export type AlertSeverity = 'info' | 'warning' | 'critical';
export type AlertCategory = 'delay_risk' | 'cost_overrun' | 'stalled' | 'milestone_missed' | 'anomaly';

export interface Alert {
  id: string;
  projectId: string;
  projectName: string;
  sector: string;
  severity: AlertSeverity;
  category: AlertCategory;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  metadata?: Record<string, unknown>;
}

export interface AlertFilters {
  severity?: AlertSeverity;
  category?: AlertCategory;
  isRead?: boolean;
  page: number;
  pageSize: number;
}
