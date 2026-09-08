export type ProjectStatus = 'on_track' | 'at_risk' | 'delayed' | 'completed' | 'not_started';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface ProjectCriticalIssue {
  code: string;
  title: string;
  authority: string;
  severity: 'critical' | 'high' | 'medium';
  status: 'pending_cabinet' | 'under_litigation' | 'inter_ministerial' | 'resolved';
  escalationDate: string;
}

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
  predictedDelay?: number;
  contractor?: string;
  implementingAgency: string;
  // Authentic MoSPI & Enterprise Fields:
  mospiCode?: string;
  originalCostCr?: number;
  revisedCostCr?: number;
  costOverrunCr?: number;
  primaryBottleneck?: string;
  clearanceMilestone?: string;
  cabinetNoteRef?: string;
  criticalIssues?: ProjectCriticalIssue[];
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
  // Authentic MoSPI & Enterprise Fields:
  mospiCode?: string;
  originalCostCr?: number;
  revisedCostCr?: number;
  costOverrunCr?: number;
  primaryBottleneck?: string;
  contractor?: string;
  implementingAgency?: string;
  clearanceMilestone?: string;
  cabinetNoteRef?: string;
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
