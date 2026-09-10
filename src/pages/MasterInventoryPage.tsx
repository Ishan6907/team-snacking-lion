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
  Checkbox,
  LinearProgress,
  Divider,
  Slider,
} from '@mui/material';
import {
  Search,
  GetApp,
  Add,
  CompareArrows,
  WarningAmber,
  OpenInNew,
  ViewList,
  Map as MapIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ALL_1428_PROJECTS, ALL_INDIAN_STATES_AND_UTS, ProjectRow } from '@/data/inventoryData';
import CabinetEscalationDialog from '@/components/common/CabinetEscalationDialog';
import PackageComparisonDialog from '@/components/common/PackageComparisonDialog';
import { useRiskThresholds, calculatePortfolioMetrics } from '@/utils/thresholds';

export default function MasterInventoryPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filterParam = searchParams.get('filter');

  const thresholds = useRiskThresholds();
  const globalMetrics = useMemo(() => {
    return calculatePortfolioMetrics(ALL_1428_PROJECTS, thresholds);
  }, [thresholds]);

  const [selectedIds, setSelectedIds] = useState<string[]>(['NHAI-DEL-MUM-P4']);
  const [statusFilter, setStatusFilter] = useState<'all' | 'critical' | 'moderate' | 'nominal' | 'blocked'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sectorSelect, setSectorSelect] = useState('all');
  const [stateSelect, setStateSelect] = useState('all');
  const [contractorSelect, setContractorSelect] = useState('all');
  const [budgetSelect, setBudgetSelect] = useState('all');

  const [confidenceSelect, setConfidenceSelect] = useState<number>(75);

  // Modal dialog states
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [cabinetNoticeOpen, setCabinetNoticeOpen] = useState(false);

  // Interactive Pagination State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(7);
  const [jumpPageInput, setJumpPageInput] = useState('');

  // Handle incoming filters from sidebar
  useEffect(() => {
    if (filterParam === 'moefcc') {
      setStatusFilter('blocked');
      setSearchQuery('moefcc');
      setPage(1);
    } else if (filterParam === 'land') {
      setStatusFilter('blocked');
      setSearchQuery('land');
      setPage(1);
    } else if (filterParam === 'arbitration') {
      setStatusFilter('blocked');
      setSearchQuery('contractor');
      setPage(1);
    }
  }, [filterParam]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAllCurrentPage = (currentPageItems: ProjectRow[]) => {
    const currentPageIds = currentPageItems.map((p) => p.id);
    const allSelected = currentPageIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !currentPageIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...currentPageIds])));
    }
  };

  // Dynamic Filtering Logic
  const filteredProjects = useMemo(() => {
    return ALL_1428_PROJECTS.filter((p) => {
      // 0. Confidence Filter
      if (p.confidencePct < confidenceSelect) return false;

      // 1. Quick status filter chips (driven dynamically by user-configured delay thresholds)
      if (statusFilter === 'critical' && p.predictedDelayDays < thresholds.criticalDelay) return false;
      if (statusFilter === 'moderate' && (p.predictedDelayDays < thresholds.warningDelay || p.predictedDelayDays >= thresholds.criticalDelay)) return false;
      if (statusFilter === 'nominal' && p.predictedDelayDays >= thresholds.warningDelay) return false;
      if (statusFilter === 'blocked' && !p.criticalBlocker.toLowerCase().includes('land') && !p.criticalBlocker.toLowerCase().includes('clearance') && !p.criticalBlocker.toLowerCase().includes('moefcc')) {
        return false;
      }

      // 2. Sector Filter
      if (sectorSelect !== 'all' && p.sector !== sectorSelect) return false;

      // 3. State Filter
      if (stateSelect !== 'all') {
        if (!p.state.toLowerCase().includes(stateSelect.toLowerCase())) return false;
      }

      // 4. Contractor Filter
      if (contractorSelect !== 'all') {
        if (!p.contractor.toLowerCase().includes(contractorSelect.toLowerCase())) return false;
      }

      // 5. Budget Filter
      if (budgetSelect === 'gt1000' && p.outlayCr < 1000) return false;
      if (budgetSelect === 'gt3000' && p.outlayCr < 3000) return false;
      if (budgetSelect === 'lt1000' && p.outlayCr >= 1000) return false;

      // 6. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          p.name.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.agency.toLowerCase().includes(q) ||
          p.state.toLowerCase().includes(q) ||
          p.contractor.toLowerCase().includes(q) ||
          p.criticalBlocker.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [statusFilter, sectorSelect, stateSelect, contractorSelect, budgetSelect, searchQuery, thresholds.criticalDelay, thresholds.warningDelay, confidenceSelect]);

  // Total pages
  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / pageSize));

  // Current page records
  const currentPageProjects = useMemo(() => {
    const validPage = Math.min(Math.max(1, page), totalPages);
    const start = (validPage - 1) * pageSize;
    return filteredProjects.slice(start, start + pageSize);
  }, [filteredProjects, page, pageSize, totalPages]);

  // Aggregate Scope Ticker Metrics
  const summaryMetrics = useMemo(() => {
    const totalOutlay = filteredProjects.reduce((sum, p) => sum + p.outlayCr, 0);
    const criticalCount = filteredProjects.filter((p) => p.predictedDelayDays >= thresholds.criticalDelay).length;
    const avgDelay = filteredProjects.length
      ? Math.round(filteredProjects.reduce((sum, p) => sum + p.predictedDelayDays, 0) / filteredProjects.length)
      : 0;
    const avgProgressGap = filteredProjects.length
      ? (filteredProjects.reduce((sum, p) => sum + p.progressDiff, 0) / filteredProjects.length).toFixed(1)
      : '0.0';
    return {
      totalOutlay,
      criticalCount,
      avgDelay,
      avgProgressGap,
    };
  }, [filteredProjects, thresholds.criticalDelay]);

  const selectedProjectObjects = useMemo(() => {
    return ALL_1428_PROJECTS.filter((p) => selectedIds.includes(p.id));
  }, [selectedIds]);

  const primarySelected = selectedProjectObjects[0] || ALL_1428_PROJECTS[0];

  const handleExportCSV = () => {
    const headers = [
      'Package ID',
      'Corridor Name',
      'Sector',
      'State',
      'Agency',
      'Contractor',
      'Contract Mode',
      'Outlay (Cr)',
      'Actual %',
      'Planned %',
      'Variance %',
      'Forecast Delay (Days)',
      'Risk Severity',
      'Chainage',
      'Critical Path Blocker',
    ];
    const rows = filteredProjects.map((p) => [
      `"${p.id}"`,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.sector}"`,
      `"${p.state}"`,
      `"${p.agency}"`,
      `"${p.contractor}"`,
      `"${p.contractMode}"`,
      p.outlayCr,
      p.actualPct,
      p.plannedPct,
      p.progressDiff,
      p.predictedDelayDays,
      `"${p.riskSeverity}"`,
      `"${p.chainage}"`,
      `"${p.criticalBlocker.replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PM_GatiShakti_Inventory_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Reset to page 1 on filter changes
  const handleStatusFilterChange = (filter: 'all' | 'critical' | 'moderate' | 'nominal' | 'blocked') => {
    setStatusFilter(filter);
    setPage(1);
  };

  const handleSectorChange = (sector: string) => {
    setSectorSelect(sector);
    setPage(1);
  };

  const handleStateChange = (state: string) => {
    setStateSelect(state);
    setPage(1);
  };

  const handleContractorChange = (contractor: string) => {
    setContractorSelect(contractor);
    setPage(1);
  };

  const handleBudgetChange = (budget: string) => {
    setBudgetSelect(budget);
    setPage(1);
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    setPage(1);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  };

  const handleJumpPage = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseInt(jumpPageInput, 10);
    if (!isNaN(target) && target >= 1 && target <= totalPages) {
      setPage(target);
      setJumpPageInput('');
    }
  };

  // Generate visible page numbers for pagination ribbon
  const visiblePages = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | string)[] = [1];
    if (page > 3) pages.push('...');
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  }, [page, totalPages]);

  const getDelayChip = (p: ProjectRow) => {
    if (p.predictedDelayDays >= thresholds.criticalDelay) {
      return (
        <Chip
          label={`+${p.predictedDelayDays} Days (Critical)`}
          size="small"
          sx={{ height: 20, fontSize: '0.62rem', fontWeight: 800, bgcolor: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' }}
        />
      );
    }
    if (p.predictedDelayDays >= thresholds.warningDelay) {
      return (
        <Chip
          label={`+${p.predictedDelayDays} Days (Moderate)`}
          size="small"
          sx={{ height: 20, fontSize: '0.62rem', fontWeight: 800, bgcolor: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' }}
        />
      );
    }
    return (
      <Chip
        label={`+${p.predictedDelayDays} Days (Nominal)`}
        size="small"
        sx={{ height: 20, fontSize: '0.62rem', fontWeight: 800, bgcolor: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' }}
      />
    );
  };

  const allPageSelected = currentPageProjects.length > 0 && currentPageProjects.every((p) => selectedIds.includes(p.id));

  return (
    <Box sx={{ color: '#0f172a', pb: selectedIds.length > 0 ? 9 : 3 }}>
      {/* Top Header Strip */}
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={1.5} sx={{ mb: 2 }}>
        <Box>
          <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 0.3 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.15rem', color: '#0f172a', letterSpacing: '-0.01em' }}>
              Master Project Inventory
            </Typography>
            <Chip
              label="NIC-PM-1428"
              size="small"
              sx={{ height: 20, fontSize: '0.62rem', fontWeight: 800, fontFamily: 'monospace', bgcolor: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e1' }}
            />
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem', fontFamily: 'monospace' }}>
              Live Telemetry Synchronized: 14:02:38 IST
            </Typography>
          </Stack>
          <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.73rem' }}>
            Authoritative national register of all <strong>1,428 monitored Central Sector infrastructure contracts</strong>
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            size="small"
            variant="outlined"
            startIcon={<ViewList fontSize="small" />}
            sx={{ borderColor: '#0f172a', color: '#0f172a', bgcolor: '#ffffff', fontSize: '0.72rem', fontWeight: 800, textTransform: 'none', py: 0.5 }}
          >
            Table Grid ({filteredProjects.length})
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<MapIcon fontSize="small" />}
            onClick={() => navigate(`/verification?id=${encodeURIComponent(selectedIds[0] || 'NHAI-DEL-MUM-P4')}`)}
            sx={{ borderColor: '#cbd5e1', color: '#64748b', bgcolor: '#ffffff', fontSize: '0.72rem', fontWeight: 600, textTransform: 'none', py: 0.5 }}
          >
            GIS Corridor Map
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<GetApp fontSize="small" />}
            onClick={handleExportCSV}
            sx={{ borderColor: '#cbd5e1', color: '#334155', bgcolor: '#ffffff', fontSize: '0.72rem', fontWeight: 700, textTransform: 'none', py: 0.5 }}
          >
            Export .CSV / PDF
          </Button>
          <Button
            size="small"
            variant="contained"
            startIcon={<Add fontSize="small" />}
            onClick={() => navigate('/upload')}
            sx={{ bgcolor: '#0f172a', color: '#ffffff', '&:hover': { bgcolor: '#1e293b' }, fontSize: '0.72rem', fontWeight: 800, textTransform: 'none', py: 0.6, px: 1.5 }}
          >
            + Register Package
          </Button>
        </Stack>
      </Stack>

      {/* Filter Ribbon 1: Status Chips */}
      <Stack direction="row" spacing={0.8} sx={{ mb: 1.5, overflowX: 'auto', pb: 0.4 }}>
        <Chip
          label="All Packages (1,428)"
          size="small"
          onClick={() => handleStatusFilterChange('all')}
          sx={{
            cursor: 'pointer',
            height: 24,
            fontSize: '0.68rem',
            fontWeight: 800,
            bgcolor: statusFilter === 'all' ? '#0f172a' : '#ffffff',
            color: statusFilter === 'all' ? '#ffffff' : '#334155',
            border: '1px solid #cbd5e1',
          }}
        />
        <Chip
          label={`● Critical Delay ≥${thresholds.criticalDelay}d (${globalMetrics.criticalCount})`}
          size="small"
          onClick={() => handleStatusFilterChange('critical')}
          sx={{
            cursor: 'pointer',
            height: 24,
            fontSize: '0.68rem',
            fontWeight: 800,
            bgcolor: statusFilter === 'critical' ? '#b91c1c' : '#ffffff',
            color: statusFilter === 'critical' ? '#ffffff' : '#b91c1c',
            border: statusFilter === 'critical' ? 'none' : '1px solid #fecaca',
          }}
        />
        <Chip
          label={`● Moderate Risk ${thresholds.warningDelay}–${thresholds.criticalDelay - 1}d (${globalMetrics.warningCount})`}
          size="small"
          onClick={() => handleStatusFilterChange('moderate')}
          sx={{
            cursor: 'pointer',
            height: 24,
            fontSize: '0.68rem',
            fontWeight: 800,
            bgcolor: statusFilter === 'moderate' ? '#d97706' : '#ffffff',
            color: statusFilter === 'moderate' ? '#ffffff' : '#d97706',
            border: statusFilter === 'moderate' ? 'none' : '1px solid #fde68a',
          }}
        />
        <Chip
          label={`● On-Schedule (<${thresholds.warningDelay}d) (${globalMetrics.nominalCount})`}
          size="small"
          onClick={() => handleStatusFilterChange('nominal')}
          sx={{
            cursor: 'pointer',
            height: 24,
            fontSize: '0.68rem',
            fontWeight: 800,
            bgcolor: statusFilter === 'nominal' ? '#15803d' : '#ffffff',
            color: statusFilter === 'nominal' ? '#ffffff' : '#15803d',
            border: statusFilter === 'nominal' ? 'none' : '1px solid #bbf7d0',
          }}
        />
        <Chip
          label="● Statutory / Land Blocked (184)"
          size="small"
          onClick={() => handleStatusFilterChange('blocked')}
          sx={{
            cursor: 'pointer',
            height: 24,
            fontSize: '0.68rem',
            fontWeight: 800,
            bgcolor: statusFilter === 'blocked' ? '#c2410c' : '#ffffff',
            color: statusFilter === 'blocked' ? '#ffffff' : '#c2410c',
            border: statusFilter === 'blocked' ? 'none' : '1px solid #fed7aa',
          }}
        />
      </Stack>

      {/* Filter Ribbon 2: Faceted Dropdowns + Search */}
      <Paper elevation={0} sx={{ p: 1.5, mb: 1.5, borderRadius: 1, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
        <Grid container spacing={1.5} alignItems="center">
          <Grid item xs={12} md={3}>
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem', display: 'block', mb: 0.5 }}>
              Minimum Model Confidence
            </Typography>
            <Slider
              value={confidenceSelect}
              onChange={(_, newValue) => {
                setConfidenceSelect(newValue as number);
                setPage(1);
              }}
              min={50}
              max={98}
              step={1}
              valueLabelDisplay="auto"
              size="small"
            />
            <Typography variant="caption" sx={{ color: '#0f172a', fontSize: '0.65rem', display: 'block' }}>
              Showing {filteredProjects.length} of {ALL_1428_PROJECTS.length} projects above {confidenceSelect}% confidence
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search Project ID, Corridor, Agency, District, Blocker..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ fontSize: 18, color: '#64748b' }} />
                  </InputAdornment>
                ),
                sx: { fontSize: '0.78rem', bgcolor: '#f8fafc', height: 34 },
              }}
            />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <TextField
              select
              fullWidth
              size="small"
              value={sectorSelect}
              onChange={(e) => handleSectorChange(e.target.value)}
              InputProps={{ sx: { fontSize: '0.75rem', height: 34 } }}
            >
              <MenuItem value="all" sx={{ fontSize: '0.75rem' }}>All Sectors (1,428)</MenuItem>
              <MenuItem value="Highways" sx={{ fontSize: '0.75rem' }}>Highways (MoRTH / NHAI)</MenuItem>
              <MenuItem value="Railways" sx={{ fontSize: '0.75rem' }}>Railways (DFCCIL / RVNL)</MenuItem>
              <MenuItem value="Urban Development" sx={{ fontSize: '0.75rem' }}>Urban Transit (Metro)</MenuItem>
              <MenuItem value="Power" sx={{ fontSize: '0.75rem' }}>Power &amp; Energy (PGCIL)</MenuItem>
              <MenuItem value="Water" sx={{ fontSize: '0.75rem' }}>Water (Jal Jeevan)</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <TextField
              select
              fullWidth
              size="small"
              value={stateSelect}
              onChange={(e) => handleStateChange(e.target.value)}
              InputProps={{ sx: { fontSize: '0.75rem', height: 34 } }}
            >
              <MenuItem value="all" sx={{ fontSize: '0.75rem' }}>State: Pan-India (All 36 States &amp; UTs)</MenuItem>
              {ALL_INDIAN_STATES_AND_UTS.map((st) => (
                <MenuItem key={st} value={st} sx={{ fontSize: '0.75rem' }}>
                  {st}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <TextField
              select
              fullWidth
              size="small"
              value={contractorSelect}
              onChange={(e) => handleContractorChange(e.target.value)}
              InputProps={{ sx: { fontSize: '0.75rem', height: 34 } }}
            >
              <MenuItem value="all" sx={{ fontSize: '0.75rem' }}>EPC Contractor: All</MenuItem>
              <MenuItem value="Dilip Buildcon" sx={{ fontSize: '0.75rem' }}>Dilip Buildcon Ltd.</MenuItem>
              <MenuItem value="L&T" sx={{ fontSize: '0.75rem' }}>L&amp;T Construction</MenuItem>
              <MenuItem value="Tata Projects" sx={{ fontSize: '0.75rem' }}>Tata Projects</MenuItem>
              <MenuItem value="Afcons" sx={{ fontSize: '0.75rem' }}>Afcons Infrastructure</MenuItem>
              <MenuItem value="PNC Infratech" sx={{ fontSize: '0.75rem' }}>PNC Infratech</MenuItem>
              <MenuItem value="KNR" sx={{ fontSize: '0.75rem' }}>KNR Constructions</MenuItem>
              <MenuItem value="Megha" sx={{ fontSize: '0.75rem' }}>Megha Engineering (MEIL)</MenuItem>
              <MenuItem value="NCC" sx={{ fontSize: '0.75rem' }}>NCC Limited</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <TextField
              select
              fullWidth
              size="small"
              value={budgetSelect}
              onChange={(e) => handleBudgetChange(e.target.value)}
              InputProps={{ sx: { fontSize: '0.75rem', height: 34 } }}
            >
              <MenuItem value="all" sx={{ fontSize: '0.75rem' }}>Budget: Any CapEx</MenuItem>
              <MenuItem value="gt3000" sx={{ fontSize: '0.75rem' }}>&gt; ₹3,000 Cr</MenuItem>
              <MenuItem value="gt1000" sx={{ fontSize: '0.75rem' }}>&gt; ₹1,000 Cr</MenuItem>
              <MenuItem value="lt1000" sx={{ fontSize: '0.75rem' }}>&lt; ₹1,000 Cr</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* Scope Ticker Summary Bar */}
      <Box sx={{ p: 1.2, mb: 1.5, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 0.8, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
        <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap">
          <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem', fontFamily: 'monospace' }}>
            FILTERED SCOPE CAPEX: <strong style={{ color: '#0f172a' }}>₹{Math.round(summaryMetrics.totalOutlay).toLocaleString('en-IN')} Cr</strong>
          </Typography>
          <Typography variant="caption" sx={{ color: '#dc2626', fontSize: '0.68rem', fontFamily: 'monospace', fontWeight: 700 }}>
            CRITICAL BLOCKERS: {summaryMetrics.criticalCount} Packages (≥{thresholds.criticalDelay}d)
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem', fontFamily: 'monospace' }}>
            AVG FORECAST VARIANCE: <strong style={{ color: '#d97706' }}>+{summaryMetrics.avgDelay} Days</strong>
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem', fontFamily: 'monospace' }}>
            AVG PHYSICAL GAP: <strong style={{ color: '#b91c1c' }}>{summaryMetrics.avgProgressGap}% vs Planned</strong>
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem', fontFamily: 'monospace' }}>
            CONTRACTOR HEALTH MEAN: <strong style={{ color: '#16a34a' }}>76.4 / 100</strong>
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="caption" sx={{ color: '#15803d', fontSize: '0.68rem', fontWeight: 800 }}>
            ● GIS Sync Active
          </Typography>
        </Stack>
      </Box>

      {/* High-Density Data Grid */}
      <Paper elevation={0} sx={{ borderRadius: 1, border: '1px solid #e2e8f0', bgcolor: '#ffffff', overflow: 'hidden' }}>
        <Box sx={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.76rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
                <th style={{ padding: '8px 10px', width: 36 }}>
                  <Checkbox
                    size="small"
                    checked={allPageSelected}
                    indeterminate={!allPageSelected && currentPageProjects.some((p) => selectedIds.includes(p.id))}
                    onChange={() => handleSelectAllCurrentPage(currentPageProjects)}
                    sx={{ p: 0 }}
                  />
                </th>
                <th style={{ padding: '8px 8px', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.65rem', minWidth: 260 }}>
                  PROJECT IDENTIFICATION &amp; CORRIDOR NAME
                </th>
                <th style={{ padding: '8px 8px', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.65rem', minWidth: 130 }}>
                  EXECUTING AGENCY
                </th>
                <th style={{ padding: '8px 8px', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.65rem', minWidth: 150 }}>
                  STATE &amp; CHAINAGE
                </th>
                <th style={{ padding: '8px 8px', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.65rem', minWidth: 125 }}>
                  SANCTIONED OUTLAY
                </th>
                <th style={{ padding: '8px 8px', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.65rem', minWidth: 210 }}>
                  PHYSICAL PROGRESS (PLAN VS ACTUAL)
                </th>
                <th style={{ padding: '8px 8px', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.65rem', minWidth: 165 }}>
                  ML DELAY PREDICTION
                </th>
                <th style={{ padding: '8px 8px', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.65rem', minWidth: 220 }}>
                  CRITICAL PATH BLOCKED
                </th>
              </tr>
            </thead>
            <tbody>
              {currentPageProjects.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '36px 16px', textAlign: 'center', color: '#64748b' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      No infrastructure packages match the selected criteria.
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mt: 0.5 }}>
                      Try clearing filters or search keywords.
                    </Typography>
                  </td>
                </tr>
              ) : (
                currentPageProjects.map((p) => {
                  const isSelected = selectedIds.includes(p.id);
                  return (
                    <tr
                      key={p.id}
                      onClick={() => toggleSelect(p.id)}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        backgroundColor: isSelected ? '#eff6ff' : 'transparent',
                        cursor: 'pointer',
                        transition: 'background-color 0.1s ease',
                      }}
                    >
                      <td style={{ padding: '10px 10px' }} onClick={(e) => e.stopPropagation()}>
                        <Checkbox size="small" checked={isSelected} onChange={() => toggleSelect(p.id)} sx={{ p: 0 }} />
                      </td>

                      {/* Column 1: ID & Name */}
                      <td style={{ padding: '10px 8px' }}>
                        <Typography
                          variant="caption"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/milestones?id=${encodeURIComponent(p.id)}`);
                          }}
                          sx={{
                            fontWeight: 800,
                            color: '#0284c7',
                            fontFamily: 'monospace',
                            fontSize: '0.72rem',
                            display: 'block',
                            cursor: 'pointer',
                            '&:hover': { textDecoration: 'underline' },
                          }}
                        >
                          {p.id}
                        </Typography>
                        <Typography
                          variant="body2"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/milestones?id=${encodeURIComponent(p.id)}`);
                          }}
                          sx={{
                            fontWeight: 700,
                            color: '#0f172a',
                            fontSize: '0.8rem',
                            lineHeight: 1.2,
                            cursor: 'pointer',
                            '&:hover': { color: '#0284c7' },
                          }}
                        >
                          {p.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem' }}>
                          Contractor: <strong>{p.contractor}</strong> &bull; Sector: <strong style={{ color: '#0284c7' }}>{p.sector}</strong>
                        </Typography>
                      </td>

                      {/* Column 2: Agency */}
                      <td style={{ padding: '10px 8px' }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.78rem' }}>
                          {p.agency}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem', display: 'block' }}>
                          {p.ministry}
                        </Typography>
                      </td>

                      {/* Column 3: State & Chainage */}
                      <td style={{ padding: '10px 8px' }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.78rem' }}>
                          {p.state}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', fontFamily: 'monospace', fontSize: '0.68rem', display: 'block' }}>
                          {p.chainage}
                        </Typography>
                      </td>

                      {/* Column 4: Outlay */}
                      <td style={{ padding: '10px 8px' }}>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f172a', fontFamily: 'monospace', fontSize: '0.82rem' }}>
                          ₹{p.outlayCr.toLocaleString('en-IN', { minimumFractionDigits: 2 })} Cr
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem' }}>
                          {p.contractMode}
                        </Typography>
                      </td>

                      {/* Column 5: Progress Plan vs Actual */}
                      <td style={{ padding: '10px 8px' }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.3 }}>
                          <Typography variant="caption" sx={{ fontWeight: 800, color: '#0f172a', fontFamily: 'monospace', fontSize: '0.72rem' }}>
                            {p.actualPct}% Actual
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem' }}>
                            {p.plannedPct}% Target
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={p.actualPct}
                          sx={{
                            height: 5,
                            borderRadius: 1,
                            bgcolor: '#f1f5f9',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: p.progressDiff < -10 ? '#ef4444' : p.progressDiff < 0 ? '#f59e0b' : '#10b981',
                            },
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 700,
                            fontSize: '0.65rem',
                            color: p.progressDiff < 0 ? '#b91c1c' : '#15803d',
                            fontFamily: 'monospace',
                            mt: 0.3,
                            display: 'block',
                          }}
                        >
                          {p.progressDiffLabel}
                        </Typography>
                      </td>

                      {/* Column 6: ML Delay Prediction */}
                      <td style={{ padding: '10px 8px' }}>
                        {getDelayChip(p)}
                        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.66rem', fontFamily: 'monospace', display: 'block', mt: 0.3 }}>
                          Confidence: {p.confidencePct}% &bull; [ML v4.2]
                        </Typography>
                      </td>

                      {/* Column 7: Critical Path Blocked */}
                      <td style={{ padding: '10px 8px' }}>
                        <Chip
                          label={p.criticalBlocker}
                          size="small"
                          sx={{
                            height: 'auto',
                            py: 0.4,
                            px: 0.6,
                            fontSize: '0.68rem',
                            fontWeight: 600,
                            maxWidth: 240,
                            whiteSpace: 'normal',
                            textAlign: 'left',
                            bgcolor: p.predictedDelayDays > 60 ? '#fef2f2' : '#f8fafc',
                            color: p.predictedDelayDays > 60 ? '#b91c1c' : '#334155',
                            border: p.predictedDelayDays > 60 ? '1px solid #fecaca' : '1px solid #e2e8f0',
                            borderRadius: '3px',
                          }}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </Box>

        {/* Dynamic Interactive Pagination Footer */}
        <Box
          sx={{
            p: 1.5,
            bgcolor: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: 1.5,
          }}
        >
          {/* Record counter and page size selector */}
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.72rem' }}>
              Showing{' '}
              <strong>
                {filteredProjects.length === 0 ? 0 : (page - 1) * pageSize + 1} &ndash;{' '}
                {Math.min(page * pageSize, filteredProjects.length)}
              </strong>{' '}
              of <strong>{filteredProjects.length.toLocaleString('en-IN')}</strong> packages{' '}
              {filteredProjects.length !== ALL_1428_PROJECTS.length && (
                <span style={{ color: '#0284c7' }}>(Filtered from {ALL_1428_PROJECTS.length.toLocaleString('en-IN')})</span>
              )}
            </Typography>

            <Stack direction="row" spacing={0.8} alignItems="center">
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem' }}>
                Rows per page:
              </Typography>
              {[7, 14, 28, 50].map((size) => (
                <Button
                  key={size}
                  size="small"
                  variant={pageSize === size ? 'contained' : 'outlined'}
                  onClick={() => handlePageSizeChange(size)}
                  sx={{
                    minWidth: 26,
                    height: 22,
                    p: 0,
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    bgcolor: pageSize === size ? '#0f172a' : '#ffffff',
                    color: pageSize === size ? '#ffffff' : '#475569',
                    borderColor: '#cbd5e1',
                  }}
                >
                  {size}
                </Button>
              ))}
            </Stack>
          </Stack>

          {/* Interactive Page Number Buttons */}
          <Stack direction="row" spacing={0.5} alignItems="center" flexWrap="wrap">
            {/* Previous Page Button */}
            <Button
              size="small"
              variant="outlined"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              sx={{
                minWidth: 28,
                height: 26,
                p: 0,
                fontSize: '0.72rem',
                borderColor: '#cbd5e1',
                color: '#0f172a',
              }}
            >
              <KeyboardArrowLeft sx={{ fontSize: 16 }} />
            </Button>

            {/* Visible Page Numbers */}
            {visiblePages.map((pageNum, idx) => {
              if (pageNum === '...') {
                return (
                  <Typography key={`ellipsis-${idx}`} variant="caption" sx={{ px: 0.5, color: '#94a3b8', fontSize: '0.72rem' }}>
                    ...
                  </Typography>
                );
              }
              const isCurrent = page === pageNum;
              return (
                <Button
                  key={`page-${pageNum}`}
                  size="small"
                  variant={isCurrent ? 'contained' : 'outlined'}
                  onClick={() => setPage(pageNum as number)}
                  sx={{
                    minWidth: 28,
                    height: 26,
                    p: 0,
                    fontSize: '0.72rem',
                    fontWeight: isCurrent ? 800 : 600,
                    bgcolor: isCurrent ? '#0f172a' : '#ffffff',
                    color: isCurrent ? '#ffffff' : '#334155',
                    borderColor: '#cbd5e1',
                    '&:hover': {
                      bgcolor: isCurrent ? '#1e293b' : '#f1f5f9',
                    },
                  }}
                >
                  {pageNum}
                </Button>
              );
            })}

            {/* Next Page Button */}
            <Button
              size="small"
              variant="outlined"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              sx={{
                minWidth: 28,
                height: 26,
                p: 0,
                fontSize: '0.72rem',
                borderColor: '#cbd5e1',
                color: '#0f172a',
              }}
            >
              <KeyboardArrowRight sx={{ fontSize: 16 }} />
            </Button>

            {/* Jump to Page input */}
            <Box component="form" onSubmit={handleJumpPage} sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
              <TextField
                size="small"
                placeholder={String(page)}
                value={jumpPageInput}
                onChange={(e) => setJumpPageInput(e.target.value)}
                InputProps={{
                  sx: { width: 50, height: 26, fontSize: '0.7rem', p: 0, '& input': { textAlign: 'center', p: 0.4 } },
                }}
              />
              <Button
                type="submit"
                size="small"
                variant="outlined"
                sx={{
                  ml: 0.5,
                  minWidth: 32,
                  height: 26,
                  p: 0,
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  borderColor: '#cbd5e1',
                }}
              >
                Go
              </Button>
            </Box>
          </Stack>
        </Box>
      </Paper>

      {/* Floating Batch Action Bottom Bar */}
      {selectedIds.length > 0 && (
        <Paper
          elevation={4}
          sx={{
            position: 'fixed',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1300,
            bgcolor: '#0f172a',
            color: '#ffffff',
            borderRadius: 1.5,
            px: 2.5,
            py: 1.2,
            border: '1px solid #334155',
            boxShadow: '0 12px 32px rgba(0,0,0,0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
            {selectedIds.length} package{selectedIds.length > 1 ? 's' : ''} selected: <span style={{ color: '#38bdf8', fontFamily: 'monospace' }}>{selectedIds[0]}</span>
          </Typography>

          <Divider orientation="vertical" flexItem sx={{ borderColor: '#334155' }} />

          <Button
            size="small"
            startIcon={<CompareArrows fontSize="small" />}
            onClick={() => setComparisonOpen(true)}
            sx={{ color: '#cbd5e1', fontSize: '0.74rem', textTransform: 'none', fontWeight: 600 }}
          >
            Compare Baselines
          </Button>

          <Button
            size="small"
            startIcon={<WarningAmber fontSize="small" />}
            onClick={() => setCabinetNoticeOpen(true)}
            sx={{ color: '#f87171', fontSize: '0.74rem', textTransform: 'none', fontWeight: 700 }}
          >
            Generate Cabinet Escalation Note
          </Button>

          <Button
            size="small"
            variant="contained"
            endIcon={<OpenInNew fontSize="small" />}
            onClick={() => navigate(`/milestones?id=${encodeURIComponent(selectedIds[0] || 'NHAI-DEL-MUM-P4')}`)}
            sx={{
              bgcolor: '#38bdf8',
              color: '#0f172a',
              '&:hover': { bgcolor: '#0284c7', color: '#ffffff' },
              fontSize: '0.74rem',
              fontWeight: 800,
              textTransform: 'none',
              px: 1.5,
            }}
          >
            Open Full Dossier
          </Button>
        </Paper>
      )}

      {/* Interactive Sovereign Modals */}
      <PackageComparisonDialog
        open={comparisonOpen}
        onClose={() => setComparisonOpen(false)}
        selectedProjects={selectedProjectObjects.length > 0 ? selectedProjectObjects : [ALL_1428_PROJECTS[0]]}
      />
      <CabinetEscalationDialog
        open={cabinetNoticeOpen}
        onClose={() => setCabinetNoticeOpen(false)}
        projectCode={primarySelected.id}
        projectName={primarySelected.name}
        outlayCr={primarySelected.outlayCr}
        slipDays={primarySelected.predictedDelayDays}
        primaryBlocker={primarySelected.criticalBlocker}
      />
    </Box>
  );
}
