import { Chip } from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';
import type { RiskLevel } from '@/types/project';
import { RISK_COLORS } from '@/utils/constants';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'small' | 'medium';
}

const RISK_LABELS: Record<RiskLevel, string> = {
  low: 'Low Risk',
  medium: 'Medium Risk',
  high: 'High Risk',
  critical: 'Critical',
};

export default function RiskBadge({ level, size = 'small' }: RiskBadgeProps) {
  return (
    <Chip
      icon={level === 'high' || level === 'critical' ? <WarningIcon /> : undefined}
      label={RISK_LABELS[level]}
      size={size}
      sx={{
        bgcolor: `${RISK_COLORS[level]}18`,
        color: RISK_COLORS[level],
        fontWeight: 600,
        border: `1px solid ${RISK_COLORS[level]}40`,
        '& .MuiChip-icon': { color: RISK_COLORS[level] },
      }}
    />
  );
}
