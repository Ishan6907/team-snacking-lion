import { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Stack,
  Chip,
  Button,
  TextField,
  InputAdornment,
  MenuItem,
  Pagination,
} from '@mui/material';
import {
  Park,
  Search,
  OpenInNew,
  Public,
  Send,
  CheckCircle,
  HourglassEmpty,
  Verified,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import CabinetEscalationDialog from '@/components/common/CabinetEscalationDialog';
import { ALL_1428_PROJECTS, ALL_INDIAN_STATES_AND_UTS, ProjectRow } from '@/data/inventoryData';

interface ForestBlockerItem {
  project: ProjectRow;
  forestDivision: string;
  divertedHectares: number;
  pccfNodal: string;
  caLandStatus: string;
  recMeetingStatus: string;
  npvAmountCr: number;
  stage: 'Stage 1' | 'Stage 2' | 'Stage 3' | 'Stage 4' | 'Stage 5';
  stageTitle: string;
}

const STATE_FOREST_DIVISIONS: Record<string, string[]> = {
  'Andhra Pradesh': ['Eastern Ghats Forest Circle, Rajahmundry', 'Seshachalam Biosphere Division, Tirupati', 'Nallamala Forest Division, Kurnool'],
  'Arunachal Pradesh': ['Namdapha Buffer Forest Division, Changlang', 'Bhalukpong Circle, West Kameng', 'Deomali Forest Division, Tirap'],
  'Assam': ['Deepor Beel Eco-Sensitive Range, Guwahati', 'Kaziranga Southern Buffer Division', 'Manas Biosphere Reserve Circle'],
  'Bihar': ['Valmiki Tiger Reserve Division, West Champaran', 'Kaimur Wildlife Sanctuary Range', 'Rajgir Forest Division'],
  'Chhattisgarh': ['Udanti Sitanadi Tiger Reserve Division', 'Bastar Forest Circle, Jagdalpur', 'Achanakmar Tiger Corridor Division'],
  'Goa': ['Pernem Forest Division, North Goa', 'Bhagwan Mahaveer Sanctuary Range, Mollem', 'Madei Wildlife Sanctuary Division'],
  'Gujarat': ['Gir Protected Forest Division, Junagadh', 'Kutch Desert Wetland Division, Bhuj', 'Shoolpaneshwar Wildlife Sanctuary Range'],
  'Haryana': ['Shivalik Hills Forest Circle, Panchkula', 'Aravalli Forest Division, Gurugram', 'Sultanpur Wetland Buffer Range'],
  'Himachal Pradesh': ['Shimla Forest Circle', 'Kinnaur Mountain Range Division', 'Great Himalayan National Park Buffer Circle'],
  'Jharkhand': ['Khunti Forest Division, Ranchi Circle', 'Dalma Wildlife Sanctuary Range, Jamshedpur', 'Saranda Forest Division, Chaibasa'],
  'Karnataka': ['Bandipur Tiger Reserve Buffer Division', 'Kudremukh Wildlife Division, Chikmagalur', 'Western Ghats Forest Circle, Shimoga'],
  'Kerala': ['Wayanad Wildlife Division, Sultan Bathery', 'Agasthyamalai Biosphere Division', 'Periyar Tiger Reserve Buffer Circle'],
  'Madhya Pradesh': ['Panna Tiger Reserve Division', 'Satpura Forest Corridor Circle, Hoshangabad', 'Kanha-Pench Corridor Range'],
  'Maharashtra': ['Tadoba-Andhari Tiger Buffer Division', 'Koyna Wildlife Division, Satara', 'Melghat Tiger Reserve Division, Amravati'],
  'Manipur': ['Loktak Lake Eco-Sensitive Range', 'Keibul Lamjao National Park Division'],
  'Meghalaya': ['Khasi Hills Forest Division, Shillong', 'Nokrek Biosphere Reserve Circle'],
  'Mizoram': ['Dampa Tiger Reserve Division', 'Murlen National Park Range'],
  'Nagaland': ['Intanki National Park Buffer Circle', 'Kohima Forest Division'],
  'Odisha': ['Dasapalla Forest Elephant Corridor Division', 'Similipal Biosphere Division, Mayurbhanj', 'Satkosia Gorge Wildlife Sanctuary Range'],
  'Punjab': ['Shivalik Foothills Forest Range, Ropar', 'Harike Wetland Bird Sanctuary Division'],
  'Rajasthan': ['Thar Desert Wildlife Division, Jaisalmer', 'Ranthambore Tiger Buffer Circle, Sawai Madhopur', 'Sariska Forest Division, Alwar'],
  'Sikkim': ['Khangchendzonga Biosphere Division, Gangtok', 'Singba Rhododendron Sanctuary Range'],
  'Tamil Nadu': ['Mudumalai Tiger Reserve Division, Nilgiris', 'Anamalai Tiger Reserve Circle, Pollachi', 'Gulf of Mannar Marine National Park'],
  'Telangana': ['Kawal Tiger Reserve Division, Mancherial', 'Amrabad Tiger Reserve Buffer Circle'],
  'Tripura': ['Clouded Leopard National Park Division', 'Sepahijala Wildlife Sanctuary Range'],
  'Uttar Pradesh': ['Hastinapur Wildlife Sanctuary Range, Meerut', 'Dudhwa Tiger Buffer Division, Lakhimpur', 'Katarniaghat Wildlife Division, Bahraich'],
  'Uttarakhand': ['Rajaji Tiger Reserve Circle, Haridwar', 'Corbett Landscape Buffer Division, Ramnagar', 'Kedarnath Forest Division, Gopeshwar'],
  'West Bengal': ['Sunderbans Mangrove Buffer Division, Canning', 'Buxa Tiger Reserve Division, Alipurduar', 'Gorumara National Park Circle, Jalpaiguri'],
  'Andaman & Nicobar': ['Great Nicobar Biosphere Reserve', 'South Andaman Forest Circle, Port Blair', 'Middle Andaman Forest Division, Rangat'],
  'Chandigarh': ['Sukhna Wildlife Sanctuary Range'],
  'Dadra & Nagar Haveli': ['Silvassa Forest Division', 'Madhuban Reservoir Forest Range'],
  'Delhi': ['Central Ridge Forest Management Division', 'Southern Ridge Forest Circle, Asola'],
  'Jammu & Kashmir': ['Dachigam National Park Buffer Division', 'Gulmarg Wildlife Sanctuary Circle'],
  'Ladakh': ['Hemis High Altitude National Park Division', 'Changthang Cold Desert Sanctuary'],
  'Lakshadweep': ['Agatti Atoll Marine Ecosystem Division', 'Kavaratti Marine Protected Zone'],
  'Puducherry': ['Ousteri Wetland Bird Sanctuary Division'],
};

const PCCF_OFFICERS = [
  'Shri V.K. Sinha, IFS (PCCF HoFF)',
  'Dr. R.K. Upadhyay, IFS (PCCF Wildlife)',
  'Smt. Anita Sharma, IFS (Chief Wildlife Warden)',
  'Shri P.K. Mishra, IFS (Addl PCCF Forest Diversion)',
  'Dr. Sanjeev Kumar, IFS (Nodal Officer MoEFCC Cell)',
  'Shri R.K. Dogra, IFS (Regional Controller of Forests)',
  'Dr. Meenakshi Sundaram, IFS (APCCF Conservation)',
];

export const isMoEFCCForestProject = (p: ProjectRow): boolean => {
  const b = (p.criticalBlocker || '').toLowerCase();
  const name = (p.name || '').toLowerCase();
  return (
    b.includes('forest') ||
    b.includes('moefcc') ||
    b.includes('stage-ii') ||
    b.includes('stage ii') ||
    b.includes('tree') ||
    b.includes('wildlife') ||
    b.includes('nbwl') ||
    b.includes('afforestation') ||
    b.includes('eco-sensitive') ||
    b.includes('tiger reserve') ||
    b.includes('elephant corridor') ||
    b.includes('crz') ||
    b.includes('wetland') ||
    b.includes('environmental') ||
    b.includes('cpcb') ||
    b.includes('coral reef') ||
    b.includes('tribal reserve') ||
    b.includes('floodway') ||
    b.includes('ridge management') ||
    b.includes('bird diverter') ||
    b.includes('coastal') ||
    name.includes('forest') ||
    name.includes('wildlife')
  );
};

export default function ForestClearancePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('all');
  const [stageFilter, setStageFilter] = useState<'all' | 'Stage 1' | 'Stage 2' | 'Stage 3' | 'Stage 4' | 'Stage 5'>('all');
  const [escalationOpen, setEscalationOpen] = useState(false);
  const [activeProjectForEscalation, setActiveProjectForEscalation] = useState<ProjectRow>(ALL_1428_PROJECTS[0]);

  // Pagination state
  const [page, setPage] = useState(1);
  const pageSize = 15;

  // Extract all highway & infrastructure packages facing Forest / MoEFCC Stage-II clearances
  const forestProjects: ForestBlockerItem[] = useMemo(() => {
    const matching = ALL_1428_PROJECTS.filter(isMoEFCCForestProject);

    return matching.map((p, idx) => {
      let hash = 0;
      for (let i = 0; i < p.id.length; i++) {
        hash = (hash * 31 + p.id.charCodeAt(i)) | 0;
      }
      hash = Math.abs(hash);

      const divs = STATE_FOREST_DIVISIONS[p.state] || [
        `${p.state} Territorial Forest Division`,
        `${p.state} Wildlife & Eco-Sensitive Circle`,
      ];
      const forestDivision = divs[idx % divs.length];
      const divertedHectares = Math.round((18.4 + ((hash % 450) / 10)) * 10) / 10;
      const pccfNodal = PCCF_OFFICERS[idx % PCCF_OFFICERS.length];
      const caLandStatus =
        idx % 3 === 0
          ? 'Equal Value Non-Forest Land Identified & Transferred'
          : idx % 3 === 1
          ? 'Revenue Land Mutation Pending with District Collector'
          : 'Double Degraded Forest Land Surveyed for CAMPA Plantation';
      const recMeetingStatus =
        idx % 3 === 0
          ? 'Pending Regional Empowered Committee (REC) Scrutiny'
          : idx % 3 === 1
          ? 'Site Inspection Report Submitted to MoEFCC IRO'
          : 'NBWL Standing Committee Agenda Item Scheduled';
      const npvAmountCr = Math.round((divertedHectares * 0.92 + ((hash % 80) / 10)) * 10) / 10;

      const stageDefs: Array<{ stage: 'Stage 1' | 'Stage 2' | 'Stage 3' | 'Stage 4' | 'Stage 5'; stageTitle: string }> = [
        { stage: 'Stage 1', stageTitle: 'In-Principle Clearance' },
        { stage: 'Stage 2', stageTitle: 'PCCF Tree Enumeration' },
        { stage: 'Stage 3', stageTitle: 'REC Regional Scrutiny' },
        { stage: 'Stage 4', stageTitle: 'Stage-II Final Nod' },
        { stage: 'Stage 5', stageTitle: 'Tree-Felling Transit Pass' },
      ];
      const stageDef = stageDefs[hash % 5];

      return {
        project: p,
        forestDivision,
        divertedHectares,
        pccfNodal,
        caLandStatus,
        recMeetingStatus,
        npvAmountCr,
        stage: stageDef.stage,
        stageTitle: stageDef.stageTitle,
      };
    });
  }, []);

  // Live counts per state across all 36 Indian states & UTs
  const stateCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    ALL_INDIAN_STATES_AND_UTS.forEach((st) => {
      counts[st] = 0;
    });
    forestProjects.forEach((item) => {
      counts[item.project.state] = (counts[item.project.state] || 0) + 1;
    });
    return counts;
  }, [forestProjects]);

  // Live counts per Stage funnel
  const stageCounts = useMemo(() => {
    const counts: Record<string, number> = {
      'Stage 1': 0,
      'Stage 2': 0,
      'Stage 3': 0,
      'Stage 4': 0,
      'Stage 5': 0,
    };
    const base = stateFilter === 'all' ? forestProjects : forestProjects.filter((p) => p.project.state === stateFilter);
    base.forEach((p) => {
      counts[p.stage] = (counts[p.stage] || 0) + 1;
    });
    return counts;
  }, [forestProjects, stateFilter]);

  const filteredItems = useMemo(() => {
    return forestProjects.filter((item) => {
      if (stateFilter !== 'all' && item.project.state !== stateFilter) return false;
      if (stageFilter !== 'all' && item.stage !== stageFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          item.project.name.toLowerCase().includes(q) ||
          item.project.id.toLowerCase().includes(q) ||
          item.forestDivision.toLowerCase().includes(q) ||
          item.project.state.toLowerCase().includes(q) ||
          item.project.criticalBlocker.toLowerCase().includes(q) ||
          item.project.contractor.toLowerCase().includes(q) ||
          item.pccfNodal.toLowerCase().includes(q) ||
          item.stage.toLowerCase().includes(q) ||
          item.stageTitle.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [forestProjects, stateFilter, stageFilter, searchQuery]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [stateFilter, stageFilter, searchQuery]);

  const totalPages = Math.ceil(filteredItems.length / pageSize) || 1;
  const pagedItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, page, pageSize]);

  const totalHectares = useMemo(() => {
    return filteredItems.reduce((sum, item) => sum + item.divertedHectares, 0).toFixed(1);
  }, [filteredItems]);

  const avgSlip = useMemo(() => {
    return filteredItems.length
      ? Math.round(filteredItems.reduce((sum, item) => sum + item.project.predictedDelayDays, 0) / filteredItems.length)
      : 0;
  }, [filteredItems]);

  const totalNpvCr = useMemo(() => {
    return filteredItems.reduce((sum, item) => sum + item.npvAmountCr, 0).toFixed(1);
  }, [filteredItems]);

  const handleOpenEscalation = (p: ProjectRow) => {
    setActiveProjectForEscalation(p);
    setEscalationOpen(true);
  };

  return (
    <Box sx={{ color: '#0f172a', pb: 4 }}>
      {/* Sovereign Header Monitor Banner */}
      <Box sx={{ mb: 2.5 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={1.5}>
          <Box>
            <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 0.4, flexWrap: 'wrap', gap: 0.5 }}>
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: 1,
                  bgcolor: '#fef2f2',
                  border: '1px solid #fecaca',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#b91c1c',
                }}
              >
                <Park fontSize="small" />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 900, color: '#0f172a', letterSpacing: -0.5 }}>
                MoEFCC &amp; Forest Stage-II Statutory Command
              </Typography>
              <Chip
                label="● LIVE PARIVESH 2.0 PORTAL SYNC"
                size="small"
                sx={{
                  bgcolor: '#dcfce7',
                  color: '#15803d',
                  fontWeight: 800,
                  fontSize: '0.65rem',
                  letterSpacing: 0.5,
                  borderRadius: '3px',
                  height: 20,
                }}
              />
              <Chip
                label={`ALL 36 STATES & UTs MONITORED (${forestProjects.length} PACKAGES)`}
                size="small"
                sx={{
                  bgcolor: '#eff6ff',
                  color: '#0284c7',
                  fontWeight: 800,
                  fontSize: '0.65rem',
                  letterSpacing: 0.5,
                  borderRadius: '3px',
                  height: 20,
                  border: '1px solid #bfdbfe',
                }}
              />
            </Stack>
            <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 500 }}>
              National Forest Land Diversion, Compensatory Afforestation (CAMPA) &amp; Tree-Felling Statutory Tracking
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Button
              size="small"
              variant="outlined"
              startIcon={<Public fontSize="small" />}
              onClick={() => navigate('/verification')}
              sx={{ borderColor: '#cbd5e1', color: '#334155', bgcolor: '#ffffff', fontSize: '0.72rem', fontWeight: 700, textTransform: 'none', py: 0.5 }}
            >
              3D Satellite Cadastral Recon
            </Button>
            <Button
              size="small"
              variant="contained"
              startIcon={<Send fontSize="small" />}
              onClick={() => handleOpenEscalation(filteredItems[0]?.project || forestProjects[0]?.project || ALL_1428_PROJECTS[0])}
              sx={{ bgcolor: '#be123c', color: '#ffffff', '&:hover': { bgcolor: '#9f1239' }, fontSize: '0.72rem', fontWeight: 800, textTransform: 'none', py: 0.6, px: 1.5 }}
            >
              Dispatch MoEFCC Escalation Note
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* Top 4 Sovereign KPI Ribbon */}
      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 1, border: '1px solid #fecdd3', bgcolor: '#fff1f2' }}>
            <Typography variant="caption" sx={{ color: '#9f1239', fontWeight: 800, fontSize: '0.66rem', letterSpacing: 0.5, textTransform: 'uppercase' }}>
              STALLED FOREST DIVERSIONS
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#be123c', fontFamily: 'monospace', my: 0.4 }}>
              {filteredItems.length} Packages
            </Typography>
            <Typography variant="caption" sx={{ color: '#9f1239', fontSize: '0.7rem', fontWeight: 600 }}>
              {filteredItems.length > 0 ? 'Critical Path Impeded' : 'All Clearances Secured'}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 1, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, fontSize: '0.66rem', letterSpacing: 0.5, textTransform: 'uppercase' }}>
              TOTAL DIVERTED FOREST AREA
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a', fontFamily: 'monospace', my: 0.4 }}>
              {totalHectares} Ha
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem' }}>
              Reserve &amp; Protected Forest Land
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 1, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, fontSize: '0.66rem', letterSpacing: 0.5, textTransform: 'uppercase' }}>
              AVG PROJECTED DELAY SLIP
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#d97706', fontFamily: 'monospace', my: 0.4 }}>
              +{avgSlip} Days
            </Typography>
            <Typography variant="caption" sx={{ color: '#d97706', fontSize: '0.7rem', fontWeight: 700 }}>
              Regional Empowered Comm. Bottleneck
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 1, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, fontSize: '0.66rem', letterSpacing: 0.5, textTransform: 'uppercase' }}>
              NET PRESENT VALUE (NPV) IN ESCROW
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#15803d', fontFamily: 'monospace', my: 0.4 }}>
              ₹{totalNpvCr} Cr
            </Typography>
            <Typography variant="caption" sx={{ color: '#15803d', fontSize: '0.7rem', fontWeight: 700 }}>
              CAMPA Ad-hoc Fund Ready for Release
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Statutory Clearance Pipeline Workflow Banner */}
      <Paper elevation={0} sx={{ p: 2, mb: 2.5, borderRadius: 1, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
          <Box>
            <Typography variant="caption" sx={{ color: '#475569', fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase', fontSize: '0.68rem', display: 'block' }}>
              PARIVESH 2.0 STATUTORY DIVERSION STAGE CLEARANCE FUNNEL
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem' }}>
              Click any stage card below to filter packages by bottleneck milestone
            </Typography>
          </Box>
          {stageFilter !== 'all' && (
            <Chip
              label={`Filtered by: ${stageFilter} (Click to Reset)`}
              size="small"
              onDelete={() => setStageFilter('all')}
              onClick={() => setStageFilter('all')}
              color="primary"
              sx={{ fontWeight: 800, fontSize: '0.68rem', height: 24, cursor: 'pointer' }}
            />
          )}
        </Stack>

        <Grid container spacing={1.5}>
          {[
            { step: 'Stage 1', title: 'In-Principle Clearance', desc: 'MoEFCC Section 2 Approval', color: '#15803d' },
            { step: 'Stage 2', title: 'PCCF Tree Enumeration', desc: 'Joint DFO Field Survey', color: '#0284c7' },
            { step: 'Stage 3', title: 'REC Regional Scrutiny', desc: 'Regional Empowered Comm.', color: '#d97706' },
            { step: 'Stage 4', title: 'Stage-II Final Nod', desc: 'MoEFCC New Delhi Sanction', color: '#be123c' },
            { step: 'Stage 5', title: 'Tree-Felling Transit Pass', desc: 'Divisional Forest Office (DFO)', color: '#7c3aed' },
          ].map((s) => {
            const isSelected = stageFilter === s.step;
            const count = stageCounts[s.step] || 0;
            return (
              <Grid item xs={12} sm={6} md={2.4} key={s.step}>
                <Box
                  role="button"
                  tabIndex={0}
                  onClick={() => setStageFilter((prev) => (prev === s.step ? 'all' : (s.step as any)))}
                  sx={{
                    p: 1.5,
                    borderRadius: 1,
                    bgcolor: isSelected ? '#f8fafc' : '#ffffff',
                    border: isSelected ? `2px solid ${s.color}` : '1px solid #e2e8f0',
                    boxShadow: isSelected ? `0 0 0 3px ${s.color}25` : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.18s ease-in-out',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    '&:hover': {
                      borderColor: s.color,
                      boxShadow: '0 4px 14px rgba(0,0,0,0.09)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <Box>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.6 }}>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: s.color, fontSize: '0.68rem', letterSpacing: 0.5 }}>
                        {s.step}
                      </Typography>
                      {isSelected ? (
                        <CheckCircle sx={{ fontSize: 16, color: s.color }} />
                      ) : (
                        <HourglassEmpty sx={{ fontSize: 14, color: '#94a3b8' }} />
                      )}
                    </Stack>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.78rem', lineHeight: 1.2 }}>
                      {s.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.65rem', display: 'block', mt: 0.3 }}>
                      {s.desc}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mt: 1.2 }}>
                    <Chip
                      label={`${count} Packages`}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.62rem',
                        fontWeight: 800,
                        bgcolor: isSelected ? s.color : `${s.color}15`,
                        color: isSelected ? '#ffffff' : s.color,
                      }}
                    />
                    <Typography variant="caption" sx={{ fontSize: '0.6rem', color: isSelected ? s.color : '#94a3b8', fontWeight: 700 }}>
                      {isSelected ? 'Active Filter' : 'Click to Filter'}
                    </Typography>
                  </Stack>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Paper>

      {/* Filter Strip */}
      <Paper elevation={0} sx={{ p: 1.5, mb: 2, borderRadius: 1, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
        <Grid container spacing={1.5} alignItems="center">
          <Grid item xs={12} md={7}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by package code, forest division, state, contractor, corridor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" sx={{ color: '#64748b' }} />
                  </InputAdornment>
                ),
                sx: { fontSize: '0.78rem', height: 36, bgcolor: '#f8fafc' },
              }}
            />
          </Grid>
          <Grid item xs={12} md={5}>
            <TextField
              select
              fullWidth
              size="small"
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              InputProps={{ sx: { fontSize: '0.78rem', height: 36, bgcolor: '#f8fafc' } }}
            >
              <MenuItem value="all" sx={{ fontSize: '0.75rem', fontWeight: 800 }}>
                State: All States &amp; UTs ({forestProjects.length} Packages)
              </MenuItem>
              {ALL_INDIAN_STATES_AND_UTS.map((st) => {
                const count = stateCounts[st] || 0;
                return (
                  <MenuItem
                    key={st}
                    value={st}
                    sx={{
                      fontSize: '0.75rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span>{st}</span>
                    <Chip
                      label={`${count}`}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        fontFamily: 'monospace',
                        bgcolor: count > 0 ? '#fef2f2' : '#f0fdf4',
                        color: count > 0 ? '#b91c1c' : '#15803d',
                        border: count > 0 ? '1px solid #fecaca' : '1px solid #bbf7d0',
                        ml: 1,
                      }}
                    />
                  </MenuItem>
                );
              })}
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* Main Table OR Zero-Data State Card */}
      {filteredItems.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 1,
            border: '1px solid #bbf7d0',
            bgcolor: '#f0fdf4',
            textAlign: 'center',
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              bgcolor: '#dcfce7',
              border: '2px solid #86efac',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#15803d',
              mb: 2,
            }}
          >
            <Verified sx={{ fontSize: 32 }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 900, color: '#14532d', mb: 1 }}>
            0 Pending MoEFCC Stage-II Clearances in {stateFilter !== 'all' ? stateFilter : 'Selected Filter'}
          </Typography>
          <Typography variant="body1" sx={{ color: '#166534', fontWeight: 700, maxWidth: 680, mx: 'auto', mb: 1, fontSize: '0.9rem' }}>
            100% Statutory Clearance Compliance Achieved
          </Typography>
          <Typography variant="body2" sx={{ color: '#4b5563', maxWidth: 640, mx: 'auto', mb: 3, fontSize: '0.8rem', lineHeight: 1.6 }}>
            {stateFilter !== 'all' ? (
              <>
                All linear infrastructure packages, national highways, and corridors in <strong>{stateFilter}</strong> have successfully secured full Stage-II forest diversion approvals, Wildlife Institute (WII) eco-duct clearance, and CAMPA compensatory afforestation handovers. No statutory environmental bottlenecks are currently impeding execution in this state.
              </>
            ) : (
              <>
                No forest diversion packages match the active search term <strong>&ldquo;{searchQuery}&rdquo;</strong>.
              </>
            )}
          </Typography>
          <Stack direction="row" spacing={1.5} justifyContent="center" flexWrap="wrap">
            <Button
              variant="contained"
              size="small"
              onClick={() => {
                setStateFilter('all');
                setSearchQuery('');
              }}
              sx={{ bgcolor: '#0f172a', color: '#ffffff', fontWeight: 800, textTransform: 'none', py: 0.8, px: 2 }}
            >
              View All 36 States ({forestProjects.length} Packages)
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Public fontSize="small" />}
              onClick={() => navigate('/verification')}
              sx={{ borderColor: '#86efac', color: '#15803d', bgcolor: '#ffffff', fontWeight: 800, textTransform: 'none', py: 0.8, px: 2 }}
            >
              Launch 3D Satellite Cadastral Recon
            </Button>
          </Stack>
        </Paper>
      ) : (
        <Paper elevation={0} sx={{ borderRadius: 1, border: '1px solid #e2e8f0', bgcolor: '#ffffff', overflow: 'hidden' }}>
          <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.76rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
                  <th style={{ padding: '10px 12px', fontWeight: 800 }}>PACKAGE IDENTIFICATION</th>
                  <th style={{ padding: '10px 12px', fontWeight: 800 }}>FOREST DIVISION &amp; JURISDICTION</th>
                  <th style={{ padding: '10px 12px', fontWeight: 800 }}>DIVERTED EXTENT</th>
                  <th style={{ padding: '10px 12px', fontWeight: 800 }}>NODAL PCCF &amp; CAMPA STATUS</th>
                  <th style={{ padding: '10px 12px', fontWeight: 800 }}>DELAY IMPACT</th>
                  <th style={{ padding: '10px 12px', fontWeight: 800, textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {pagedItems.map(({ project: p, forestDivision, divertedHectares, pccfNodal, caLandStatus, npvAmountCr, stage, stageTitle }) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }} onClick={() => navigate(`/milestones?id=${encodeURIComponent(p.id)}`)}>
                    <td style={{ padding: '12px 12px' }}>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: '#0284c7', fontFamily: 'monospace', fontSize: '0.74rem', display: 'block' }}>
                        {p.id}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.82rem', lineHeight: 1.2 }}>
                        {p.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem' }}>
                        Agency: <strong>{p.agency}</strong> &bull; Sector: <strong>{p.sector}</strong>
                      </Typography>
                    </td>

                    <td style={{ padding: '12px 12px' }}>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: '#be123c', fontSize: '0.8rem' }}>
                        {forestDivision}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem', display: 'block' }}>
                        {p.state} &bull; {p.chainage}
                      </Typography>
                    </td>

                    <td style={{ padding: '12px 12px' }}>
                      <Typography variant="body2" sx={{ fontWeight: 900, color: '#0f172a', fontFamily: 'monospace', fontSize: '0.82rem' }}>
                        {divertedHectares} Ha
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#15803d', fontWeight: 700, fontSize: '0.68rem', display: 'block' }}>
                        NPV: ₹{npvAmountCr} Cr
                      </Typography>
                    </td>

                    <td style={{ padding: '12px 12px' }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#334155', fontSize: '0.76rem' }}>
                        {pccfNodal}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem', display: 'block' }}>
                        {caLandStatus}
                      </Typography>
                    </td>

                    <td style={{ padding: '12px 12px' }}>
                      <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mb: 0.4 }}>
                        <Chip
                          label={`+${p.predictedDelayDays}d Delay`}
                          size="small"
                          sx={{ height: 20, fontSize: '0.65rem', fontWeight: 800, bgcolor: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' }}
                        />
                        <Chip
                          label={stage}
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setStageFilter(stage);
                          }}
                          sx={{
                            height: 20,
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            bgcolor: '#eff6ff',
                            color: '#0284c7',
                            border: '1px solid #bfdbfe',
                            cursor: 'pointer',
                          }}
                        />
                      </Stack>
                      <Typography variant="caption" sx={{ color: '#9f1239', fontWeight: 700, fontSize: '0.66rem', display: 'block' }}>
                        {stageTitle}
                      </Typography>
                    </td>

                    <td style={{ padding: '12px 12px', textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleOpenEscalation(p)}
                          sx={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'none', color: '#be123c', borderColor: '#fecdd3', py: 0.3 }}
                        >
                          Cabinet Notice
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          endIcon={<OpenInNew sx={{ fontSize: '13px !important' }} />}
                          onClick={() => navigate(`/milestones?id=${encodeURIComponent(p.id)}`)}
                          sx={{ bgcolor: '#0f172a', color: '#ffffff', '&:hover': { bgcolor: '#1e293b' }, fontSize: '0.68rem', fontWeight: 800, textTransform: 'none', py: 0.3 }}
                        >
                          Full Dossier
                        </Button>
                      </Stack>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>

          {/* Table Pagination & Count Strip */}
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0', flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.74rem' }}>
              Showing {Math.min((page - 1) * pageSize + 1, filteredItems.length)}–{Math.min(page * pageSize, filteredItems.length)} of {filteredItems.length} Monitored Packages {stateFilter !== 'all' ? `in ${stateFilter}` : 'Nationwide'}
            </Typography>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, val) => setPage(val)}
              size="small"
              color="primary"
              shape="rounded"
            />
          </Box>
        </Paper>
      )}

      {/* Sovereign Escalation Dialog */}
      <CabinetEscalationDialog
        open={escalationOpen}
        onClose={() => setEscalationOpen(false)}
        projectCode={activeProjectForEscalation.id}
        projectName={activeProjectForEscalation.name}
        outlayCr={activeProjectForEscalation.outlayCr}
        slipDays={activeProjectForEscalation.predictedDelayDays}
        primaryBlocker={`MoEFCC Stage-II Forest Diversion: ${activeProjectForEscalation.criticalBlocker}`}
      />
    </Box>
  );
}
