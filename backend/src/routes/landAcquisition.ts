import { Router } from 'express';
import { db } from '../data/db';
import { createHash, randomUUID } from 'crypto';

const router = Router();

// State Centroids for Portfolio GIS Mapping
const STATE_COORDINATES: Record<string, { lat: number; lon: number }> = {
  'Andhra Pradesh': { lat: 15.9129, lon: 79.74 },
  'Arunachal Pradesh': { lat: 28.218, lon: 94.7278 },
  'Assam': { lat: 26.2006, lon: 92.9376 },
  'Bihar': { lat: 25.0961, lon: 85.3131 },
  'Chhattisgarh': { lat: 21.2787, lon: 81.8661 },
  'Goa': { lat: 15.2993, lon: 74.124 },
  'Gujarat': { lat: 22.2587, lon: 71.1924 },
  'Haryana': { lat: 29.0588, lon: 76.0856 },
  'Himachal Pradesh': { lat: 31.1048, lon: 77.1734 },
  'Jharkhand': { lat: 23.6102, lon: 85.2799 },
  'Karnataka': { lat: 15.3173, lon: 75.7139 },
  'Kerala': { lat: 10.8505, lon: 76.2711 },
  'Madhya Pradesh': { lat: 22.9734, lon: 78.6569 },
  'Maharashtra': { lat: 19.7515, lon: 75.7139 },
  'Manipur': { lat: 24.6637, lon: 93.9063 },
  'Meghalaya': { lat: 25.467, lon: 91.3662 },
  'Mizoram': { lat: 23.1645, lon: 92.9376 },
  'Nagaland': { lat: 26.1584, lon: 94.5624 },
  'Odisha': { lat: 20.9517, lon: 85.0985 },
  'Punjab': { lat: 31.1471, lon: 75.3412 },
  'Rajasthan': { lat: 27.0238, lon: 74.2179 },
  'Sikkim': { lat: 27.533, lon: 88.5122 },
  'Tamil Nadu': { lat: 11.1271, lon: 78.6569 },
  'Telangana': { lat: 18.1124, lon: 79.0193 },
  'Tripura': { lat: 23.9408, lon: 91.9882 },
  'Uttar Pradesh': { lat: 26.8467, lon: 80.9462 },
  'Uttarakhand': { lat: 30.0668, lon: 79.0193 },
  'West Bengal': { lat: 22.9868, lon: 87.855 },
  'Delhi': { lat: 28.7041, lon: 77.1025 },
  'Jammu & Kashmir': { lat: 33.7782, lon: 76.5762 },
  'Ladakh': { lat: 34.1526, lon: 77.5771 },
  'Puducherry': { lat: 11.9416, lon: 79.8083 },
  'Chandigarh': { lat: 30.7333, lon: 76.7794 },
};

export interface LandAcquisitionProject {
  id: string;
  name: string;
  sector: string;
  state: string;
  district: string;
  sanctionedCostCr: number;
  landOutlayCr: number;
  compensationDisbursedCr: number;
  escrowBalanceCr: number;
  disbursedPct: number;
  predictedDelayDays: number;
  riskLevel: string;
  primaryBottleneck: string;
  rfctlarrStage: string;
  stageIndex: number; // 0 to 5
  affectedFamilies: number;
  familiesRelocated: number;
  relocationPct: number;
  legalDisputesCount: number;
  daysInCurrentStage: number;
  statutoryLapseRemainingDays: number;
  isLapseWarning: boolean;
  lat: number;
  lon: number;
}

const STAGES = [
  'Section 4 (SIA Notification)',
  'Section 11 (Preliminary Notification)',
  'Section 15 (Hearing of Objections)',
  'Section 19 (Declaration of Acquisition)',
  'Section 23 (Award by Collector)',
  'Section 24 (Physical Possession)'
];

import fs from 'fs';
import path from 'path';

