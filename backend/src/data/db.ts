export interface ProjectListItem {
  id: string;
  name: string;
  sector: string;
  state: string;
  status: 'on_track' | 'at_risk' | 'delayed' | 'completed' | 'not_started';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  physicalProgress: number;
  delayDays: number;
  predictedDelay: number;
}

export interface Project extends ProjectListItem {
  district: string;
  sanctionedCost: number;
  expenditure: number;
  financialProgress: number;
  startDate: string;
  expectedCompletion: string;
  revisedCompletion?: string;
  contractor?: string;
  implementingAgency: string;
}

export interface DelayFactor {
  name: string;
  displayName: string;
  importance: number;
  value: number | string;
  direction: 'increases_delay' | 'decreases_delay';
}

export interface DelayPrediction {
  projectId: string;
  predictedDelayDays: number;
  confidence: number;
  riskScore: number;
  predictionDate: string;
  modelVersion: string;
  factors: DelayFactor[];
}

export interface PredictionTrend {
  date: string;
  predictedDelay: number;
  actualDelay: number | null;
  confidence: number;
}

export interface Alert {
  id: string;
  projectId: string;
  projectName: string;
  sector: string;
  severity: 'info' | 'warning' | 'critical';
  category: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  metadata?: Record<string, any>;
}

export interface SectorSummary {
  id: string;
  name: string;
  projectCount: number;
  totalBudget: number;
  avgProgress: number;
  atRiskCount: number;
  avgDelay: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ProjectFilters {
  page?: number;
  pageSize?: number;
  sector?: string;
  state?: string;
  status?: string;
  riskLevel?: string;
  search?: string;
}

const SECTORS = ['Roads & Highways', 'Railways', 'Power & Energy', 'Water Resources', 'Urban Development', 'Telecommunications'];
const STATES = ['Maharashtra', 'Uttar Pradesh', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Rajasthan', 'West Bengal', 'Madhya Pradesh', 'Kerala', 'Delhi'];
const STATUSES: Array<'on_track' | 'at_risk' | 'delayed' | 'completed' | 'not_started'> = ['on_track', 'at_risk', 'delayed', 'completed', 'not_started'];
const RISK_LEVELS: Array<'low' | 'medium' | 'high' | 'critical'> = ['low', 'medium', 'high', 'critical'];

function randomInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randomFloat(min: number, max: number, dec = 2) { return +(Math.random() * (max - min) + min).toFixed(dec); }
function randomItem<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

const PROJECT_NAMES = [
  'NH-48 Six-Lane Expansion', 'Mumbai Metro Line 4', 'Jaipur Ring Road Phase II',
  'Bangalore Suburban Rail', 'Chennai Desalination Plant', 'Ganga Expressway',
  'Delhi-Meerut RRTS', 'Polavaram Dam', 'Navi Mumbai Airport', 'Udhampur-Srinagar Rail',
  'Eastern Dedicated Freight Corridor', 'Pune Metro Phase I', 'AIIMS Madurai',
  'Amaravati Capital City', 'Zojila Tunnel', 'Char Dham Highway',
  'Ahmedabad Metro Phase II', 'Paradip Refinery Expansion', 'Kochi Water Metro',
  'Hyderabad Pharma City', 'Dwarka Expressway', 'Jewar Airport Phase I',
  'Western Dedicated Freight Corridor', 'Smart City Varanasi', 'Lucknow Metro Extension',
  'MTHL Sea Bridge', 'Sagarmala Port Modernization', 'Solar Park Rajasthan Phase III',
  'Brahmaputra Cracker Project', 'Vizag-Chennai Industrial Corridor',
];

const AGENCIES = ['NHAI', 'NHPC', 'IRCON', 'RITES', 'NTPC', 'PGCIL', 'DMRC', 'MMRDA', 'BMRCL', 'AAI'];

function makeFactor(name: string, display: string): DelayFactor {
  const dir = Math.random() > 0.4 ? 'increases_delay' : 'decreases_delay';
  return { name, displayName: display, importance: randomFloat(0.02, 0.25, 3), value: randomInt(10, 95), direction: dir as 'increases_delay' | 'decreases_delay' };
}

const FACTOR_POOL: [string, string][] = [
  ['land_acquisition', 'Land Acquisition Delay'], ['env_clearance', 'Environmental Clearance'],
  ['funding_gap', 'Funding Gap %'], ['contractor_capacity', 'Contractor Capacity Score'],
  ['monsoon_impact', 'Monsoon Impact'], ['labour_shortage', 'Labour Shortage Index'],
  ['material_inflation', 'Material Cost Inflation'], ['design_change', 'Design Change Count'],
  ['litigation', 'Active Litigations'], ['utility_shifting', 'Utility Shifting Progress'],
  ['govt_approval', 'Pending Govt Approvals'], ['terrain_difficulty', 'Terrain Difficulty'],
];

function makeFactors(): DelayFactor[] {
  const count = randomInt(5, 10);
  const shuffled = [...FACTOR_POOL].sort(() => Math.random() - 0.5).slice(0, count);
  return shuffled.map(([n, d]) => makeFactor(n, d));
}

export const _projects: ProjectListItem[] = PROJECT_NAMES.map((name, i) => {
  const status = randomItem(STATUSES);
  const riskLevel = randomItem(RISK_LEVELS);
  return {
    id: `proj-${String(i + 1).padStart(3, '0')}`,
    name,
    sector: randomItem(SECTORS),
    state: randomItem(STATES),
    status,
    riskLevel,
    physicalProgress: randomInt(5, 98),
    delayDays: status === 'on_track' ? 0 : randomInt(30, 900),
    predictedDelay: randomInt(0, 600),
  };
});

function makeFullProject(item: ProjectListItem): Project {
  const start = new Date(2019 + randomInt(0, 4), randomInt(0, 11), randomInt(1, 28));
  const expectedEnd = new Date(start.getTime() + randomInt(365, 1825) * 86400000);
  return {
    id: item.id,
    name: item.name,
    sector: item.sector,
    state: item.state,
    district: 'District ' + randomInt(1, 20),
    sanctionedCost: randomInt(500, 50000) * 100000,
    expenditure: randomInt(100, 30000) * 100000,
    physicalProgress: item.physicalProgress,
    financialProgress: randomInt(10, 95),
    startDate: start.toISOString().split('T')[0],
    expectedCompletion: expectedEnd.toISOString().split('T')[0],
    revisedCompletion: item.delayDays > 0 ? new Date(expectedEnd.getTime() + item.delayDays * 86400000).toISOString().split('T')[0] : undefined,
    status: item.status,
    riskLevel: item.riskLevel,
    delayDays: item.delayDays,
    predictedDelay: item.predictedDelay,
    contractor: randomItem(['L&T', 'Tata Projects', 'Dilip Buildcon', 'Afcons', 'JMC Projects', 'NCC Ltd']),
    implementingAgency: randomItem(AGENCIES),
  };
}

export const mockAlerts: Alert[] = [
  { id: 'a1', projectId: 'proj-001', projectName: PROJECT_NAMES[0], sector: SECTORS[0], severity: 'critical', category: 'delay_risk', title: 'Severe delay risk detected', message: 'Predicted delay exceeds 18 months. Land acquisition stalled.', createdAt: new Date(Date.now() - 3600000).toISOString(), isRead: false, metadata: {} },
  { id: 'a2', projectId: 'proj-003', projectName: PROJECT_NAMES[2], sector: SECTORS[0], severity: 'warning', category: 'cost_overrun', title: 'Cost overrun warning', message: 'Expenditure at 85% with only 52% physical progress.', createdAt: new Date(Date.now() - 7200000).toISOString(), isRead: false, metadata: {} },
  { id: 'a3', projectId: 'proj-005', projectName: PROJECT_NAMES[4], sector: SECTORS[3], severity: 'critical', category: 'stalled', title: 'Project stalled', message: 'No progress reported in last 90 days.', createdAt: new Date(Date.now() - 86400000).toISOString(), isRead: false, metadata: {} },
  { id: 'a4', projectId: 'proj-007', projectName: PROJECT_NAMES[6], sector: SECTORS[1], severity: 'warning', category: 'milestone_missed', title: 'Milestone missed', message: 'Tunnel boring completion delayed by 4 months.', createdAt: new Date(Date.now() - 172800000).toISOString(), isRead: true, metadata: {} },
  { id: 'a5', projectId: 'proj-009', projectName: PROJECT_NAMES[8], sector: SECTORS[4], severity: 'info', category: 'anomaly', title: 'Progress anomaly', message: 'Physical progress jumped 12% in single month — verify data.', createdAt: new Date(Date.now() - 259200000).toISOString(), isRead: true, metadata: {} },
  { id: 'a6', projectId: 'proj-002', projectName: PROJECT_NAMES[1], sector: SECTORS[1], severity: 'warning', category: 'delay_risk', title: 'Moderate delay risk', message: 'Environmental clearance pending for 6 months.', createdAt: new Date(Date.now() - 345600000).toISOString(), isRead: false, metadata: {} },
  { id: 'a7', projectId: 'proj-010', projectName: PROJECT_NAMES[9], sector: SECTORS[1], severity: 'critical', category: 'delay_risk', title: 'Extreme terrain challenges', message: 'Geological survey reveals unstable terrain in 3 sections.', createdAt: new Date(Date.now() - 432000000).toISOString(), isRead: true, metadata: {} },
  { id: 'a8', projectId: 'proj-004', projectName: PROJECT_NAMES[3], sector: SECTORS[1], severity: 'info', category: 'anomaly', title: 'Funding released', message: 'New tranche of Rs 2,400 Cr released by Finance Ministry.', createdAt: new Date(Date.now() - 518400000).toISOString(), isRead: true, metadata: {} },
];

export const db = {
  getProjectsList(filters: ProjectFilters): PaginatedResponse<ProjectListItem> {
    let items = [..._projects];
    if (filters.sector) items = items.filter(p => p.sector === filters.sector);
    if (filters.state) items = items.filter(p => p.state === filters.state);
    if (filters.status) items = items.filter(p => p.status === filters.status);
    if (filters.riskLevel) items = items.filter(p => p.riskLevel === filters.riskLevel);
    if (filters.search) {
      const s = filters.search.toLowerCase();
      items = items.filter(p => p.name.toLowerCase().includes(s) || p.sector.toLowerCase().includes(s));
    }
    const total = items.length;
    const page = filters.page ? parseInt(filters.page.toString(), 10) : 0;
    const pageSize = filters.pageSize ? parseInt(filters.pageSize.toString(), 10) : 10;
    const start = page * pageSize;
    return { items: items.slice(start, start + pageSize), total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },

  getProject(id: string): Project | null {
    const item = _projects.find(p => p.id === id);
    if (!item) return null;
    return makeFullProject(item);
  },

  getProjectsByState(): { state: string; count: number; avgDelay: number }[] {
    const map = new Map<string, { count: number; totalDelay: number }>();
    _projects.forEach(p => {
      const cur = map.get(p.state) ?? { count: 0, totalDelay: 0 };
      cur.count++;
      cur.totalDelay += p.delayDays;
      map.set(p.state, cur);
    });
    return Array.from(map.entries()).map(([state, v]) => ({ state, count: v.count, avgDelay: Math.round(v.totalDelay / v.count) }));
  },

  getPrediction(projectId: string): DelayPrediction {
    const item = _projects.find(p => p.id === projectId) ?? _projects[0];
    return {
      projectId: item.id,
      predictedDelayDays: item.predictedDelay,
      confidence: randomFloat(0.7, 0.95),
      riskScore: randomFloat(0.1, 0.9),
      predictionDate: new Date().toISOString(),
      modelVersion: '2.3.1',
      factors: makeFactors(),
    };
  },

  getPredictionTrend(_projectId: string): PredictionTrend[] {
    const base = randomInt(100, 400);
    return Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (11 - i));
      return {
        date: date.toISOString().split('T')[0],
        predictedDelay: base + randomInt(-50, 50),
        actualDelay: i < 9 ? base + randomInt(-30, 80) : null,
        confidence: randomFloat(0.65, 0.95),
      };
    });
  },

