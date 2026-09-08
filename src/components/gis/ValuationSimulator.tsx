import { useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Slider,
  Paper,
  Grid,
  Chip,
  Divider,
} from '@mui/material';
import {
  AccountBalance,
  Calculate,
} from '@mui/icons-material';
import type { ParcelData } from './GisMapCanvas';

interface ValuationSimulatorProps {
  parcel: ParcelData;
}

export default function ValuationSimulator({ parcel }: ValuationSimulatorProps) {
  // Base Circle Rate in Lakhs per Acre (default 35 Lakhs)
  const [circleRateLakhs, setCircleRateLakhs] = useState<number>(35);
  // Rural multiplier factor: 1.0x to 2.0x (RFCTLARR Section 26(2))
  const [ruralMultiplier, setRuralMultiplier] = useState<number>(2.0);
  // Statutory solatium percentage: 100% standard (Section 30)
  const [solatiumPct, setSolatiumPct] = useState<number>(100);
  // Annual interest rate from Section 3A date: default 12% p.a.
  const [interestPct, setInterestPct] = useState<number>(12);
  // Standing assets valuation in Lakhs (crops, borewells, structures)
  const [standingAssetsLakhs, setStandingAssetsLakhs] = useState<number>(15);

  // Calculations:
  // Base land value = Area * Circle Rate * Multiplier
  const baseLandValueLakhs = parcel.areaAcres * circleRateLakhs * ruralMultiplier;
  // Solatium = solatiumPct / 100 * (baseLandValue + standingAssets)
  const solatiumLakhs = (solatiumPct / 100) * (baseLandValueLakhs + standingAssetsLakhs);
  // 12% Interest for ~1.5 years (540 days) elapsed from Sec 3A gazette
  const interestLakhs = (baseLandValueLakhs * (interestPct / 100) * 1.5);
  // Total Compensation Award in Lakhs
  const totalAwardLakhs = baseLandValueLakhs + standingAssetsLakhs + solatiumLakhs + interestLakhs;
  const totalAwardCr = totalAwardLakhs / 100;

  // Direct Purchase expedited incentive (Section 23A)
  const directPurchaseTotalCr = totalAwardCr * 1.08; // 8% additional expedited consent bonus

  return (
    <Box sx={{ color: '#0f172a' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <AccountBalance sx={{ fontSize: 16, color: '#0b2545' }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0b2545', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.76rem' }}>
              CALA Statutory Compensation Simulator
            </Typography>
          </Stack>
          <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.74rem' }}>
            Interactive Award Modeling for {parcel.surveyNo} ({parcel.areaAcres} Acres)
          </Typography>
        </Box>
        <Chip
          icon={<Calculate sx={{ fontSize: '12px !important', color: '#0284c7' }} />}
          label="RFCTLARR 2013 FORMULA"
          size="small"
          sx={{
            height: 20,
            fontSize: '0.62rem',
            fontWeight: 800,
            fontFamily: 'monospace',
            bgcolor: '#eff6ff',
            color: '#0284c7',
            border: '1px solid #bfdbfe',
            borderRadius: 0.5,
          }}
        />
      </Stack>

      {/* Primary Award Telemetry Display */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2.5,
          bgcolor: '#f8fafc',
          border: '1px solid #cbd5e1',
          borderLeft: '4px solid #0b2545',
          borderRadius: 1,
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, fontSize: '0.65rem', letterSpacing: 0.5, textTransform: 'uppercase' }}>
              CALA STATUTORY COMPULSORY AWARD
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#0b2545', fontFamily: 'monospace', fontSize: '1.5rem', mt: 0.2 }}>
              ₹{totalAwardCr.toFixed(3)} Cr
            </Typography>
            <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.72rem' }}>
              ₹{(totalAwardLakhs / parcel.areaAcres).toFixed(2)} Lakhs / Acre Effective
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ p: 1.2, bgcolor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 1 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="caption" sx={{ color: '#15803d', fontWeight: 800, fontSize: '0.65rem' }}>
                  DIRECT PURCHASE (SEC 23A)
                </Typography>
                <Chip label="+8% FAST-TRACK" size="small" sx={{ height: 18, fontSize: '0.55rem', fontWeight: 800, bgcolor: '#dcfce7', color: '#15803d' }} />
              </Stack>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#15803d', fontFamily: 'monospace', fontSize: '1.15rem' }}>
                ₹{directPurchaseTotalCr.toFixed(3)} Cr
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem' }}>
                Saves 18 months litigation window
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Interactive Parameter Sliders */}
      <Stack spacing={2} sx={{ mb: 2.5 }}>
        {/* Slider 1: Circle Rate */}
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
            <Typography variant="caption" sx={{ color: '#334155', fontSize: '0.74rem', fontWeight: 700 }}>
              Baseline District Circle Rate
            </Typography>
            <Typography variant="caption" sx={{ color: '#0b2545', fontFamily: 'monospace', fontWeight: 800, fontSize: '0.78rem' }}>
              ₹{circleRateLakhs} Lakhs / Acre
            </Typography>
          </Stack>
          <Slider
            value={circleRateLakhs}
            min={15}
            max={80}
            step={1}
            onChange={(_, val) => setCircleRateLakhs(val as number)}
            size="small"
            sx={{
              color: '#0b2545',
              height: 5,
              '& .MuiSlider-thumb': { width: 14, height: 14, bgcolor: '#0b2545' },
              '& .MuiSlider-track': { bgcolor: '#0b2545' },
              '& .MuiSlider-rail': { bgcolor: '#cbd5e1' },
            }}
          />
        </Box>

        {/* Slider 2: Rural Multiplier */}
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
            <Typography variant="caption" sx={{ color: '#334155', fontSize: '0.74rem', fontWeight: 700 }}>
              Rural Locality Distance Multiplier (Sec 26)
            </Typography>
            <Typography variant="caption" sx={{ color: '#0284c7', fontFamily: 'monospace', fontWeight: 800, fontSize: '0.78rem' }}>
              {ruralMultiplier.toFixed(1)}x Factor
            </Typography>
          </Stack>
          <Slider
            value={ruralMultiplier}
            min={1.0}
            max={2.0}
            step={0.1}
            onChange={(_, val) => setRuralMultiplier(val as number)}
            size="small"
            sx={{
              color: '#0284c7',
              height: 5,
              '& .MuiSlider-thumb': { width: 14, height: 14, bgcolor: '#0284c7' },
              '& .MuiSlider-track': { bgcolor: '#0284c7' },
              '& .MuiSlider-rail': { bgcolor: '#cbd5e1' },
            }}
          />
        </Box>

        {/* Slider 3: Solatium Pct */}
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
            <Typography variant="caption" sx={{ color: '#334155', fontSize: '0.74rem', fontWeight: 700 }}>
              Statutory Solatium Percentage (Sec 30)
            </Typography>
            <Typography variant="caption" sx={{ color: '#15803d', fontFamily: 'monospace', fontWeight: 800, fontSize: '0.78rem' }}>
              +{solatiumPct}% Mandatory Solatium
            </Typography>
          </Stack>
          <Slider
            value={solatiumPct}
            min={50}
            max={150}
            step={5}
            onChange={(_, val) => setSolatiumPct(val as number)}
            size="small"
            sx={{
              color: '#15803d',
              height: 5,
              '& .MuiSlider-thumb': { width: 14, height: 14, bgcolor: '#15803d' },
              '& .MuiSlider-track': { bgcolor: '#15803d' },
              '& .MuiSlider-rail': { bgcolor: '#cbd5e1' },
            }}
          />
        </Box>

        {/* Slider 4: Annual Interest Pct */}
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
            <Typography variant="caption" sx={{ color: '#334155', fontSize: '0.74rem', fontWeight: 700 }}>
              Section 30(3) Statutory Interest Rate
            </Typography>
            <Typography variant="caption" sx={{ color: '#c2410c', fontFamily: 'monospace', fontWeight: 800, fontSize: '0.78rem' }}>
              {interestPct}% per annum
            </Typography>
          </Stack>
          <Slider
            value={interestPct}
            min={6}
            max={18}
            step={1}
            onChange={(_, val) => setInterestPct(val as number)}
            size="small"
            sx={{
              color: '#c2410c',
              height: 5,
              '& .MuiSlider-thumb': { width: 14, height: 14, bgcolor: '#c2410c' },
              '& .MuiSlider-track': { bgcolor: '#c2410c' },
              '& .MuiSlider-rail': { bgcolor: '#cbd5e1' },
            }}
          />
        </Box>

        {/* Slider 5: Standing Assets & Horticulture */}
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
            <Typography variant="caption" sx={{ color: '#334155', fontSize: '0.74rem', fontWeight: 700 }}>
              Horticulture, Crops &amp; Borewell Asset Valuation
            </Typography>
            <Typography variant="caption" sx={{ color: '#7c3aed', fontFamily: 'monospace', fontWeight: 800, fontSize: '0.78rem' }}>
              ₹{standingAssetsLakhs} Lakhs
            </Typography>
          </Stack>
          <Slider
            value={standingAssetsLakhs}
            min={0}
            max={50}
            step={2}
            onChange={(_, val) => setStandingAssetsLakhs(val as number)}
            size="small"
            sx={{
              color: '#7c3aed',
              height: 5,
              '& .MuiSlider-thumb': { width: 14, height: 14, bgcolor: '#7c3aed' },
              '& .MuiSlider-track': { bgcolor: '#7c3aed' },
              '& .MuiSlider-rail': { bgcolor: '#cbd5e1' },
            }}
          />
        </Box>
      </Stack>

      <Divider sx={{ borderColor: '#e2e8f0', my: 2 }} />

      {/* Component Itemized Breakdown */}
      <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.68rem', mb: 1, display: 'block' }}>
        ITEMIZED CALA VALUATION STRUCTURE
      </Typography>

      <Stack spacing={1}>
        <Box sx={{ p: 1, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 0.8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.72rem' }}>
            Base Multiplied Market Value ({parcel.areaAcres} Ac &times; ₹{circleRateLakhs}L &times; {ruralMultiplier.toFixed(1)})
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 800, color: '#0f172a', fontFamily: 'monospace', fontSize: '0.78rem' }}>
            ₹{baseLandValueLakhs.toFixed(2)} Lakhs
          </Typography>
        </Box>

        <Box sx={{ p: 1, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 0.8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.72rem' }}>
            Section 30 Mandatory Solatium ({solatiumPct}%)
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 800, color: '#15803d', fontFamily: 'monospace', fontSize: '0.78rem' }}>
            +₹{solatiumLakhs.toFixed(2)} Lakhs
          </Typography>
        </Box>

        <Box sx={{ p: 1, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 0.8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.72rem' }}>
            Section 30(3) {interestPct}% p.a. Additional Interest (18 Months)
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 800, color: '#c2410c', fontFamily: 'monospace', fontSize: '0.78rem' }}>
            +₹{interestLakhs.toFixed(2)} Lakhs
          </Typography>
        </Box>

        <Box sx={{ p: 1, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 0.8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.72rem' }}>
            Standing Crops, Orchards &amp; Structure Valuation
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 800, color: '#7c3aed', fontFamily: 'monospace', fontSize: '0.78rem' }}>
            +₹{standingAssetsLakhs.toFixed(2)} Lakhs
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}