// Generate deterministic land acquisition models for all projects
function getLandProjects(): LandAcquisitionProject[] {
  let rawItems: any[] = [];
  const possiblePaths = [
    path.resolve(__dirname, '../../../ml/raw_1428_projects.json'),
    path.resolve(process.cwd(), 'ml/raw_1428_projects.json'),
    path.resolve(process.cwd(), '../ml/raw_1428_projects.json'),
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      try {
        const raw = JSON.parse(fs.readFileSync(p, 'utf8'));
        if (Array.isArray(raw) && raw.length > 0) {
          // Sample 250 diverse packages across states
          rawItems = raw.slice(0, 250);
          break;
        }
      } catch {}
    }
  }

  if (rawItems.length === 0) {
    const projectsRes = db.getProjectsList({ pageSize: 10000 });
    rawItems = projectsRes.items;
  }

  return rawItems.map((p, idx) => {
    const hash = p.id.split('').reduce((acc: number, c: string) => ((acc << 5) - acc + c.charCodeAt(0)) | 0, 0);
    const posHash = Math.abs(hash);

    // Land Outlay is typically 25% - 40% of civil capex
    const cost = p.originalCostCr || 1500;
    const landOutlayCr = Math.round(cost * (0.24 + (posHash % 16) / 100));

    // Stage based on delay and risk
    let stageIndex = (posHash % 6);
    if (p.predictedDelay > 200) stageIndex = (posHash % 3); // Stalled in early stages
    else if (p.predictedDelay < 40) stageIndex = 4 + (posHash % 2); // Near completion

    const stage = STAGES[stageIndex];

    // Compensation disbursed correlates with stage
    const baseDisbursedPct = 0.15 + (stageIndex / 5) * 0.75;
    const disbursedPct = Math.min(100, Math.round((baseDisbursedPct + ((posHash % 15) - 7) / 100) * 100));
    const compensationDisbursedCr = Math.round((landOutlayCr * disbursedPct) / 100);
    const escrowBalanceCr = Math.max(0, landOutlayCr - compensationDisbursedCr);

    // Affected families (PAFs)
    const affectedFamilies = 80 + (posHash % 1200);
    const relocationPct = stageIndex >= 4 ? Math.min(100, 60 + (posHash % 40)) : Math.round((stageIndex / 4) * 50);
    const familiesRelocated = Math.round((affectedFamilies * relocationPct) / 100);

    // Legal disputes
    const legalDisputesCount = p.riskLevel === 'critical' ? 3 + (posHash % 8) : (posHash % 3);

    // Days in current stage and statutory lapse (Section 19 within 365d of Sec 11; Sec 23 within 365d of Sec 19)
    const daysInCurrentStage = 30 + (posHash % 320);
    const statutoryLapseRemainingDays = Math.max(0, 365 - daysInCurrentStage);
    const isLapseWarning = (stageIndex === 1 || stageIndex === 3) && statutoryLapseRemainingDays < 90;

    // Geocoordinates
    const baseCoord = STATE_COORDINATES[p.state] || { lat: 21.0 + (posHash % 8), lon: 78.0 + (posHash % 8) };
    const jitterLat = ((posHash % 200) - 100) / 120.0;
    const jitterLon = (((posHash >> 2) % 200) - 100) / 120.0;

    return {
      id: p.id,
      name: p.name,
      sector: p.sector,
      state: p.state,
      district: (p as any).district || `District-${(posHash % 15) + 1}`,
      sanctionedCostCr: cost,
      landOutlayCr,
      compensationDisbursedCr,
      escrowBalanceCr,
      disbursedPct,
      predictedDelayDays: p.predictedDelay,
      riskLevel: p.riskLevel,
      primaryBottleneck: p.primaryBottleneck || 'Section 3G CALA Compensation Reconciliation',
      rfctlarrStage: stage,
      stageIndex,
      affectedFamilies,
      familiesRelocated,
      relocationPct,
      legalDisputesCount,
      daysInCurrentStage,
      statutoryLapseRemainingDays,
      isLapseWarning,
      lat: +(baseCoord.lat + jitterLat).toFixed(4),
      lon: +(baseCoord.lon + jitterLon).toFixed(4)
    };
  });
}

// In-Memory Immutable Audit Trail Ledger
interface AuditEvent {
  id: string;
  timestamp: string;
  projectId: string;
  projectName: string;
  eventType: 'GAZETTE_PUBLISHED' | 'AWARD_DECLARED' | 'COMPENSATION_ESCROW' | 'STAY_VACATED' | 'R_AND_R_ALLOTMENT';
  authority: string;
  description: string;
  sha256Hash: string;
  actionBy: string;
}

const AUDIT_TRAIL: AuditEvent[] = [
  {
    id: 'ADT-901',
    timestamp: '2026-09-10T14:32:00Z',
    projectId: 'NHAI-DEL-MUM-P4',
    projectName: 'Delhi-Mumbai Expressway (Vadodara-Kim Pkg 4)',
    eventType: 'GAZETTE_PUBLISHED',
    authority: 'CALA / District Collector Vadodara',
    description: 'Statutory Gazette Notification under RFCTLARR Section 19 issued for 142.4 Hectares.',
    sha256Hash: createHash('sha256').update('NHAI-DEL-MUM-P4-SEC19-2026').digest('hex'),
    actionBy: 'Revenue Officer (Vadodara)'
  },
  {
    id: 'ADT-902',
    timestamp: '2026-09-08T11:15:00Z',
    projectId: 'MAHSR-BUL-MUM-AHM',
    projectName: 'Mumbai-Ahmedabad High-Speed Rail Corridor',
    eventType: 'COMPENSATION_ESCROW',
    authority: 'Competent Authority Land Acquisition Thane',
    description: 'Transferred ₹340.50 Cr into District Escrow under RFCTLARR Section 3H(1) for Thane Creek shaft parcels.',
    sha256Hash: createHash('sha256').update('MAHSR-BUL-MUM-ESCROW-2026').digest('hex'),
    actionBy: 'Collectorate Treasury'
  },
  {
    id: 'ADT-903',
    timestamp: '2026-09-05T09:40:00Z',
    projectId: 'SJVN-LUH-HYD',
    projectName: 'Luhri Hydro Electric Project (210 MW)',
    eventType: 'R_AND_R_ALLOTMENT',
    authority: 'Himachal Pradesh Revenue Dept',
    description: 'Disbursed DBT livelihood restoration grants to 482 Project Affected Families under RFCTLARR Schedule II.',
    sha256Hash: createHash('sha256').update('SJVN-LUH-RR-2026').digest('hex'),
    actionBy: 'SDM Nirath'
  },
  {
    id: 'ADT-904',
    timestamp: '2026-09-01T16:20:00Z',
    projectId: 'DFCCIL-EDFC-DAN',
    projectName: 'Eastern DFC Sonnagar-Dankuni Section',
    eventType: 'STAY_VACATED',
    authority: 'Calcutta High Court / NHAI Legal Cell',
    description: 'High Court vacated interim stay on Asansol railway coal belt parcels following 75% escrow deposit.',
    sha256Hash: createHash('sha256').update('EDFC-DAN-HC-VACATE-2026').digest('hex'),
    actionBy: 'Standing Counsel'
  },
  {
    id: 'ADT-905',
    timestamp: '2026-08-28T10:05:00Z',
    projectId: 'NWDA-KEN-BET',
    projectName: 'Ken-Betwa River Interlinking Link Canal',
    eventType: 'AWARD_DECLARED',
    authority: 'District Collector Chhatarpur',
    description: 'Section 23 Collector Award passed for Daudhan Dam submergence zone covering 2,140 acres.',
    sha256Hash: createHash('sha256').update('KEN-BET-AWARD-2026').digest('hex'),
    actionBy: 'CALA Chhatarpur'
  }
];