  getPortfolioSummary() {
    const atRisk = _projects.filter(p => p.status === 'at_risk' || p.status === 'delayed').length;
    const avgDelay = Math.round(_projects.reduce((s, p) => s + p.predictedDelay, 0) / _projects.length);
    const buckets = ['0-30', '31-90', '91-180', '181-365', '365+'];
    const distribution = buckets.map(bucket => ({ bucket, count: randomInt(2, 12) }));
    const sectorBreakdown = SECTORS.map(sector => {
      const sp = _projects.filter(p => p.sector === sector);
      return { sector, avgDelay: sp.length ? Math.round(sp.reduce((s, p) => s + p.predictedDelay, 0) / sp.length) : 0, projectCount: sp.length };
    }).filter(s => s.projectCount > 0);
    return { totalProjects: _projects.length, atRiskCount: atRisk, avgPredictedDelay: avgDelay, delayDistribution: distribution, sectorBreakdown };
  },

  getSectors(): SectorSummary[] {
    return SECTORS.map((name, i) => {
      const sp = _projects.filter(p => p.sector === name);
      return {
        id: `sec-${i + 1}`,
        name,
        projectCount: sp.length,
        totalBudget: randomInt(5000, 80000) * 100000,
        avgProgress: sp.length ? Math.round(sp.reduce((s, p) => s + p.physicalProgress, 0) / sp.length) : 0,
        atRiskCount: sp.filter(p => p.status === 'at_risk' || p.status === 'delayed').length,
        avgDelay: sp.length ? Math.round(sp.reduce((s, p) => s + p.delayDays, 0) / sp.length) : 0,
      };
    });
  },

  getAlerts(filters: { severity?: string; isRead?: boolean; page?: number; pageSize?: number }) {
    let items = [...mockAlerts];
    if (filters.severity) items = items.filter(a => a.severity === filters.severity);
    if (filters.isRead !== undefined) items = items.filter(a => a.isRead === filters.isRead);
    const page = filters.page ? parseInt(filters.page.toString(), 10) : 0;
    const pageSize = filters.pageSize ? parseInt(filters.pageSize.toString(), 10) : 10;
    const start = page * pageSize;
    return { items: items.slice(start, start + pageSize), total: items.length };
  },

  getUnreadAlertCount(): number {
    return mockAlerts.filter(a => !a.isRead).length;
  },

  markAlertAsRead(id: string) {
    const alert = mockAlerts.find(a => a.id === id);
    if (alert) alert.isRead = true;
  },

  markAllAlertsAsRead() {
    mockAlerts.forEach(a => { a.isRead = true; });
  }
};
