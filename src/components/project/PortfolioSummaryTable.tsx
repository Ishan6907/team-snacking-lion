import { useState, useMemo, useRef, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Box,
  TextField,
  InputAdornment,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  FilterList,
} from '@mui/icons-material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import StatusChip from '@/components/common/StatusChip';
import RiskBadge from '@/components/common/RiskBadge';
import ProjectInspectorDrawer from '@/components/project/ProjectInspectorDrawer';
import type { ProjectListItem } from '@/types/project';
import { formatDelayDays } from '@/utils/formatters';

interface PortfolioSummaryTableProps {
  projects: ProjectListItem[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  isLoading: boolean;
}

type QuickFilter = 'all' | 'overrun' | 'critical' | 'railways' | 'roads' | 'power' | 'water';

export default function PortfolioSummaryTable({
  projects,
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  isLoading,
}: PortfolioSummaryTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<QuickFilter>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectListItem | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' to jump to search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter logic on client-side for immediate responsive feel
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      // Search match
      const query = searchTerm.toLowerCase();
      const matchesSearch =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.sector.toLowerCase().includes(query) ||
        p.state.toLowerCase().includes(query) ||
        (p.mospiCode && p.mospiCode.toLowerCase().includes(query)) ||
        (p.contractor && p.contractor.toLowerCase().includes(query)) ||
        (p.primaryBottleneck && p.primaryBottleneck.toLowerCase().includes(query));

      if (!matchesSearch) return false;

      // Quick filter match
      if (activeFilter === 'overrun') return (p.costOverrunCr ?? 0) >= 1000;
      if (activeFilter === 'critical') return p.riskLevel === 'critical';
      if (activeFilter === 'railways') return p.sector === 'Railways';
      if (activeFilter === 'roads') return p.sector === 'Roads & Highways';
      if (activeFilter === 'power') return p.sector === 'Power & Energy';
      if (activeFilter === 'water') return p.sector === 'Water Resources';
      return true;
    });
  }, [projects, searchTerm, activeFilter]);

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      'Project Code',
      'Central Project Title',
      'Nodal Sector',
      'State / UT',
      'Milestone Status',
      'Vulnerability Risk',
      'Physical Progress %',
      'Original Cost (Cr)',
      'Revised Cost (Cr)',
      'Cost Overrun (Cr)',
      'Recorded Delay (Days)',
      'Est. Slippage (Days)',
      'Lead Contractor',
      'Implementing Agency',
      'Primary Bottleneck',
      'Cabinet Ref',
    ];

    const rows = filteredProjects.map((p) => [
      `"${p.mospiCode || p.id}"`,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.sector}"`,
      `"${p.state}"`,
      `"${p.status}"`,
      `"${p.riskLevel}"`,
      p.physicalProgress,
      p.originalCostCr ?? '',
      p.revisedCostCr ?? '',
      p.costOverrunCr ?? 0,
      p.delayDays,
      p.predictedDelay,
      `"${(p.contractor || '').replace(/"/g, '""')}"`,
      `"${(p.implementingAgency || '').replace(/"/g, '""')}"`,
      `"${(p.primaryBottleneck || '').replace(/"/g, '""')}"`,
      `"${(p.cabinetNoteRef || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `MoSPI_Central_Projects_Registry_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const columns: GridColDef[] = [
    {
      field: 'mospiCode',
      headerName: 'Project Code',
      width: 175,
      renderCell: (params) => (
        <Typography
          variant="caption"
          sx={{
            fontFamily: 'monospace',
            fontWeight: 800,
            color: '#0b2545',
            letterSpacing: 0.3,
            fontSize: '0.72rem',
          }}
        >
          {params.value || params.row.id}
        </Typography>
      ),
    },
    {
      field: 'name',
      headerName: 'Central Project Title & Agency',
      flex: 2,
      minWidth: 260,
      renderCell: (params) => (
        <Box sx={{ py: 0.8 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              color: '#0f172a',
              fontSize: '0.82rem',
              lineHeight: 1.25,
            }}
          >
            {params.value}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: '#64748b',
              fontSize: '0.7rem',
              display: 'block',
              mt: 0.2,
            }}
          >
            {params.row.implementingAgency || 'Central Authority'} &bull; {params.row.state}
          </Typography>
        </Box>
      ),
    },
    { field: 'sector', headerName: 'Nodal Sector', width: 145 },
    {
      field: 'status',
      headerName: 'Milestone Status',
      width: 135,
      renderCell: (params) => <StatusChip status={params.value} />,
    },
    {
      field: 'riskLevel',
      headerName: 'Vulnerability',
      width: 120,
      renderCell: (params) => <RiskBadge level={params.value} />,
    },
    {
      field: 'physicalProgress',
      headerName: 'Physical %',
      width: 100,
      renderCell: (params) => (
        <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 800, color: '#0284c7' }}>
          {params.value}%
        </Typography>
      ),
    },
    {
      field: 'costOverrunCr',
      headerName: 'Cost Overrun',
      width: 135,
      renderCell: (params) => {
        const overrun = params.value as number;
        if (!overrun || overrun <= 0) {
          return (
            <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 700, color: '#15803d' }}>
              Nil (0 Cr)
            </Typography>
          );
        }
        return (
          <Typography
            variant="caption"
            sx={{
              fontFamily: 'monospace',
              fontWeight: 800,
              color: overrun > 5000 ? '#b91c1c' : '#c2410c',
            }}
          >
            +₹{overrun.toLocaleString('en-IN')} Cr
          </Typography>
        );
      },
    },
    {
      field: 'predictedDelay',
      headerName: 'Est. Slippage',
      width: 120,
      renderCell: (params) => (
        <Typography
          variant="caption"
          sx={{
            fontFamily: 'monospace',
            fontWeight: 800,
            color: (params.value as number) > 90 ? '#b91c1c' : '#475569',
          }}
        >
          {formatDelayDays(params.value as number)}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Inspect',
      width: 85,
      sortable: false,
      renderCell: (params) => (
        <Tooltip title="Inspect Telemetry & Statutory Roadblocks">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProject(params.row as ProjectListItem);
            }}
            sx={{
              color: '#0b2545',
              bgcolor: '#f1f5f9',
              border: '1px solid #cbd5e1',
              '&:hover': { bgcolor: '#e2e8f0' },
              p: 0.6,
            }}
          >
            <VisibilityIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <>
      <Card sx={{ borderRadius: 1, border: '1px solid #e2e8f0', bgcolor: '#ffffff', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)' }}>
        <CardContent sx={{ p: 2.5 }}>
          {/* Header Bar */}
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', md: 'center' }}
            spacing={2}
            sx={{ mb: 2 }}
          >
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: 0.8, fontSize: '0.78rem' }}>
                Central Sector Projects Directory
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.72rem' }}>
                Interactive registry &bull; Click record or inspect icon to slide out project dossier & statutory roadblocks
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.5} alignItems="center">
              <Chip
                label={`${filteredProjects.length} / ${total} Projects`}
                size="small"
                sx={{
                  fontWeight: 800,
                  fontFamily: 'monospace',
                  bgcolor: '#eff6ff',
                  color: '#0b2545',
                  border: '1px solid #bfdbfe',
                  fontSize: '0.68rem',
                }}
              />
              <Button
                variant="outlined"
                size="small"
                startIcon={<DownloadIcon fontSize="small" />}
                onClick={handleExportCSV}
                sx={{
                  borderColor: '#cbd5e1',
                  color: '#0b2545',
                  bgcolor: '#ffffff',
                  '&:hover': { borderColor: '#0b2545', bgcolor: '#f8fafc' },
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.74rem',
                  py: 0.5,
                  px: 1.5,
                }}
              >
                Export CSV
              </Button>
            </Stack>
          </Stack>

          {/* Quick Command & Filter Bar */}
          <Box
            sx={{
              p: 1.5,
              mb: 2,
              borderRadius: 1,
              bgcolor: '#f8fafc',
              border: '1px solid #e2e8f0',
            }}
          >
            <Stack direction={{ xs: 'column', lg: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', lg: 'center' }}>
              {/* Search input with shortcut */}
              <TextField
                inputRef={searchInputRef}
                placeholder="Search projects, agencies, contractors, bottlenecks (Press '/' to focus)…"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  flexGrow: 1,
                  '& .MuiInputBase-root': {
                    bgcolor: '#ffffff',
                    fontSize: '0.8rem',
                    color: '#0f172a',
                    height: 36,
                    border: '1px solid #cbd5e1',
                    borderRadius: 1,
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ fontSize: 17, color: '#64748b' }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm ? (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearchTerm('')} sx={{ color: '#64748b' }}>
                        <ClearIcon sx={{ fontSize: 15 }} />
                      </IconButton>
                    </InputAdornment>
                  ) : (
                    <InputAdornment position="end">
                      <Box
                        sx={{
                          px: 0.8,
                          py: 0.2,
                          borderRadius: 0.5,
                          bgcolor: '#f1f5f9',
                          border: '1px solid #cbd5e1',
                          color: '#64748b',
                          fontFamily: 'monospace',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                        }}
                      >
                        /
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Quick Filter Chips */}
              <Stack direction="row" spacing={0.8} alignItems="center" flexWrap="wrap" useFlexGap sx={{ pt: { xs: 0.5, lg: 0 } }}>
                <FilterList sx={{ fontSize: 16, color: '#64748b', display: { xs: 'none', sm: 'block' } }} />
                {[
                  { key: 'all', label: 'All' },
                  { key: 'overrun', label: 'Overrun > ₹1,000 Cr' },
                  { key: 'critical', label: 'Critical Risk' },
                  { key: 'railways', label: 'Railways' },
                  { key: 'roads', label: 'Highways' },
                  { key: 'power', label: 'Power' },
                  { key: 'water', label: 'Water' },
                ].map((chip) => {
                  const isSelected = activeFilter === chip.key;
                  return (
                    <Chip
                      key={chip.key}
                      label={chip.label}
                      size="small"
                      clickable
                      onClick={() => setActiveFilter(chip.key as QuickFilter)}
                      sx={{
                        fontSize: '0.7rem',
                        fontWeight: isSelected ? 800 : 600,
                        bgcolor: isSelected ? '#0b2545' : '#ffffff',
                        color: isSelected ? '#ffffff' : '#475569',
                        border: isSelected ? '1px solid #0b2545' : '1px solid #cbd5e1',
                        height: 26,
                        '&:hover': {
                          bgcolor: isSelected ? '#133e87' : '#f1f5f9',
                        },
                      }}
                    />
                  );
                })}
              </Stack>
            </Stack>
          </Box>

          {/* Data Grid */}
          <DataGrid
            rows={filteredProjects}
            columns={columns}
            rowCount={filteredProjects.length}
            paginationMode="client"
            paginationModel={{ page, pageSize }}
            onPaginationModelChange={(model) => {
              onPageChange(model.page);
              onPageSizeChange(model.pageSize);
            }}
            pageSizeOptions={[10, 25, 50]}
            loading={isLoading}
            onRowClick={(params) => setSelectedProject(params.row as ProjectListItem)}
            autoHeight
            rowHeight={54}
            disableRowSelectionOnClick
            sx={{
              border: 'none',
              color: '#0f172a',
              '& .MuiDataGrid-columnHeaders': {
                bgcolor: '#f8fafc',
                borderBottom: '2px solid #cbd5e1',
                color: '#334155',
                fontWeight: 800,
                fontSize: '0.72rem',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              },
              '& .MuiDataGrid-row': {
                cursor: 'pointer',
                borderBottom: '1px solid #f1f5f9',
                '&:hover': {
                  bgcolor: '#f8fafc',
                },
              },
              '& .MuiDataGrid-cell': {
                fontSize: '0.82rem',
                borderColor: '#f1f5f9',
              },
              '& .MuiTablePagination-root': {
                color: '#64748b',
                borderColor: '#e2e8f0',
              },
            }}
          />
        </CardContent>
      </Card>

      {/* Slide-out Inspector Drawer */}
      <ProjectInspectorDrawer
        project={selectedProject}
        open={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}
