import { Box, Typography, Breadcrumbs, Link as MuiLink, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import StatusChip from '@/components/common/StatusChip';
import RiskBadge from '@/components/common/RiskBadge';
import type { Project } from '@/types/project';
import { formatCurrency, formatDate } from '@/utils/formatters';

interface ProjectHeaderProps {
  project: Project;
}

export default function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <Box>
      <Breadcrumbs sx={{ mb: 2 }}>
        <MuiLink component={Link} to="/" underline="hover" color="inherit">
          Dashboard
        </MuiLink>
        <MuiLink component={Link} to="/sectors" underline="hover" color="inherit">
          Sectors
        </MuiLink>
        <Typography color="text.primary">{project.name}</Typography>
      </Breadcrumbs>

      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
        <Typography variant="h4">{project.name}</Typography>
        <StatusChip status={project.status} size="medium" />
        <RiskBadge level={project.riskLevel} size="medium" />
      </Stack>

      <Stack direction="row" spacing={3} flexWrap="wrap" sx={{ color: 'text.secondary' }}>
        <Typography variant="body2">Sector: <b>{project.sector}</b></Typography>
        <Typography variant="body2">State: <b>{project.state}</b></Typography>
        <Typography variant="body2">Budget: <b>{formatCurrency(project.sanctionedCost)}</b></Typography>
        <Typography variant="body2">Start: <b>{formatDate(project.startDate)}</b></Typography>
        <Typography variant="body2">Expected: <b>{formatDate(project.expectedCompletion)}</b></Typography>
        {project.contractor && (
          <Typography variant="body2">Contractor: <b>{project.contractor}</b></Typography>
        )}
      </Stack>
    </Box>
  );
}
