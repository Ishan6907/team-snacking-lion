import { Typography, Breadcrumbs, Link as MuiLink, Stack, Paper, Chip, Box, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import StatusChip from '@/components/common/StatusChip';
import RiskBadge from '@/components/common/RiskBadge';
import type { Project } from '@/types/project';
import { formatDate } from '@/utils/formatters';
import { WarningAmber, AssignmentTurnedIn } from '@mui/icons-material';

interface ProjectHeaderProps {
  project: Project;
}

export default function ProjectHeader({ project }: ProjectHeaderProps) {
  const costOverrun = project.costOverrunCr ?? 0;
  const originalCost = project.originalCostCr ?? Math.round(project.sanctionedCost ? project.sanctionedCost / 10000000 : 0);
  const revisedCost = project.revisedCostCr ?? (originalCost + costOverrun);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        mb: 3,
        borderRadius: 1,
        border: '1px solid #e2e8f0',
        borderLeft: '4px solid #0b2545',
        bgcolor: '#ffffff',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
      }}
    >
      <Breadcrumbs sx={{ mb: 1.5, '& .MuiBreadcrumbs-separator': { color: '#94a3b8' } }}>
        <MuiLink component={Link} to="/" underline="hover" sx={{ color: '#64748b', fontSize: '0.74rem', fontWeight: 700 }}>
          PORTAL
        </MuiLink>
        <MuiLink component={Link} to="/sectors" underline="hover" sx={{ color: '#64748b', fontSize: '0.74rem', fontWeight: 700 }}>
          SECTORS
        </MuiLink>
        <Typography sx={{ color: '#0b2545', fontSize: '0.74rem', fontWeight: 800, fontFamily: 'monospace' }}>
          {project.mospiCode || project.id}
        </Typography>
      </Breadcrumbs>

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Box>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
            <Chip
              label={project.mospiCode || project.id}
              size="small"
              sx={{
                fontFamily: 'monospace',
                fontWeight: 800,
                bgcolor: '#f1f5f9',
                color: '#0b2545',
                border: '1px solid #cbd5e1',
                fontSize: '0.72rem',
              }}
            />
            <Chip
              label={project.sector}
              size="small"
              sx={{
                fontWeight: 700,
                bgcolor: '#eff6ff',
                color: '#1d4ed8',
                border: '1px solid #bfdbfe',
                fontSize: '0.72rem',
              }}
            />
          </Stack>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.25 }}>
            {project.name}
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.76rem', display: 'block', mt: 0.3 }}>
            Implementing Agency: <b style={{ color: '#0f172a' }}>{project.implementingAgency || 'Central Authority'}</b> &bull; District: <b style={{ color: '#0f172a' }}>{project.district}, {project.state}</b>
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} alignItems="center">
          <StatusChip status={project.status} size="medium" />
          <RiskBadge level={project.riskLevel} size="medium" />
        </Stack>
      </Stack>

      <Divider sx={{ borderColor: '#e2e8f0', my: 1.5 }} />

      {/* Financial & Schedule Highlights Grid */}
      <Stack direction="row" spacing={{ xs: 2, md: 4 }} flexWrap="wrap" sx={{ color: '#64748b', fontSize: '0.78rem' }}>
        <Box>
          <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: 700 }}>
            Original Sanction
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 800, fontFamily: 'monospace', color: '#0f172a' }}>
            ₹{originalCost.toLocaleString('en-IN')} Cr
          </Typography>
        </Box>

        <Box>
          <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: 700 }}>
            Anticipated Total
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 800, fontFamily: 'monospace', color: '#0b2545' }}>
            ₹{revisedCost.toLocaleString('en-IN')} Cr
          </Typography>
        </Box>

        <Box>
          <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: 700 }}>
            Cost Overrun Exposure
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 800,
              fontFamily: 'monospace',
              color: costOverrun > 0 ? '#b91c1c' : '#15803d',
            }}
          >
            {costOverrun > 0 ? `+₹${costOverrun.toLocaleString('en-IN')} Cr` : 'Within Sanction'}
          </Typography>
        </Box>

        <Box>
          <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: 700 }}>
            Commencement Date
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
            {formatDate(project.startDate)}
          </Typography>
        </Box>

        <Box>
          <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: 700 }}>
            Target Delivery
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700, color: '#c2410c' }}>
            {project.revisedCompletion ? formatDate(project.revisedCompletion) : formatDate(project.expectedCompletion)}
          </Typography>
        </Box>

        {project.contractor && (
          <Box>
            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: 700 }}>
              Lead EPC Contractor
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
              {project.contractor}
            </Typography>
          </Box>
        )}
      </Stack>

      {/* Primary Bottleneck Ribbon */}
      {project.primaryBottleneck && (
        <Box
          sx={{
            mt: 2,
            p: 1.2,
            borderRadius: 0.8,
            bgcolor: '#fef2f2',
            border: '1px solid #fecaca',
            borderLeft: '3px solid #b91c1c',
          }}
        >
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'flex-start', sm: 'center' }}>
            <Stack direction="row" spacing={0.6} alignItems="center">
              <WarningAmber sx={{ fontSize: 16, color: '#b91c1c' }} />
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#b91c1c', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                Primary Bottleneck:
              </Typography>
            </Stack>
            <Typography variant="caption" sx={{ color: '#7f1d1d', fontSize: '0.78rem', fontWeight: 500 }}>
              {project.primaryBottleneck}
            </Typography>
            {project.cabinetNoteRef && (
              <Chip
                label={project.cabinetNoteRef}
                size="small"
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  bgcolor: '#fee2e2',
                  color: '#991b1b',
                  height: 20,
                  ml: { sm: 'auto !important' },
                }}
              />
            )}
          </Stack>
        </Box>
      )}

      {/* Statutory Clearance Milestone Ribbon */}
      {project.clearanceMilestone && (
        <Box
          sx={{
            mt: 1,
            p: 1.2,
            borderRadius: 0.8,
            bgcolor: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderLeft: '3px solid #1d4ed8',
          }}
        >
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'flex-start', sm: 'center' }}>
            <Stack direction="row" spacing={0.6} alignItems="center">
              <AssignmentTurnedIn sx={{ fontSize: 16, color: '#1d4ed8' }} />
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                Statutory Milestone:
              </Typography>
            </Stack>
            <Typography variant="caption" sx={{ color: '#1e40af', fontSize: '0.78rem', fontWeight: 500 }}>
              {project.clearanceMilestone}
            </Typography>
          </Stack>
        </Box>
      )}
    </Paper>
  );
}
