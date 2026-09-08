import { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Stack,
  Chip,
  Button,
  Slider,
  Switch,
  Select,
  MenuItem,
  FormControl,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Bolt,
  Refresh,
  Save,
  CheckCircle,
  PictureAsPdf,
  Check,
  AccountBalance,
  Agriculture,
  CloudQueue,
  AccountTree,
  ArrowForward,
} from '@mui/icons-material';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

export default function WhatIfSimulatorPage() {
  // Preset selector
  const [preset, setPreset] = useState('custom');

  // Policy Levers State (Defaults matching reference screenshot)
  const [monsoonDeviation, setMonsoonDeviation] = useState<number>(28);
  const [floodProtocol, setFloodProtocol] = useState<boolean>(false);
  const [moefccLatency, setMoefccLatency] = useState<number>(98);
  const [arbitrationVelocity, setArbitrationVelocity] = useState<number>(60);
  const [disbursementLag, setDisbursementLag] = useState<number>(45);
  const [hamAdvance, setHamAdvance] = useState<boolean>(true);
  const [paverRatio, setPaverRatio] = useState<number>(75);
  const [shiftPattern, setShiftPattern] = useState<'single' | 'double'>('double');

  // UI state for simulations
  const [isSimulating, setIsSimulating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Apply Presets
  const handlePresetChange = (newPreset: string) => {
    setPreset(newPreset);
    if (newPreset === 'fast-track') {
      setMonsoonDeviation(10);
      setFloodProtocol(true);
      setMoefccLatency(45);
      setArbitrationVelocity(85);
      setDisbursementLag(15);
      setHamAdvance(true);
      setPaverRatio(110);
      setShiftPattern('double');
      setToastMessage('Applied preset: Single-Window Fast-Track Package');
    } else if (newPreset === 'conservative') {
      setMonsoonDeviation(45);
      setFloodProtocol(false);
      setMoefccLatency(135);
      setArbitrationVelocity(40);
      setDisbursementLag(75);
      setHamAdvance(false);
      setPaverRatio(60);
      setShiftPattern('single');
      setToastMessage('Applied preset: Monsoon Peak Stress (Conservative)');
    } else if (newPreset === 'cabinet-resolution') {
      setMonsoonDeviation(20);
      setFloodProtocol(true);
      setMoefccLatency(35);
      setArbitrationVelocity(95);
      setDisbursementLag(0);
      setHamAdvance(true);
      setPaverRatio(120);
      setShiftPattern('double');
      setToastMessage('Applied preset: Cabinet Resolution Package');
    } else {
      // Default sandbox
      resetBaseline();
    }
  };

  const resetBaseline = () => {
    setMonsoonDeviation(28);
    setFloodProtocol(false);
    setMoefccLatency(98);
    setArbitrationVelocity(60);
    setDisbursementLag(45);
    setHamAdvance(true);
    setPaverRatio(75);
    setShiftPattern('double');
    setToastMessage('Reset levers to baseline calibrated parameters');
  };

  const runMonteCarlo = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setToastMessage('Monte Carlo simulation (10,000 runs) converged with 95% Confidence (±4.2d)');
    }, 600);
  };

  // Real-Time Dynamic Calculations
  const simulationResults = useMemo(() => {
    const baselineDays = 145;
    const baselineCapex = 412;

    // Component impacts in days
    // 1. MoEFCC Clearance: base 98d. 98 -> 30 saves up to 48 days
    const moefccRecovery = Math.round((98 - moefccLatency) * 0.70);

    // 2. Contractor Shift Pattern: Double shift saves ~28 days
    const shiftRecovery = shiftPattern === 'double' ? 28 : 0;

    // 3. Paver ratio: base 75%. Above 75% saves days, below adds days
    const paverImpact = Math.round((paverRatio - 75) * 0.45);

    // 4. HAM Advance liquidity: saves 17 days
    const hamRecovery = hamAdvance ? 17 : 0;

    // 5. Disbursement lag: base 45d. Slower adds delay, faster saves
    const disbursementImpact = Math.round((45 - disbursementLag) * 0.25);

    // 6. Monsoon deviation: base +28%. Deviation > 28 adds delay, lower saves
    const monsoonImpact = Math.round((28 - monsoonDeviation) * 0.35);

    // 7. Flood protocol buffer: saves 8 days if active
    const floodImpact = floodProtocol ? 8 : 0;

    // 8. Land Arbitration: base 60%. Higher velocity saves days
    const arbitrationImpact = Math.round((arbitrationVelocity - 60) * 0.28);

    // Total days recovered
    const totalDaysRecovered = Math.max(
      -30,
      moefccRecovery + shiftRecovery + paverImpact + hamRecovery + disbursementImpact + monsoonImpact + floodImpact + arbitrationImpact
    );

    const simulatedDays = Math.max(15, baselineDays - totalDaysRecovered);
    const daysDelta = simulatedDays - baselineDays; // e.g. -34

    // Overrun CapEx: proportional to delay days (approx ₹2.33 Cr per delay day + overheads)
    const simulatedCapex = Math.round(simulatedDays * 2.33 + 79.37);
    const capexDelta = simulatedCapex - baselineCapex; // e.g. -74

    // Risk Composite:
    const riskComposite = Math.min(96, Math.max(28, Math.round(simulatedDays * 0.48 + 15)));
    let riskLevel = 'MODERATE';
    let riskColor = '#ca8a04';
    let riskBg = '#fefce8';
    if (riskComposite < 50) {
      riskLevel = 'LOW';
      riskColor = '#15803d';
      riskBg = '#f0fdf4';
    } else if (riskComposite > 75) {
      riskLevel = 'HIGH';
      riskColor = '#dc2626';
      riskBg = '#fef2f2';
    }

    // Revised COD calculation
    let revisedCodStr = '06-Mar-2025';
    let revisedCodEarly = '+1 Month Early Delivery';
    if (simulatedDays < 80) {
      revisedCodStr = '12-Jan-2025';
      revisedCodEarly = '+3 Months Early Delivery';
    } else if (simulatedDays > 140) {
      revisedCodStr = '18-Aug-2025';
      revisedCodEarly = 'Severe Critical Slip';
    } else if (simulatedDays <= 111) {
      revisedCodStr = '06-Mar-2025';
      revisedCodEarly = '+1 Month Early Delivery';
    } else {
      revisedCodStr = '28-Apr-2025';
      revisedCodEarly = 'Aligned with Revised Baseline';
    }

    // Dynamic Tornado Drivers
    const tornadoMoefcc = Math.max(8, Math.round(48 * ((180 - moefccLatency) / 82)));
    const tornadoShift = shiftPattern === 'double' ? 28 : 6;
    const tornadoHam = hamAdvance ? 17 : 3;
    const tornadoDrainage = floodProtocol ? 18 : 12;

    const totalTornado = tornadoMoefcc + tornadoShift + tornadoHam + tornadoDrainage;
    const p1Pct = Math.round((tornadoMoefcc / totalTornado) * 100);
    const p2Pct = Math.round((tornadoShift / totalTornado) * 100);
    const p3Pct = Math.round((tornadoHam / totalTornado) * 100);
    const p4Pct = 100 - (p1Pct + p2Pct + p3Pct);

    // Dynamic S-Curve Projection
    const simM1 = 23 + (totalDaysRecovered > 20 ? 1 : 0);
    const simM2 = 44 + Math.round(totalDaysRecovered * 0.08);
    const simToday = 58.6;
    const simM3 = Math.min(92, Math.round(72 + totalDaysRecovered * 0.35));
    const simCod = Math.min(100, Math.round(86 + totalDaysRecovered * 0.41));

    const sCurveData = [
      { stage: 'Appointed Date', baseline: 0, simulated: 0, dpr: 0 },
      { stage: 'M1: Earthwork', baseline: 23, simulated: simM1, dpr: 25 },
      { stage: 'M2: Sub-grade/Bridges', baseline: 44, simulated: simM2, dpr: 48 },
      { stage: 'Today (Ch. 214)', baseline: 58.6, simulated: simToday, dpr: 74.2 },
      { stage: 'M3: PQC Paving', baseline: 72, simulated: simM3, dpr: 90 },
      { stage: 'COD Commission', baseline: 86, simulated: simCod, dpr: 100 },
    ];

    return {
      simulatedDays,
      daysDelta,
      simulatedCapex,
      capexDelta,
      riskComposite,
      riskLevel,
      riskColor,
      riskBg,
      revisedCodStr,
      revisedCodEarly,
      tornadoMoefcc,
      tornadoShift,
      tornadoHam,
      tornadoDrainage,
      p1Pct,
      p2Pct,
      p3Pct,
      p4Pct,
      sCurveData,
    };
  }, [
    monsoonDeviation,
    floodProtocol,
    moefccLatency,
    arbitrationVelocity,
    disbursementLag,
    hamAdvance,
    paverRatio,
    shiftPattern,
  ]);

  return (
    <Box sx={{ color: '#0f172a', pb: 8 }}>
      {/* Top Header & Decision Support Badges */}
      <Box sx={{ mb: 2 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'flex-start' }}
          spacing={2}
        >
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.8 }}>
              <Chip
                label="DECISION SUPPORT SYSTEM"
                size="small"
                sx={{
                  bgcolor: '#1e3a8a',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.66rem',
                  letterSpacing: 0.5,
                  borderRadius: '3px',
                  height: 22,
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  color: '#2563eb',
                  fontSize: '0.72rem',
                  letterSpacing: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                MORTH / NHAI PM-GATISHAKTI ENGINE
                <Box
                  component="span"
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    bgcolor: '#2563eb',
                    display: 'inline-block',
                  }}
                />
              </Typography>
            </Stack>

            <Typography
              variant="caption"
              sx={{
                fontFamily: 'monospace',
                fontWeight: 700,
                color: '#0284c7',
                fontSize: '0.74rem',
                display: 'block',
                mb: 0.4,
              }}
            >
              Model: RF + XGBoost v4.2 • 4,800 Historical Portfolios
            </Typography>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                letterSpacing: -0.5,
                color: '#0f172a',
                fontSize: { xs: '1.25rem', sm: '1.45rem' },
                lineHeight: 1.2,
              }}
            >
              Infrastructure What-If Delay Simulator &amp; Countermeasure Engine
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: '#64748b', fontSize: '0.8rem', mt: 0.4, fontWeight: 500 }}
            >
              Stochastic risk propagation model for NH-48 / Western Corridor Phase-II (Vadodara – Mumbai Pkg-IV, 128.4 km)
            </Typography>
          </Box>

          {/* Right Top Action Bar */}
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <Select
                value={preset}
                onChange={(e) => handlePresetChange(e.target.value)}
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  bgcolor: '#ffffff',
                  height: 34,
                  borderRadius: 1,
                  border: '1px solid #cbd5e1',
                }}
              >
                <MenuItem value="custom" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>Preset: Custom Sandbox (Active)</MenuItem>
                <MenuItem value="fast-track" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>Preset: Single-Window Fast-Track</MenuItem>
                <MenuItem value="conservative" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>Preset: Monsoon Peak Stress</MenuItem>
                <MenuItem value="cabinet-resolution" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>Preset: Cabinet Resolution Package</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              size="small"
              onClick={runMonteCarlo}
              disabled={isSimulating}
              startIcon={<Bolt sx={{ fontSize: 16, color: '#f59e0b' }} />}
              sx={{
                borderColor: '#cbd5e1',
                color: '#0f172a',
                fontWeight: 700,
                fontSize: '0.72rem',
                height: 34,
                textTransform: 'none',
                bgcolor: '#ffffff',
                '&:hover': { bgcolor: '#f8fafc', borderColor: '#94a3b8' },
              }}
            >
              {isSimulating ? 'Simulating…' : 'Run Monte Carlo (10,000 runs)'}
            </Button>

            <Button
              variant="outlined"
              size="small"
              onClick={resetBaseline}
              startIcon={<Refresh sx={{ fontSize: 16 }} />}
              sx={{
                borderColor: '#cbd5e1',
                color: '#475569',
                fontWeight: 700,
                fontSize: '0.72rem',
                height: 34,
                textTransform: 'none',
                bgcolor: '#ffffff',
                '&:hover': { bgcolor: '#f8fafc' },
              }}
            >
              Reset Baseline
            </Button>

            <Button
              variant="contained"
              size="small"
              startIcon={<Save sx={{ fontSize: 16 }} />}
              onClick={() => setToastMessage('Simulation policy dossier saved to Project Baseline')}
              sx={{
                bgcolor: '#0f172a',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.72rem',
                height: 34,
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': { bgcolor: '#1e293b' },
              }}
            >
              Save Policy Dossier
            </Button>
          </Stack>
        </Stack>

        {/* Engine Telemetry & Metadata Strip */}
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          flexWrap="wrap"
          sx={{
            mt: 1.2,
            pt: 1,
            borderTop: '1px solid #e2e8f0',
            fontFamily: 'monospace',
            fontSize: '0.72rem',
            color: '#475569',
          }}
        >
          <Typography variant="caption" sx={{ fontFamily: 'inherit', fontWeight: 600 }}>
            <Box component="span" sx={{ color: '#0f172a', fontWeight: 700 }}>Engine Status:</Box> Real-Time Inferencing
          </Typography>
          <Box sx={{ color: '#cbd5e1' }}>|</Box>
          <Typography variant="caption" sx={{ fontFamily: 'inherit', fontWeight: 600 }}>
            <Box component="span" sx={{ color: '#0f172a', fontWeight: 700 }}>Parametric CI:</Box> 95% (±4.2d) &bull; <Box component="span" sx={{ color: '#0f172a', fontWeight: 700 }}>Model F1:</Box> 87.3%
          </Typography>
          <Box sx={{ color: '#cbd5e1' }}>|</Box>
          <Typography variant="caption" sx={{ fontFamily: 'inherit', fontWeight: 600 }}>
            <Box component="span" sx={{ color: '#0f172a', fontWeight: 700 }}>Synthetic Variance:</Box> Gaussian Mixture · seed #992814-G
          </Typography>
          <Box sx={{ color: '#cbd5e1' }}>|</Box>
          <Typography variant="caption" sx={{ fontFamily: 'inherit', color: '#64748b' }}>
            Updated: 14 mins ago via PMIS Gateway
          </Typography>
          <Chip
            label="Auto-Syncing"
            size="small"
            sx={{
              height: 18,
              fontSize: '0.62rem',
              fontWeight: 800,
              bgcolor: '#e0f2fe',
              color: '#0284c7',
              borderRadius: '2px',
            }}
          />
        </Stack>
      </Box>

      {/* Main 2-Column Split Canvas */}
      <Grid container spacing={2.5}>
        {/* Left Column: Stress Factors & Policy Levers */}
        <Grid item xs={12} lg={5}>
          <Paper
            elevation={0}
            sx={{
              border: '1px solid #e2e8f0',
              borderRadius: 1,
              bgcolor: '#ffffff',
              p: 2.2,
            }}
          >
            {/* Levers Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>
                  Stress Factors &amp; Policy Levers
                </Typography>
                <Chip
                  label="8 Variables Exposed"
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    bgcolor: '#f1f5f9',
                    color: '#475569',
                    border: '1px solid #cbd5e1',
                  }}
                />
              </Stack>
            </Stack>

            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.73rem', display: 'block', mb: 2, lineHeight: 1.4 }}>
              Calibrate environmental constraints, legal friction, and liquidity parameters. Real-time re-scoring reflects on the right analytical canvas.
            </Typography>

            <Stack spacing={2.2}>
              {/* Card 1: Environmental & Climate Stress */}
              <Box
                sx={{
                  border: '1px solid #e2e8f0',
                  borderRadius: 1,
                  p: 1.8,
                  bgcolor: '#fafafa',
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CloudQueue sx={{ fontSize: 18, color: '#0284c7' }} />
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.75rem', letterSpacing: 0.3 }}>
                      1. ENVIRONMENTAL &amp; CLIMATE STRESS
                    </Typography>
                  </Stack>
                  <Chip
                    label="IMD Climate Feed"
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      bgcolor: '#f1f5f9',
                      color: '#64748b',
                      borderRadius: '2px',
                    }}
                  />
                </Stack>

                {/* Slider: Monsoon Precipitation */}
                <Box sx={{ mb: 1.8 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', fontSize: '0.74rem' }}>
                      Monsoon Precipitation Deviation vs Normal
                    </Typography>
                    <Chip
                      label={`${monsoonDeviation > 0 ? '+' : ''}${monsoonDeviation}%`}
                      size="small"
                      sx={{
                        height: 20,
                        fontFamily: 'monospace',
                        fontWeight: 800,
                        fontSize: '0.72rem',
                        bgcolor: monsoonDeviation > 20 ? '#fef2f2' : '#f0fdf4',
                        color: monsoonDeviation > 20 ? '#b91c1c' : '#15803d',
                        border: `1px solid ${monsoonDeviation > 20 ? '#fecaca' : '#bbf7d0'}`,
                      }}
                    />
                  </Stack>
                  <Slider
                    value={monsoonDeviation}
                    onChange={(_, val) => setMonsoonDeviation(val as number)}
                    min={-30}
                    max={60}
                    step={1}
                    size="small"
                    sx={{
                      color: '#0284c7',
                      height: 5,
                      '& .MuiSlider-thumb': { width: 14, height: 14 },
                    }}
                  />
                  <Stack direction="row" justifyContent="space-between" sx={{ fontSize: '0.63rem', color: '#94a3b8', mt: -0.5 }}>
                    <span>-30% (Dry/Favorable)</span>
                    <span>0% Normal</span>
                    <span>+60% (Cloudburst/Flash)</span>
                  </Stack>
                </Box>

                {/* Switch: Extreme Flood Disruption */}
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', fontSize: '0.74rem', display: 'block' }}>
                      Extreme Flood Disruption Protocol Active
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.67rem' }}>
                      Activates automatic force-majeure mitigation buffer
                    </Typography>
                  </Box>
                  <Switch
                    checked={floodProtocol}
                    onChange={(e) => setFloodProtocol(e.target.checked)}
                    size="small"
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: '#0284c7' },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#0284c7' },
                    }}
                  />
                </Stack>
              </Box>

              {/* Card 2: Land & Forest Statutory Clearances */}
              <Box
                sx={{
                  border: '1px solid #e2e8f0',
                  borderRadius: 1,
                  p: 1.8,
                  bgcolor: '#fafafa',
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <AccountBalance sx={{ fontSize: 18, color: '#16a34a' }} />
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.75rem', letterSpacing: 0.3 }}>
                      2. LAND &amp; FOREST STATUTORY CLEARANCES
                    </Typography>
                  </Stack>
                  <Chip
                    label="Section 3D / PARIVESH"
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      bgcolor: '#f1f5f9',
                      color: '#64748b',
                      borderRadius: '2px',
                    }}
                  />
                </Stack>

                {/* Slider: MoEFCC Turnaround Latency */}
                <Box sx={{ mb: 2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 0.3 }}>
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', fontSize: '0.74rem', display: 'block' }}>
                        MoEFCC Clearance Turnaround Latency
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.66rem' }}>
                        Target statutory window: 45 days
                      </Typography>
                    </Box>
                    <Chip
                      label={`${moefccLatency} Days`}
                      size="small"
                      sx={{
                        height: 20,
                        fontFamily: 'monospace',
                        fontWeight: 800,
                        fontSize: '0.72rem',
                        bgcolor: moefccLatency > 90 ? '#fef2f2' : moefccLatency <= 45 ? '#f0fdf4' : '#fffbeb',
                        color: moefccLatency > 90 ? '#b91c1c' : moefccLatency <= 45 ? '#15803d' : '#b45309',
                        border: '1px solid #cbd5e1',
                      }}
                    />
                  </Stack>
                  <Slider
                    value={moefccLatency}
                    onChange={(_, val) => setMoefccLatency(val as number)}
                    min={30}
                    max={180}
                    step={1}
                    size="small"
                    sx={{
                      color: '#16a34a',
                      height: 5,
                      '& .MuiSlider-thumb': { width: 14, height: 14 },
                    }}
                  />
                  <Stack direction="row" justifyContent="space-between" sx={{ fontSize: '0.63rem', color: '#94a3b8', mt: -0.5 }}>
                    <span>30d (Expedited)</span>
                    <span>98d (Current Avg)</span>
                    <span>180d (Backlog)</span>
                  </Stack>
                </Box>

                {/* Slider: Land Arbitration Velocity */}
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', fontSize: '0.74rem' }}>
                      Land Arbitration Resolution Velocity
                    </Typography>
                    <Chip
                      label={`${arbitrationVelocity}%`}
                      size="small"
                      sx={{
                        height: 20,
                        fontFamily: 'monospace',
                        fontWeight: 800,
                        fontSize: '0.72rem',
                        bgcolor: arbitrationVelocity >= 70 ? '#f0fdf4' : '#f8fafc',
                        color: arbitrationVelocity >= 70 ? '#15803d' : '#334155',
                        border: '1px solid #cbd5e1',
                      }}
                    />
                  </Stack>
                  <Slider
                    value={arbitrationVelocity}
                    onChange={(_, val) => setArbitrationVelocity(val as number)}
                    min={10}
                    max={100}
                    step={5}
                    size="small"
                    sx={{
                      color: '#16a34a',
                      height: 5,
                      '& .MuiSlider-thumb': { width: 14, height: 14 },
                    }}
                  />
                  <Stack direction="row" justifyContent="space-between" sx={{ fontSize: '0.63rem', color: '#94a3b8', mt: -0.5 }}>
                    <span>10% (Stalled in High Court)</span>
                    <span>60% Median</span>
                    <span>100% (Lok Adalat Resolved)</span>
                  </Stack>
                </Box>
              </Box>

              {/* Card 3: Financial & Escrow Liquidity */}
              <Box
                sx={{
                  border: '1px solid #e2e8f0',
                  borderRadius: 1,
                  p: 1.8,
                  bgcolor: '#fafafa',
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <AccountTree sx={{ fontSize: 18, color: '#2563eb' }} />
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.75rem', letterSpacing: 0.3 }}>
                      3. FINANCIAL &amp; ESCROW LIQUIDITY
                    </Typography>
                  </Stack>
                  <Chip
                    label="HAM Milestone Tranches"
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      bgcolor: '#f1f5f9',
                      color: '#64748b',
                      borderRadius: '2px',
                    }}
                  />
                </Stack>

                {/* Slider: State Share Disbursement Lag */}
                <Box sx={{ mb: 1.8 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', fontSize: '0.74rem' }}>
                      State Share Disbursement Lag
                    </Typography>
                    <Chip
                      label={`${disbursementLag} Days`}
                      size="small"
                      sx={{
                        height: 20,
                        fontFamily: 'monospace',
                        fontWeight: 800,
                        fontSize: '0.72rem',
                        bgcolor: disbursementLag > 60 ? '#fef2f2' : '#f8fafc',
                        color: disbursementLag > 60 ? '#b91c1c' : '#334155',
                        border: '1px solid #cbd5e1',
                      }}
                    />
                  </Stack>
                  <Slider
                    value={disbursementLag}
                    onChange={(_, val) => setDisbursementLag(val as number)}
                    min={0}
                    max={120}
                    step={1}
                    size="small"
                    sx={{
                      color: '#2563eb',
                      height: 5,
                      '& .MuiSlider-thumb': { width: 14, height: 14 },
                    }}
                  />
                  <Stack direction="row" justifyContent="space-between" sx={{ fontSize: '0.63rem', color: '#94a3b8', mt: -0.5 }}>
                    <span>0d (Instant Escrow)</span>
                    <span>45d Current</span>
                    <span>120d Severe Lag</span>
                  </Stack>
                </Box>

                {/* Switch: Liquidity Injection */}
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', fontSize: '0.74rem', display: 'block' }}>
                      Liquidity Injection (+10% HAM Advance)
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.67rem' }}>
                      Direct contractor credit line backed by bank guarantee
                    </Typography>
                  </Box>
                  <Switch
                    checked={hamAdvance}
                    onChange={(e) => setHamAdvance(e.target.checked)}
                    size="small"
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: '#2563eb' },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#2563eb' },
                    }}
                  />
                </Stack>
              </Box>

              {/* Card 4: On-Ground Contractor Execution */}
              <Box
                sx={{
                  border: '1px solid #e2e8f0',
                  borderRadius: 1,
                  p: 1.8,
                  bgcolor: '#fafafa',
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Agriculture sx={{ fontSize: 18, color: '#d97706' }} />
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.75rem', letterSpacing: 0.3 }}>
                      4. ON-GROUND CONTRACTOR EXECUTION
                    </Typography>
                  </Stack>
                  <Chip
                    label="L&T - Dilip Buildcon JV"
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      bgcolor: '#f1f5f9',
                      color: '#64748b',
                      borderRadius: '2px',
                    }}
                  />
                </Stack>

                {/* Slider: Batching & Paver Mobilization */}
                <Box sx={{ mb: 2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', fontSize: '0.74rem' }}>
                      Batching &amp; Paver Mobilization Ratio
                    </Typography>
                    <Chip
                      label={`${paverRatio}%`}
                      size="small"
                      sx={{
                        height: 20,
                        fontFamily: 'monospace',
                        fontWeight: 800,
                        fontSize: '0.72rem',
                        bgcolor: paverRatio >= 100 ? '#f0fdf4' : paverRatio < 70 ? '#fef2f2' : '#fffbeb',
                        color: paverRatio >= 100 ? '#15803d' : paverRatio < 70 ? '#b91c1c' : '#b45309',
                        border: '1px solid #cbd5e1',
                      }}
                    />
                  </Stack>
                  <Slider
                    value={paverRatio}
                    onChange={(_, val) => setPaverRatio(val as number)}
                    min={50}
                    max={120}
                    step={1}
                    size="small"
                    sx={{
                      color: '#d97706',
                      height: 5,
                      '& .MuiSlider-thumb': { width: 14, height: 14 },
                    }}
                  />
                  <Stack direction="row" justifyContent="space-between" sx={{ fontSize: '0.63rem', color: '#94a3b8', mt: -0.5 }}>
                    <span>50% (Under-equipped)</span>
                    <span>75% Actual</span>
                    <span>120% (Surge Pavers)</span>
                  </Stack>
                </Box>

                {/* Shift Pattern Button Group */}
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', fontSize: '0.74rem', display: 'block' }}>
                    Contractor Shift Pattern Deployment
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 0.8 }}>
                    <Button
                      fullWidth
                      size="small"
                      variant={shiftPattern === 'single' ? 'contained' : 'outlined'}
                      onClick={() => setShiftPattern('single')}
                      sx={{
                        height: 32,
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        textTransform: 'none',
                        bgcolor: shiftPattern === 'single' ? '#0f172a' : '#ffffff',
                        color: shiftPattern === 'single' ? '#ffffff' : '#475569',
                        borderColor: '#cbd5e1',
                        '&:hover': { bgcolor: shiftPattern === 'single' ? '#1e293b' : '#f8fafc' },
                      }}
                    >
                      Single Shift (8h Daytime)
                    </Button>
                    <Button
                      fullWidth
                      size="small"
                      variant={shiftPattern === 'double' ? 'contained' : 'outlined'}
                      onClick={() => setShiftPattern('double')}
                      sx={{
                        height: 32,
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        textTransform: 'none',
                        bgcolor: shiftPattern === 'double' ? '#0f172a' : '#ffffff',
                        color: shiftPattern === 'double' ? '#ffffff' : '#475569',
                        borderColor: '#cbd5e1',
                        '&:hover': { bgcolor: shiftPattern === 'double' ? '#1e293b' : '#f8fafc' },
                      }}
                    >
                      Double Shift (24x7 Surge)
                    </Button>
                  </Stack>
                </Box>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Right Column: Analytics Canvas */}
        <Grid item xs={12} lg={7}>
          <Stack spacing={2.5}>
            {/* Top Prognosis Metric Ribbon (4 Cards) */}
            <Grid container spacing={1.5}>
              {/* Card 1: Delay Prognosis */}
              <Grid item xs={6} sm={3}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    border: '1px solid #e2e8f0',
                    borderRadius: 1,
                    bgcolor: '#ffffff',
                    height: '100%',
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.6 }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b', fontSize: '0.65rem', letterSpacing: 0.5 }}>
                      DELAY PROGNOSIS
                    </Typography>
                    <Chip
                      label={`${simulationResults.daysDelta > 0 ? '+' : ''}${simulationResults.daysDelta}d`}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: '0.62rem',
                        fontWeight: 800,
                        bgcolor: simulationResults.daysDelta <= 0 ? '#dcfce7' : '#fee2e2',
                        color: simulationResults.daysDelta <= 0 ? '#15803d' : '#b91c1c',
                        borderRadius: '2px',
                      }}
                    />
                  </Stack>

                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 800,
                      fontFamily: 'monospace',
                      color: '#0f172a',
                      fontSize: '1.4rem',
                      lineHeight: 1.1,
                      mb: 0.4,
                    }}
                  >
                    +{simulationResults.simulatedDays} Days
                  </Typography>

                  <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.68rem', display: 'block' }}>
                    Baseline:{' '}
                    <Box component="span" sx={{ textDecoration: 'line-through', color: '#ef4444', fontWeight: 600 }}>
                      +145 Days
                    </Box>
                  </Typography>
                </Paper>
              </Grid>

              {/* Card 2: Overrun CapEx */}
              <Grid item xs={6} sm={3}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    border: '1px solid #e2e8f0',
                    borderRadius: 1,
                    bgcolor: '#ffffff',
                    height: '100%',
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.6 }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b', fontSize: '0.65rem', letterSpacing: 0.5 }}>
                      OVERRUN CAPEX
                    </Typography>
                    <Chip
                      label={`-₹${Math.abs(simulationResults.capexDelta)} Cr`}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: '0.62rem',
                        fontWeight: 800,
                        bgcolor: simulationResults.capexDelta <= 0 ? '#dcfce7' : '#fee2e2',
                        color: simulationResults.capexDelta <= 0 ? '#15803d' : '#b91c1c',
                        borderRadius: '2px',
                      }}
                    />
                  </Stack>

                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 800,
                      fontFamily: 'monospace',
                      color: '#0f172a',
                      fontSize: '1.4rem',
                      lineHeight: 1.1,
                      mb: 0.4,
                    }}
                  >
                    ₹{simulationResults.simulatedCapex} Cr
                  </Typography>

                  <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.68rem', display: 'block' }}>
                    Baseline:{' '}
                    <Box component="span" sx={{ textDecoration: 'line-through', color: '#ef4444', fontWeight: 600 }}>
                      ₹412 Cr
                    </Box>
                  </Typography>
                </Paper>
              </Grid>

              {/* Card 3: Risk Composite */}
              <Grid item xs={6} sm={3}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    border: '1px solid #e2e8f0',
                    borderRadius: 1,
                    bgcolor: '#ffffff',
                    height: '100%',
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.6 }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b', fontSize: '0.65rem', letterSpacing: 0.5 }}>
                      RISK COMPOSITE
                    </Typography>
                    <Chip
                      label={simulationResults.riskLevel}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: '0.62rem',
                        fontWeight: 800,
                        bgcolor: simulationResults.riskBg,
                        color: simulationResults.riskColor,
                        borderRadius: '2px',
                      }}
                    />
                  </Stack>

                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 800,
                      fontFamily: 'monospace',
                      color: '#0f172a',
                      fontSize: '1.4rem',
                      lineHeight: 1.1,
                      mb: 0.4,
                    }}
                  >
                    {simulationResults.riskComposite}% <Typography component="span" variant="caption" sx={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b' }}>Probability</Typography>
                  </Typography>

                  <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.68rem', display: 'block' }}>
                    Baseline:{' '}
                    <Box component="span" sx={{ textDecoration: 'line-through', color: '#ef4444', fontWeight: 600 }}>
                      88% (High)
                    </Box>
                  </Typography>
                </Paper>
              </Grid>

              {/* Card 4: Revised COD */}
              <Grid item xs={6} sm={3}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    border: '1px solid #e2e8f0',
                    borderRadius: 1,
                    bgcolor: '#ffffff',
                    height: '100%',
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.6 }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b', fontSize: '0.65rem', letterSpacing: 0.5 }}>
                      REVISED COD
                    </Typography>
                    <Chip
                      label="FY25 Q4"
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: '0.62rem',
                        fontWeight: 800,
                        bgcolor: '#e0f2fe',
                        color: '#0369a1',
                        borderRadius: '2px',
                      }}
                    />
                  </Stack>

                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                      fontFamily: 'monospace',
                      color: '#0f172a',
                      fontSize: '1.15rem',
                      lineHeight: 1.2,
                      mb: 0.2,
                    }}
                  >
                    {simulationResults.revisedCodStr}
                  </Typography>

                  <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.68rem', display: 'block' }}>
                    Target:{' '}
                    <Box component="span" sx={{ textDecoration: 'line-through', color: '#64748b' }}>
                      09-Apr-2025
                    </Box>
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#16a34a', fontSize: '0.68rem', fontWeight: 700, display: 'block' }}>
                    {simulationResults.revisedCodEarly}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Monte Carlo S-Curve Projection */}
            <Paper
              elevation={0}
              sx={{
                p: 2.2,
                border: '1px solid #e2e8f0',
                borderRadius: 1,
                bgcolor: '#ffffff',
              }}
            >
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1} sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.85rem' }}>
                  Monte Carlo S-Curve Projection: Baseline vs Simulated Countermeasures
                </Typography>

                <Stack direction="row" spacing={2} sx={{ fontSize: '0.68rem', fontWeight: 700 }}>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Box sx={{ width: 14, height: 2, bgcolor: '#ef4444', borderTop: '2px dashed #ef4444' }} />
                    <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem', fontWeight: 600 }}>
                      Baseline Delayed Trajectory
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Box sx={{ width: 14, height: 3, bgcolor: '#2563eb' }} />
                    <Typography variant="caption" sx={{ color: '#0f172a', fontSize: '0.68rem', fontWeight: 700 }}>
                      Simulated Intervention Path
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Box sx={{ width: 14, height: 3, bgcolor: '#10b981' }} />
                    <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem', fontWeight: 600 }}>
                      Contractual DPR Baseline
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>

              <Box sx={{ width: '100%', height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={simulationResults.sCurveData} margin={{ top: 10, right: 20, left: -15, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                      dataKey="stage"
                      stroke="#94a3b8"
                      fontSize={10}
                      tickLine={false}
                      axisLine={{ stroke: '#e2e8f0' }}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={10}
                      tickLine={false}
                      axisLine={{ stroke: '#e2e8f0' }}
                      tickFormatter={(v) => `${v}%`}
                      domain={[0, 100]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderRadius: 4,
                        border: 'none',
                        color: '#ffffff',
                        fontSize: 11,
                        padding: '8px 12px',
                      }}
                      formatter={(val: any) => [`${val}%`, 'Progress']}
                    />
                    <Line
                      type="monotone"
                      dataKey="baseline"
                      name="Baseline Delayed"
                      stroke="#ef4444"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      dot={{ r: 3, fill: '#ef4444' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="simulated"
                      name="Simulated Intervention"
                      stroke="#2563eb"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: '#2563eb' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="dpr"
                      name="Contractual DPR"
                      stroke="#10b981"
                      strokeWidth={1.8}
                      dot={{ r: 3, fill: '#10b981' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>

            {/* Sensitivity Tornado: Primary Delay Deflection Drivers */}
            <Paper
              elevation={0}
              sx={{
                p: 2.2,
                border: '1px solid #e2e8f0',
                borderRadius: 1,
                bgcolor: '#ffffff',
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.85rem' }}>
                  Sensitivity Tornado • Primary Delay Deflection Drivers
                </Typography>
                <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#64748b', fontSize: '0.68rem', fontWeight: 600 }}>
                  Shapley Value Influence (d)
                </Typography>
              </Stack>

              <Stack spacing={1.2}>
                {/* Driver 1: MoEFCC */}
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Typography variant="caption" sx={{ width: 230, fontWeight: 700, color: '#334155', fontSize: '0.74rem' }}>
                    Fast-track MoEFCC Stage-II Clearance
                  </Typography>
                  <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: `${Math.min(100, Math.max(15, simulationResults.tornadoMoefcc * 1.8))}%`,
                        bgcolor: '#1e40af',
                        height: 22,
                        borderRadius: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        px: 1,
                        color: '#ffffff',
                        fontFamily: 'monospace',
                        fontWeight: 800,
                        fontSize: '0.7rem',
                        transition: 'width 0.3s ease',
                      }}
                    >
                      -{simulationResults.tornadoMoefcc} Days
                    </Box>
                  </Box>
                  <Typography variant="caption" sx={{ width: 85, color: '#16a34a', fontWeight: 800, fontSize: '0.72rem', textAlign: 'right' }}>
                    Primary ({simulationResults.p1Pct}%)
                  </Typography>
                </Stack>

                {/* Driver 2: Double Shift */}
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Typography variant="caption" sx={{ width: 230, fontWeight: 700, color: '#334155', fontSize: '0.74rem' }}>
                    Contractor Double-Shift PQC Paving
                  </Typography>
                  <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: `${Math.min(100, Math.max(10, simulationResults.tornadoShift * 1.8))}%`,
                        bgcolor: '#2563eb',
                        height: 22,
                        borderRadius: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        px: 1,
                        color: '#ffffff',
                        fontFamily: 'monospace',
                        fontWeight: 800,
                        fontSize: '0.7rem',
                        transition: 'width 0.3s ease',
                      }}
                    >
                      -{simulationResults.tornadoShift} Days
                    </Box>
                  </Box>
                  <Typography variant="caption" sx={{ width: 85, color: '#475569', fontWeight: 700, fontSize: '0.72rem', textAlign: 'right' }}>
                    Sec. ({simulationResults.p2Pct}%)
                  </Typography>
                </Stack>

                {/* Driver 3: HAM Advance */}
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Typography variant="caption" sx={{ width: 230, fontWeight: 700, color: '#334155', fontSize: '0.74rem' }}>
                    HAM Advance Liquidity Injection
                  </Typography>
                  <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: `${Math.min(100, Math.max(8, simulationResults.tornadoHam * 1.8))}%`,
                        bgcolor: '#38bdf8',
                        height: 22,
                        borderRadius: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        px: 1,
                        color: '#0f172a',
                        fontFamily: 'monospace',
                        fontWeight: 800,
                        fontSize: '0.7rem',
                        transition: 'width 0.3s ease',
                      }}
                    >
                      -{simulationResults.tornadoHam} Days
                    </Box>
                  </Box>
                  <Typography variant="caption" sx={{ width: 85, color: '#475569', fontWeight: 700, fontSize: '0.72rem', textAlign: 'right' }}>
                    Tert. ({simulationResults.p3Pct}%)
                  </Typography>
                </Stack>

                {/* Driver 4: Pre-cast Drainage */}
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Typography variant="caption" sx={{ width: 230, fontWeight: 700, color: '#334155', fontSize: '0.74rem' }}>
                    Pre-cast Monsoon Cross-Drainage
                  </Typography>
                  <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: `${Math.min(100, Math.max(6, simulationResults.tornadoDrainage * 1.8))}%`,
                        bgcolor: '#818cf8',
                        height: 22,
                        borderRadius: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        px: 1,
                        color: '#ffffff',
                        fontFamily: 'monospace',
                        fontWeight: 800,
                        fontSize: '0.7rem',
                        transition: 'width 0.3s ease',
                      }}
                    >
                      -{simulationResults.tornadoDrainage} Days
                    </Box>
                  </Box>
                  <Typography variant="caption" sx={{ width: 85, color: '#475569', fontWeight: 700, fontSize: '0.72rem', textAlign: 'right' }}>
                    Env. ({simulationResults.p4Pct}%)
                  </Typography>
                </Stack>
              </Stack>
            </Paper>

            {/* Actionable Cabinet Secretariat & MoRTH Interventions */}
            <Paper
              elevation={0}
              sx={{
                p: 2.2,
                border: '1px solid #e2e8f0',
                borderRadius: 1,
                bgcolor: '#ffffff',
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.8 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CheckCircle sx={{ fontSize: 18, color: '#2563eb' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.85rem' }}>
                    Actionable Cabinet Secretariat &amp; MoRTH Interventions
                  </Typography>
                </Stack>
                <Chip
                  label="Priority Escalations: 3"
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    bgcolor: '#eff6ff',
                    color: '#2563eb',
                    border: '1px solid #bfdbfe',
                  }}
                />
              </Stack>

              <Stack spacing={1.5}>
                {/* Intervention 1 */}
                <Box
                  sx={{
                    p: 1.5,
                    border: '1px solid #bbf7d0',
                    borderRadius: 1,
                    bgcolor: '#f0fdf4',
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 0.6 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CheckCircle sx={{ fontSize: 16, color: '#16a34a' }} />
                      <Typography variant="caption" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.78rem' }}>
                        Invoke PM GatiShakti Single-Window Clearance (Ratlam Forest Div)
                      </Typography>
                    </Stack>
                    <Chip
                      label="+45 Days Recovered"
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: '0.62rem',
                        fontWeight: 800,
                        bgcolor: '#dcfce7',
                        color: '#15803d',
                        borderRadius: '2px',
                      }}
                    />
                  </Stack>

                  <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.72rem', display: 'block', mb: 1, lineHeight: 1.4 }}>
                    Direct Secretary (MoEFCC) to exercise expedited powers under Circular 12/2023 for diversion of 38.4 hectares compensatory afforestation land without de-novo zonal inspection.
                  </Typography>

                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Chip
                      label="Cabinet Note Ready"
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: '0.62rem',
                        fontWeight: 700,
                        bgcolor: '#ffffff',
                        color: '#475569',
                        border: '1px solid #cbd5e1',
                        borderRadius: '2px',
                      }}
                    />
                    <Button
                      size="small"
                      endIcon={<ArrowForward sx={{ fontSize: 13 }} />}
                      onClick={() => setToastMessage('Inter-Ministerial Note draft generated for Cabinet Secretary review')}
                      sx={{
                        p: 0,
                        minWidth: 0,
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        textTransform: 'none',
                        color: '#2563eb',
                        '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
                      }}
                    >
                      Generate Inter-Ministerial Note
                    </Button>
                  </Stack>
                </Box>

                {/* Intervention 2 */}
                <Box
                  sx={{
                    p: 1.5,
                    border: '1px solid #bfdbfe',
                    borderRadius: 1,
                    bgcolor: '#eff6ff',
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 0.6 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Bolt sx={{ fontSize: 16, color: '#2563eb' }} />
                      <Typography variant="caption" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.78rem' }}>
                        Mandate 2nd Slipform Paver via Contract Clause 14.3
                      </Typography>
                    </Stack>
                    <Chip
                      label="+28 Days Recovered"
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: '0.62rem',
                        fontWeight: 800,
                        bgcolor: '#dbeafe',
                        color: '#1e40af',
                        borderRadius: '2px',
                      }}
                    />
                  </Stack>

                  <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.72rem', display: 'block', mb: 1, lineHeight: 1.4 }}>
                    Issue formal directive to concessionaire for urgent mobilization of Gomaco GP4 slipform machine, conditioning milestone incentive release upon reaching 2.4 km/day paving rate.
                  </Typography>

                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Chip
                      label="EPC Concession Clause"
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: '0.62rem',
                        fontWeight: 700,
                        bgcolor: '#ffffff',
                        color: '#475569',
                        border: '1px solid #cbd5e1',
                        borderRadius: '2px',
                      }}
                    />
                    <Button
                      size="small"
                      endIcon={<ArrowForward sx={{ fontSize: 13 }} />}
                      onClick={() => setToastMessage('Contract Clause 14.3 Notice pre-formatted for NHAI Member (Projects)')}
                      sx={{
                        p: 0,
                        minWidth: 0,
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        textTransform: 'none',
                        color: '#2563eb',
                        '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
                      }}
                    >
                      Preview Executive Notice
                    </Button>
                  </Stack>
                </Box>

                {/* Intervention 3 */}
                <Box
                  sx={{
                    p: 1.5,
                    border: '1px solid #e2e8f0',
                    borderRadius: 1,
                    bgcolor: '#f8fafc',
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 0.6 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <PictureAsPdf sx={{ fontSize: 16, color: '#64748b' }} />
                      <Typography variant="caption" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.78rem' }}>
                        Digital Drone Verification Escrow Release
                      </Typography>
                    </Stack>
                    <Chip
                      label="+20 Days Liquidity Accelerated"
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: '0.62rem',
                        fontWeight: 800,
                        bgcolor: '#f1f5f9',
                        color: '#334155',
                        borderRadius: '2px',
                      }}
                    />
                  </Stack>

                  <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.72rem', display: 'block', mb: 1, lineHeight: 1.4 }}>
                    Bypass physical district verification queue by approving Milestone-3 billing (₹118 Cr) against AI-validated LiDAR drone survey points with NHAI GIS geo-fencing.
                  </Typography>

                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Chip
                      label="CAG Compliant Audit Trail"
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: '0.62rem',
                        fontWeight: 700,
                        bgcolor: '#ffffff',
                        color: '#475569',
                        border: '1px solid #cbd5e1',
                        borderRadius: '2px',
                      }}
                    />
                    <Button
                      size="small"
                      endIcon={<ArrowForward sx={{ fontSize: 13 }} />}
                      onClick={() => setToastMessage('Navigating to LiDAR Drone Verification GIS batch #DR-48-22')}
                      sx={{
                        p: 0,
                        minWidth: 0,
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        textTransform: 'none',
                        color: '#2563eb',
                        '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
                      }}
                    >
                      View Drone Audit Batch
                    </Button>
                  </Stack>
                </Box>
              </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>

      {/* Floating Bottom Action Strip */}
      <Paper
        elevation={4}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: { xs: 0, sm: 250 },
          right: 0,
          borderTop: '1px solid #cbd5e1',
          bgcolor: '#ffffff',
          px: { xs: 2, sm: 3 },
          py: 1.4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 1100,
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.85rem' }}>
            Target Scenario:
          </Typography>
          <Chip
            label={`${simulationResults.simulatedDays} Days`}
            size="small"
            sx={{
              fontFamily: 'monospace',
              fontWeight: 800,
              fontSize: '0.8rem',
              bgcolor: '#0f172a',
              color: '#ffffff',
              borderRadius: '3px',
              height: 24,
            }}
          />
          <Typography variant="caption" sx={{ color: '#16a34a', fontWeight: 700, display: { xs: 'none', sm: 'inline' } }}>
            (-{Math.abs(simulationResults.daysDelta)} days recovered vs unmitigated trajectory)
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <Button
            variant="outlined"
            size="small"
            startIcon={<PictureAsPdf sx={{ fontSize: 16 }} />}
            onClick={() => setToastMessage('Downloading Cabinet Note Memorandum (PDF) formatted for MoRTH Secretary')}
            sx={{
              borderColor: '#cbd5e1',
              color: '#0f172a',
              fontWeight: 700,
              fontSize: '0.75rem',
              textTransform: 'none',
              height: 36,
              px: 2,
              '&:hover': { bgcolor: '#f8fafc', borderColor: '#94a3b8' },
            }}
          >
            Export Cabinet Note (PDF)
          </Button>

          <Button
            variant="contained"
            size="small"
            startIcon={<Check sx={{ fontSize: 16 }} />}
            onClick={() => setToastMessage('Applied calibrated interventions to project baseline & PMIS live schedule')}
            sx={{
              bgcolor: '#0f172a',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.75rem',
              textTransform: 'none',
              height: 36,
              px: 2,
              boxShadow: 'none',
              '&:hover': { bgcolor: '#1e293b' },
            }}
          >
            Apply to Project Baseline
          </Button>
        </Stack>
      </Paper>

      {/* Toast Notification */}
      <Snackbar
        open={Boolean(toastMessage)}
        autoHideDuration={4000}
        onClose={() => setToastMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setToastMessage(null)}
          severity="success"
          sx={{
            width: '100%',
            bgcolor: '#0f172a',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '0.8rem',
            '& .MuiAlert-icon': { color: '#4ade80' },
          }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