// GET /api/v1/land-acquisition/kpis
router.get('/kpis', (req, res) => {
  const projects = getLandProjects();
  const totalOutlay = projects.reduce((sum, p) => sum + p.landOutlayCr, 0);
  const totalDisbursed = projects.reduce((sum, p) => sum + p.compensationDisbursedCr, 0);
  const totalEscrow = projects.reduce((sum, p) => sum + p.escrowBalanceCr, 0);
  const totalPAFs = projects.reduce((sum, p) => sum + p.affectedFamilies, 0);
  const totalRelocated = projects.reduce((sum, p) => sum + p.familiesRelocated, 0);
  const stalledCorridors = projects.filter(p => p.predictedDelayDays > 120).length;
  const section25LapseRisks = projects.filter(p => p.isLapseWarning).length;

  const stageCounts = STAGES.map((stg, i) => ({
    stage: stg,
    count: projects.filter(p => p.stageIndex === i).length
  }));

  res.json({
    totalProjects: projects.length,
    totalOutlayCr: totalOutlay,
    totalDisbursedCr: totalDisbursed,
    disbursedPct: +((totalDisbursed / (totalOutlay || 1)) * 100).toFixed(1),
    totalEscrowBalanceCr: totalEscrow,
    totalAffectedFamilies: totalPAFs,
    totalRelocatedFamilies: totalRelocated,
    relocationPct: +((totalRelocated / (totalPAFs || 1)) * 100).toFixed(1),
    stalledCorridorsCount: stalledCorridors,
    section25LapseRisksCount: section25LapseRisks,
    stageDistribution: stageCounts
  });
});

// GET /api/v1/land-acquisition/projects
router.get('/projects', (req, res) => {
  const projects = getLandProjects();
  const stage = req.query.stage as string;
  const risk = req.query.risk as string;
  const state = req.query.state as string;

  let filtered = projects;
  if (stage !== undefined && stage !== '') {
    const sIdx = parseInt(stage, 10);
    filtered = filtered.filter(p => p.stageIndex === sIdx);
  }
  if (risk) {
    filtered = filtered.filter(p => p.riskLevel === risk);
  }
  if (state) {
    filtered = filtered.filter(p => p.state.toLowerCase() === state.toLowerCase());
  }

  res.json({
    total: filtered.length,
    items: filtered
  });
});

// GET /api/v1/land-acquisition/audit-trail
router.get('/audit-trail', (req, res) => {
  res.json({
    count: AUDIT_TRAIL.length,
    events: AUDIT_TRAIL
  });
});

// POST /api/v1/land-acquisition/audit-trail
router.post('/audit-trail', (req, res) => {
  const { projectId, projectName, eventType, authority, description, actionBy } = req.body;
  const newEvent: AuditEvent = {
    id: `ADT-${Date.now().toString(36).toUpperCase()}`,
    timestamp: new Date().toISOString(),
    projectId: projectId || 'PROJ-CUSTOM',
    projectName: projectName || 'Corridor Parcel',
    eventType: eventType || 'GAZETTE_PUBLISHED',
    authority: authority || 'District Administration',
    description: description || 'Administrative land acquisition action logged.',
    sha256Hash: createHash('sha256').update(`${projectId}-${eventType}-${Date.now()}`).digest('hex'),
    actionBy: actionBy || 'Authorized Officer'
  };
  AUDIT_TRAIL.unshift(newEvent);
  res.status(201).json({ success: true, event: newEvent });
});

export default router;
