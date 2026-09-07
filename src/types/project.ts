export type ProjectStatus = 'on_track' | 'at_risk' | 'delayed' | 'completed' | 'not_started';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface Project {
  id: string;
  name: string;
  sector: string;
  state: string;
  district: string;
  sanctionedCost: number;
  expenditure: number;
  physicalProgress: number;
  financialProgress: number;
  startDate: string;
  expectedCompletion: string;
  revisedCompletion?: string;
  status: ProjectStatus;
  riskLevel: RiskLevel;
  delayDays: number;
  contractor?: string;
  implementingAgency: string;
}

export interface ProjectListItem {
  id: string;
  name: string;
  sector: string;
  state: string;
  status: ProjectStatus;
  riskLevel: RiskLevel;
  physicalProgress: number;
  delayDays: number;
  predictedDelay: number;
}

export interface ProjectFilters {
  sector?: string;
  state?: string;
  status?: ProjectStatus;
  riskLevel?: RiskLevel;
  search?: string;
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
