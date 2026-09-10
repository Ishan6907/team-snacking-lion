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
        borderRadius: '20%',
        overflow: 'hidden',
        flexShrink: 0,
        boxShadow: '0 2px 8px rgba(11, 37, 69, 0.25)',
      }}
    >
      {/* Sovereign Deep Navy Background */}
      <rect width="100" height="100" rx="20" fill="#0b2545" />

      {/* Subtle Institutional Border Ring */}
      <rect
        x="3"
        y="3"
        width="94"
        height="94"
        rx="18"
        fill="none"
        stroke="#d97706"
        strokeWidth="2.5"
        strokeOpacity="0.85"
      />

      {/* Top Saffron / Amber National Accent Bar */}
      <line x1="26" y1="18" x2="74" y2="18" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />

      {/* Architraval Pediment / Keystone (Infrastructure Stability) */}
      <polygon
        points="50,23 76,36 24,36"
        fill="#f8fafc"
        opacity="0.95"
      />

      {/* Three Classical Institutional Pillars (Sovereignty, Metrology, Infrastructure) */}
      {/* Pillar 1 - Left */}
      <rect x="28" y="40" width="9" height="32" rx="2" fill="#cbd5e1" />
      {/* Pillar 2 - Center (Prominent) */}
      <rect x="45.5" y="38" width="9" height="34" rx="2" fill="#f8fafc" />
      {/* Pillar 3 - Right */}
      <rect x="63" y="40" width="9" height="32" rx="2" fill="#cbd5e1" />

      {/* Center Golden Measurement Datum (PAIMANA Metrology Scale) */}
      <circle cx="50" cy="55" r="3" fill="#d97706" />

      {/* Heavy Plinth / Base Foundation */}
      <rect x="20" y="74" width="60" height="5" rx="2" fill="#e2e8f0" />
      <rect x="16" y="80" width="68" height="4" rx="1.5" fill="#d97706" opacity="0.9" />

      {/* Bottom Subtle Green National Accent Bar */}
      <line x1="30" y1="88" x2="70" y2="88" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" />
    </Box>
  );
}
