import { Box } from '@mui/material';

interface PaimanaLogoProps {
  size?: number;
}

export default function PaimanaLogo({ size = 36 }: PaimanaLogoProps) {
  return (
    <Box
      component="svg"
      viewBox="0 0 100 100"
      sx={{
        width: size,
        height: size,
        borderRadius: '22%',
        overflow: 'hidden',
        flexShrink: 0,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      }}
    >
      {/* Dark Slate Background */}
      <rect width="100" height="100" rx="22" fill="#0b1329" />

      {/* Trajectory Connecting Polyline */}
      <path
        d="M 22 68 L 38 48 L 56 60 L 80 32"
        fill="none"
        stroke="#38bdf8"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Base Reference Datum Line */}
      <line
        x1="22"
        y1="82"
        x2="78"
        y2="82"
        stroke="#475569"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Trajectory Vertex Nodes */}
      {/* Node 1: Blue Baseline */}
      <circle cx="38" cy="48" r="7" fill="#38bdf8" />
      {/* Node 2: Amber Pivot */}
      <circle cx="56" cy="60" r="8" fill="#f59e0b" />
      {/* Node 3: Red Escalation Target */}
      <circle cx="80" cy="32" r="8.5" fill="#ef4444" />
    </Box>
  );
}
