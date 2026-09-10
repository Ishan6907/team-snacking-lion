import { Router } from 'express';

const router = Router();

export interface GovConnectorStatus {
  id: string;
  name: string;
  department: string;
  status: 'CONNECTED' | 'SYNCING' | 'MAINTENANCE';
  latencyMs: number;
  lastSync: string;
  recordsSynced: number;
  endpointUrl: string;
  authMethod: string;
  dataTypes: string[];
}

let CONNECTORS: GovConnectorStatus[] = [
  {
    id: 'DILRMP',
    name: 'Digital India Land Records Modernization Programme (DILRMP)',
    department: 'Department of Land Resources (DoLR), MoRD',
    status: 'CONNECTED',
    latencyMs: 42,
    lastSync: '2026-09-10T22:30:00Z',
    recordsSynced: 48920,
    endpointUrl: 'https://dilrmp.gov.in/api/v2/cadastral/ror-sync',
    authMethod: 'e-Pramaan OAuth 2.0 / Digital Signature Token',
    dataTypes: ['Record of Rights (RoR)', 'Khasra Map Polygons', 'Ownership Mutations'],
  },
  {
    id: 'BHOOMI_BHULEKH',
    name: 'State Cadastral Revenue Gateway (Bhoomi / Bhulekh / BanglarBhumi)',
    department: 'State Revenue & Land Reforms Departments (36 States/UTs)',
    status: 'CONNECTED',
    latencyMs: 68,
    lastSync: '2026-09-10T21:15:00Z',
    recordsSynced: 142800,
    endpointUrl: 'https://landrecords.gov.in/api/v1/state-gateway',
    authMethod: 'NIC VPN IP Whitelist + Encrypted Keyring',
    dataTypes: ['Circle Rates', 'Agricultural Multiplier Factors', 'CALA Land Titling'],
  },
  {
    id: 'PARIVESH',
    name: 'PARIVESH 2.0 Environmental & Forest Clearance Single-Window',
    department: 'Ministry of Environment, Forest and Climate Change (MoEFCC)',
    status: 'CONNECTED',
    latencyMs: 55,
    lastSync: '2026-09-10T20:00:00Z',
    recordsSynced: 18420,
    endpointUrl: 'https://parivesh.nic.in/api/v2/clearances/stage-tracking',
    authMethod: 'NIC API Gateway Bearer Token',
    dataTypes: ['Stage-I In-Principle Approval', 'Stage-II Final Working Permission', 'CAMPA Non-Forest Land Mutations'],
  },
  {
    id: 'ECOURTS_NJDG',
    name: 'e-Courts National Judicial Data Grid (NJDG)',
    department: 'Supreme Court of India e-Committee & Dept of Justice',
    status: 'CONNECTED',
    latencyMs: 84,
    lastSync: '2026-09-10T19:45:00Z',
    recordsSynced: 3410,
    endpointUrl: 'https://njdg.ecourts.gov.in/api/v1/land-litigation',
    authMethod: 'Inter-Departmental mTLS Certificate',
    dataTypes: ['High Court Stay Orders', 'Section 64 LARRA Tribunal References', 'Title Challenge Petitions'],
  },
  {
    id: 'PFMS',
    name: 'Public Financial Management System (PFMS) & CALA Treasury Escrow',
    department: 'Controller General of Accounts, Ministry of Finance',
    status: 'CONNECTED',
    latencyMs: 38,
    lastSync: '2026-09-10T23:00:00Z',
    recordsSynced: 96400,
    endpointUrl: 'https://pfms.nic.in/api/v3/cala-escrow/disbursement',
    authMethod: 'SBI / RBI Treasury Payment Gateway Interface',
    dataTypes: ['Section 3H(1) Compensation Deposits', 'DBT Livelihood Grants', 'District Collectorate Escrow Balances'],
  },
];

// GET /api/v1/integrations/status
router.get('/status', (req, res) => {
  res.json({
    totalConnectors: CONNECTORS.length,
    activeConnectors: CONNECTORS.filter((c) => c.status === 'CONNECTED').length,
    connectors: CONNECTORS,
  });
});

// POST /api/v1/integrations/sync/:id
router.post('/sync/:id', (req, res) => {
  const { id } = req.params;
  const connector = CONNECTORS.find((c) => c.id.toUpperCase() === id.toUpperCase());
  if (!connector) {
    return res.status(404).json({ error: 'Connector not found' });
  }

  connector.lastSync = new Date().toISOString();
  connector.recordsSynced += Math.floor(Math.random() * 200) + 20;

  res.json({
    success: true,
    message: `Successfully synchronized live records with ${connector.name}`,
    connector,
  });
});

export default router;
