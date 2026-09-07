import { Chip } from '@mui/material';
import type { ProjectStatus } from '@/types/project';
import { STATUS_LABELS, STATUS_COLORS } from '@/utils/constants';

interface StatusChipProps {
  status: ProjectStatus;
  size?: 'small' | 'medium';
}

export default function StatusChip({ status, size = 'small' }: StatusChipProps) {
  return (
    <Chip
      label={STATUS_LABELS[status] ?? status}
      size={size}
      sx={{
        bgcolor: `${STATUS_COLORS[status]}18`,
        color: STATUS_COLORS[status],
        fontWeight: 600,
        border: `1px solid ${STATUS_COLORS[status]}40`,
      }}
    />
  );
}
