import { useState, useRef, useEffect, useMemo } from 'react';
import { Box, Typography, Stack, IconButton, Chip, Tooltip, Paper, Button } from '@mui/material';
import {
  ZoomIn,
  ZoomOut,
  Layers,
  CropFree,
  MyLocation,
  Straighten,
  Radar,
  Explore,
  History,
  Clear,
  Sensors,
  Visibility,
  Terrain,
} from '@mui/icons-material';
import type { ProjectRow } from '@/data/inventoryData';
import { getProjectCadastralLayout } from '@/utils/geodetic';

export interface ParcelData {
  id: string;
  surveyNo: string;
  khasraNo: string;
  owner: string;
  areaAcres: number;
  acquisitionStatus: 'acquired' | 'in_progress' | 'disputed' | 'compensation_pending';
  landType: 'Agricultural' | 'Non-Agricultural' | 'Forest/Govt' | 'Commercial';
  estimatedCostCr: number;
  center: { x: number; y: number };
  points?: string;
}

interface GisMapCanvasProps {
  parcels: ParcelData[];
  selectedParcel: ParcelData;
  onSelectParcel: (parcel: ParcelData) => void;
  activeProject?: ProjectRow;
}

type SensorBand = 'optical' | 'sar' | 'ndvi' | 'lidar' | 'cadastral';
type SatelliteEpoch = '2020' | '2023' | '2026';

export default function GisMapCanvas({ parcels, selectedParcel, onSelectParcel, activeProject }: GisMapCanvasProps) {
  // Deterministic Geodetic & Cadastral Layout based on active highway
  const layout = useMemo(() => {
    return activeProject ? getProjectCadastralLayout(activeProject) : null;
  }, [activeProject]);

  // Navigation: Pan & Zoom
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Space Sensor & Display Modes
  const [activeBand, setActiveBand] = useState<SensorBand>('optical');
  const [satelliteEpoch, setSatelliteEpoch] = useState<SatelliteEpoch>('2026');
  const [radarSweep, setRadarSweep] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showContours, setShowContours] = useState(true);

  // Measuring Rangefinder Tool
  const [measureMode, setMeasureMode] = useState(false);
  const [measurePoints, setMeasurePoints] = useState<Array<{ x: number; y: number }>>([]);

  // Live Cursor Telemetry
  const [cursorPos, setCursorPos] = useState({ x: 450, y: 330 });
  const [hoveredParcel, setHoveredParcel] = useState<ParcelData | null>(null);

  // Live Mission Clock (Ticking Seconds)
  const [missionTime, setMissionTime] = useState({ utc: '', ist: '', secondsToPass: 248 });

  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      setMissionTime((prev) => ({
        utc: now.toISOString().substring(11, 19) + ' UTC',
        ist: now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST',
        secondsToPass: prev.secondsToPass > 1 ? prev.secondsToPass - 1 : 360,
      }));
    };
    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  // Status color codes
  const statusColors = {
    acquired: '#10b981',
    in_progress: '#f59e0b',
    disputed: '#ef4444',
    compensation_pending: '#8b5cf6',
  };

  // Convert SVG coordinates to real-world GIS Coordinates (WGS84 & UTM)
  const calculateGeoCoords = (x: number, y: number) => {
    const baseLat = layout?.projectLat ?? 22.2587;
    const baseLon = layout?.projectLon ?? 71.1924;
    const utmZone = layout?.profile.utmZone ?? '43Q';
    const utmBaseE = layout?.profile.utmBaseE ?? 313800;
    const utmBaseN = layout?.profile.utmBaseN ?? 2462300;
    const baseElev = layout?.profile.baseElevation ?? 38.4;

    const curLat = baseLat + (330 - y) * 0.00015;
    const curLon = baseLon + (x - 450) * 0.00018;

    const latDeg = Math.floor(Math.abs(curLat));
    const latMin = Math.floor((Math.abs(curLat) - latDeg) * 60);
    const latSec = (((Math.abs(curLat) - latDeg) * 60 - latMin) * 60).toFixed(1);
    const latStr = `${latDeg}°${latMin}'${latSec}"N`;

    const lonDeg = Math.floor(Math.abs(curLon));
    const lonMin = Math.floor((Math.abs(curLon) - lonDeg) * 60);
    const lonSec = (((Math.abs(curLon) - lonDeg) * 60 - lonMin) * 60).toFixed(1);
    const lonStr = `${lonDeg}°${lonMin}'${lonSec}"E`;

    const utmE = Math.round(utmBaseE + (x - 450) * 2.3);
    const utmN = Math.round(utmBaseN + (330 - y) * 2.3);
    const elev = (baseElev + Math.sin(x / 80) * 8 - Math.cos(y / 80) * 6).toFixed(1);

    return {
      lat: latStr,
      lon: lonStr,
      utm: `${utmZone} ${utmE}m E ${utmN}m N`,
      elevation: `${elev}m MSL`,
    };
  };

  const geoTelemetry = calculateGeoCoords(cursorPos.x, cursorPos.y);

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (measureMode) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const svgX = Math.round(((e.clientX - rect.left) / rect.width) * 900);
      const svgY = Math.round(((e.clientY - rect.top) / rect.height) * 660);
      setCursorPos({ x: Math.max(0, Math.min(900, svgX)), y: Math.max(0, Math.min(660, svgY)) });
    }

    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.15 : -0.15;
    setZoom((z) => Math.min(Math.max(z + delta, 0.6), 3.0));
  };

  // Center on active parcel
  const recenterActiveParcel = () => {
    setZoom(1.35);
    setPan({
      x: (450 - selectedParcel.center.x) * 1.35,
      y: (330 - selectedParcel.center.y) * 1.35,
    });
  };

  // Measurement tool click
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!measureMode || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const svgX = Math.round(((e.clientX - rect.left) / rect.width) * 900);
    const svgY = Math.round(((e.clientY - rect.top) / rect.height) * 660);
    setMeasurePoints((prev) => [...prev, { x: svgX, y: svgY }]);
  };

  // Compute total measured distance in meters
  let totalMeasuredMeters = 0;
  for (let i = 1; i < measurePoints.length; i++) {
    const dx = (measurePoints[i].x - measurePoints[i - 1].x) * 2.3;
    const dy = (measurePoints[i].y - measurePoints[i - 1].y) * 2.3;
    totalMeasuredMeters += Math.hypot(dx, dy);
  }

  return (
    <Box
      sx={{
        position: 'relative',
        height: '100%',
        minHeight: '700px',
        bgcolor: '#050608', // Deep Space Void Black
        overflow: 'hidden',
        borderRadius: 1,
        border: '1px solid #1f232b',
        boxShadow: '0 12px 48px 0 rgba(0, 0, 0, 0.85)',
        color: '#e2e8f0',
        userSelect: 'none',
        cursor: measureMode ? 'crosshair' : isDragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      onClick={handleCanvasClick}
    >
      {/* Space Mission Top Status Bar */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 32,
          bgcolor: 'rgba(8, 10, 14, 0.95)',
          borderBottom: '1px solid #1f232b',
          px: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 12,
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Stack direction="row" spacing={0.8} alignItems="center">
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#10b981', boxShadow: '0 0 8px #10b981' }} />
            <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 900, fontFamily: 'monospace', fontSize: '0.68rem', letterSpacing: 0.5 }}>
              ORBIT TRACK: CARTOSAT-3 &bull; SENTINEL-2A L2A
            </Typography>
          </Stack>
          <Typography variant="caption" sx={{ color: '#71717a', fontFamily: 'monospace', fontSize: '0.65rem' }}>
            ALT: 505.4 KM &bull; VELOCITY: 7.56 KM/S &bull; GSD: 0.28M PAN
          </Typography>
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="caption" sx={{ color: '#fbbf24', fontFamily: 'monospace', fontSize: '0.68rem', fontWeight: 800 }}>
            OVERPASS IN: {Math.floor(missionTime.secondsToPass / 60)}M {String(missionTime.secondsToPass % 60).padStart(2, '0')}S
          </Typography>
          <Typography variant="caption" sx={{ color: '#38bdf8', fontFamily: 'monospace', fontSize: '0.68rem', fontWeight: 700 }}>
            {missionTime.utc} &bull; {missionTime.ist}
          </Typography>
        </Stack>
      </Box>

      {/* === GIS DATA TRANSPARENCY NOTICE === */}
      <Paper
        elevation={0}
        sx={{
          position: 'absolute',
          bottom: 8,
          left: 8,
          zIndex: 20,
          p: 1,
          maxWidth: 320,
          bgcolor: 'rgba(15, 23, 42, 0.88)',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(100, 116, 139, 0.3)',
          borderRadius: 1,
        }}
      >
        <Typography variant="caption" sx={{ color: '#f59e0b', fontWeight: 800, fontSize: '0.6rem', display: 'block', mb: 0.3, letterSpacing: 0.5, textTransform: 'uppercase' }}>
          ⚠ Data Source Transparency
        </Typography>
        <Typography variant="caption" sx={{ color: '#cbd5e1', fontSize: '0.58rem', lineHeight: 1.3, display: 'block' }}>
          <strong>Map Layer:</strong> Simulated cadastral visualization using deterministic geodetic projections. Not a live satellite feed.
          <br />
          <strong>Sensor Bands:</strong> Optical/SAR/NDVI/LiDAR modes render synthetic representations for demonstration purposes.
          <br />
          <strong>Coordinates:</strong> WGS84 projections are computed from state centroids and chainage offsets.
          <br />
          <strong>Upgrade Path:</strong> Replace with Bhuvan WMS/WMTS tiles, Sentinel Hub API, or Google Earth Engine for production-grade live imagery.
        </Typography>
      </Paper>

      {/* Cadastral Target Telemetry HUD Box */}
      <Paper
        elevation={0}
        sx={{
          position: 'absolute',
          top: 44,
          left: 14,
          bgcolor: 'rgba(10, 12, 16, 0.94)',
          backdropFilter: 'blur(16px)',
          border: '1px solid #232732',
          borderLeft: '3px solid #d97706',
          borderRadius: 1,
          px: 1.8,
          py: 1,
          zIndex: 10,
          boxShadow: '0 4px 24px rgba(0,0,0,0.7)',
        }}
      >
        <Stack direction="row" spacing={2.5} alignItems="center" flexWrap="wrap">
          <Box>
            <Typography variant="caption" sx={{ color: '#71717a', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.62rem' }}>
              TARGET CADASTRE
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#fbbf24', fontFamily: 'monospace', fontSize: '0.92rem' }}>
              {selectedParcel.surveyNo} &bull; {selectedParcel.khasraNo}
            </Typography>
          </Box>

          <Box sx={{ borderLeft: '1px solid #232732', pl: 1.8 }}>
            <Typography variant="caption" sx={{ color: '#71717a', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.62rem' }}>
              PRIMARY TENURE HOLDER
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#f4f4f5', fontSize: '0.8rem' }}>
              {selectedParcel.owner}
            </Typography>
          </Box>

          <Box sx={{ borderLeft: '1px solid #232732', pl: 1.8 }}>
            <Typography variant="caption" sx={{ color: '#71717a', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.62rem' }}>
              EXTENT &amp; VALUATION
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 800, color: '#f4f4f5', fontSize: '0.8rem', fontFamily: 'monospace' }}>
              {selectedParcel.areaAcres} Ac &bull; ₹{selectedParcel.estimatedCostCr.toFixed(2)} Cr
            </Typography>
          </Box>

          <Chip
            label={selectedParcel.acquisitionStatus.replace('_', ' ').toUpperCase()}
            size="small"
            sx={{
              height: 20,
              fontSize: '0.62rem',
              fontWeight: 800,
              letterSpacing: 0.5,
              bgcolor: `${statusColors[selectedParcel.acquisitionStatus]}15`,
              color: statusColors[selectedParcel.acquisitionStatus],
              border: `1px solid ${statusColors[selectedParcel.acquisitionStatus]}45`,
              borderRadius: 0.5,
            }}
          />
        </Stack>
      </Paper>

      {/* Floating Dynamic Coordinates Readout HUD (Top Right) */}
      <Box
        sx={{
          position: 'absolute',
          top: 44,
          right: 14,
          bgcolor: 'rgba(10, 12, 16, 0.94)',
          backdropFilter: 'blur(16px)',
          border: '1px solid #232732',
          borderRadius: 1,
          px: 1.5,
          py: 0.8,
          zIndex: 10,
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Box>
            <Typography variant="caption" sx={{ color: '#71717a', fontFamily: 'monospace', fontSize: '0.65rem', display: 'block' }}>
              CURSOR RETICLE WGS84
            </Typography>
            <Typography variant="caption" sx={{ color: '#38bdf8', fontFamily: 'monospace', fontSize: '0.72rem', fontWeight: 800 }}>
              {geoTelemetry.lat} {geoTelemetry.lon}
            </Typography>
          </Box>
          <Box sx={{ borderLeft: '1px solid #232732', pl: 1.5 }}>
            <Typography variant="caption" sx={{ color: '#71717a', fontFamily: 'monospace', fontSize: '0.65rem', display: 'block' }}>
              ELEVATION / GRID
            </Typography>
            <Typography variant="caption" sx={{ color: '#fbbf24', fontFamily: 'monospace', fontSize: '0.72rem', fontWeight: 800 }}>
              {geoTelemetry.elevation} &bull; {geoTelemetry.utm}
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Multi-Spectral Sensor Band Selector (Upper Right Below HUD) */}
      <Paper
        elevation={0}
        sx={{
          position: 'absolute',
          top: 96,
          right: 14,
          bgcolor: 'rgba(10, 12, 16, 0.94)',
          backdropFilter: 'blur(16px)',
          border: '1px solid #232732',
          borderRadius: 1,
          p: 0.5,
          zIndex: 10,
        }}
      >
        <Stack direction="row" spacing={0.5}>
          {[
            { id: 'optical', label: 'OPTICAL RECON', icon: <Visibility sx={{ fontSize: 13 }} /> },
            { id: 'sar', label: 'SAR InSAR RADAR', icon: <Sensors sx={{ fontSize: 13 }} /> },
            { id: 'ndvi', label: 'NDVI INFRARED', icon: <Layers sx={{ fontSize: 13 }} /> },
            { id: 'lidar', label: 'LiDAR 3D TOPO', icon: <Terrain sx={{ fontSize: 13 }} /> },
            { id: 'cadastral', label: 'DGPS VECTORS', icon: <Straighten sx={{ fontSize: 13 }} /> },
          ].map((band) => (
            <Button
              key={band.id}
              size="small"
              startIcon={band.icon}
              onClick={() => setActiveBand(band.id as SensorBand)}
              sx={{
                fontSize: '0.62rem',
                fontWeight: 800,
                fontFamily: 'monospace',
                letterSpacing: 0.5,
                py: 0.4,
                px: 1,
                bgcolor: activeBand === band.id ? '#f59e0b' : 'transparent',
                color: activeBand === band.id ? '#090a0d' : '#94a3b8',
                '&:hover': {
                  bgcolor: activeBand === band.id ? '#d97706' : '#1a1d24',
                  color: '#f8fafc',
                },
              }}
            >
              {band.label}
            </Button>
          ))}
        </Stack>
      </Paper>

      {/* Left Tactical Toolbar */}
      <Stack
        spacing={0.5}
        sx={{
          position: 'absolute',
          top: 112,
          left: 14,
          zIndex: 10,
          bgcolor: 'rgba(10, 12, 16, 0.94)',
          backdropFilter: 'blur(12px)',
          border: '1px solid #232732',
          borderRadius: 1,
          p: 0.5,
        }}
      >
        <Tooltip title="Zoom In (+)" placement="right">
          <IconButton size="small" onClick={() => setZoom((z) => Math.min(z + 0.25, 3.0))} sx={{ color: '#94a3b8', '&:hover': { color: '#f8fafc', bgcolor: '#1e232d' } }}>
            <ZoomIn fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Zoom Out (-)" placement="right">
          <IconButton size="small" onClick={() => setZoom((z) => Math.max(z - 0.25, 0.6))} sx={{ color: '#94a3b8', '&:hover': { color: '#f8fafc', bgcolor: '#1e232d' } }}>
            <ZoomOut fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Reset Viewport &amp; Framing" placement="right">
          <IconButton
            size="small"
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
            sx={{ color: '#94a3b8', '&:hover': { color: '#f8fafc', bgcolor: '#1e232d' } }}
          >
            <CropFree fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Center on Selected Parcel Target" placement="right">
          <IconButton size="small" onClick={recenterActiveParcel} sx={{ color: '#fbbf24', '&:hover': { color: '#f8fafc', bgcolor: '#1e232d' } }}>
            <MyLocation fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title={measureMode ? 'Deactivate Rangefinder' : 'Activate Laser Rangefinder'} placement="right">
          <IconButton
            size="small"
            onClick={() => {
              setMeasureMode(!measureMode);
              if (measureMode) setMeasurePoints([]);
            }}
            sx={{
              color: measureMode ? '#38bdf8' : '#52525b',
              bgcolor: measureMode ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
              '&:hover': { color: '#f8fafc', bgcolor: '#1e232d' },
            }}
          >
            <Straighten fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title={radarSweep ? 'Disable Radar Scanline' : 'Enable Radar Scanline'} placement="right">
          <IconButton
            size="small"
            onClick={() => setRadarSweep(!radarSweep)}
            sx={{ color: radarSweep ? '#10b981' : '#52525b', '&:hover': { color: '#f8fafc', bgcolor: '#1e232d' } }}
          >
            <Radar fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Toggle Topo Contours" placement="right">
          <IconButton
            size="small"
            onClick={() => setShowContours(!showContours)}
            sx={{ color: showContours ? '#f59e0b' : '#52525b', '&:hover': { color: '#f8fafc', bgcolor: '#1e232d' } }}
          >
            <Layers fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Toggle DGPS Geodetic Grid" placement="right">
          <IconButton
            size="small"
            onClick={() => setShowGrid(!showGrid)}
            sx={{ color: showGrid ? '#38bdf8' : '#52525b', '&:hover': { color: '#f8fafc', bgcolor: '#1e232d' } }}
          >
            <Explore fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Laser Rangefinder Telemetry Box */}
      {measureMode && (
        <Paper
          elevation={0}
          sx={{
            position: 'absolute',
            bottom: 60,
            left: 14,
            bgcolor: 'rgba(8, 10, 14, 0.95)',
            border: '1px solid #38bdf8',
            borderRadius: 1,
            p: 1.5,
            zIndex: 11,
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box>
              <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 800, fontFamily: 'monospace', fontSize: '0.65rem' }}>
                LASER RANGEFINDER &bull; {measurePoints.length} WAYPOINTS
              </Typography>
              <Typography variant="subtitle1" sx={{ color: '#f8fafc', fontWeight: 900, fontFamily: 'monospace', fontSize: '1rem' }}>
                {totalMeasuredMeters > 0 ? `${totalMeasuredMeters.toFixed(1)} Meters` : 'Click on map to drop points'}
              </Typography>
            </Box>
            {measurePoints.length > 0 && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<Clear fontSize="small" />}
                onClick={() => setMeasurePoints([])}
                sx={{ color: '#ef4444', borderColor: '#ef4444', fontSize: '0.65rem', py: 0.2 }}
              >
                Reset
              </Button>
            )}
          </Stack>
        </Paper>
      )}

      {/* Encroachment Warning Banner in 2023 Epoch */}
      {satelliteEpoch === '2023' && (
        <Paper
          elevation={0}
          sx={{
            position: 'absolute',
            top: 144,
            right: 14,
            bgcolor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #ef4444',
            borderRadius: 1,
            p: 1.2,
            zIndex: 10,
            maxWidth: 320,
          }}
        >
          <Typography variant="caption" sx={{ color: '#f87171', fontWeight: 800, display: 'block', fontSize: '0.68rem', letterSpacing: 0.5 }}>
            TEMPORAL ANOMALY DETECTED (2023 PASS)
          </Typography>
          <Typography variant="caption" sx={{ color: '#fecaca', fontSize: '0.7rem', display: 'block', mt: 0.3 }}>
            Unlicensed masonry shed erected on Survey 143/1 post Section 3A publication. Flagged for demolition without compensation under Sec 28(4).
          </Typography>
        </Paper>
      )}

      {/* SVG Canvas Workspace */}
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <svg
          ref={svgRef}
          viewBox="0 0 900 660"
          style={{
            width: '100%',
            height: '100%',
            maxHeight: '700px',
          }}
        >
          <defs>
            {/* DGPS Grid Pattern */}
            <pattern id="spaceGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="1.2" fill="#252b36" />
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#141820" strokeWidth="0.8" />
            </pattern>

            {/* InSAR Radar Interferometric Fringes Pattern */}
            <pattern id="sarFringes" width="40" height="40" patternTransform="rotate(25 0 0)" patternUnits="userSpaceOnUse">
              <rect width="40" height="10" fill="#0284c7" opacity="0.18" />
              <rect y="10" width="40" height="10" fill="#10b981" opacity="0.18" />
              <rect y="20" width="40" height="10" fill="#f59e0b" opacity="0.18" />
              <rect y="30" width="40" height="10" fill="#ef4444" opacity="0.18" />
            </pattern>

            {/* NDVI Infrared False-Color Crop Pattern */}
            <pattern id="ndviPattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="#7f1d1d" opacity="0.45" />
              <circle cx="10" cy="10" r="6" fill="#b91c1c" opacity="0.35" />
            </pattern>

            {/* Cadastre Parcel Hatch Patterns */}
            <pattern id="amberHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="8" stroke="#d97706" strokeWidth="1.4" opacity="0.4" />
            </pattern>
            <pattern id="redHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="8" stroke="#ef4444" strokeWidth="1.2" opacity="0.3" />
            </pattern>
            <pattern id="greenHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="8" stroke="#10b981" strokeWidth="1.2" opacity="0.3" />
            </pattern>

            {/* Deep Space Vignette */}
            <radialGradient id="spaceVignette" cx="50%" cy="45%" r="65%">
              <stop offset="0%" stopColor="#0c0e14" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#06070a" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#020304" stopOpacity="1" />
            </radialGradient>
          </defs>

          {/* Background Canvas */}
          <rect width="900" height="660" fill="url(#spaceVignette)" />

          {/* DGPS Coordinates Grid */}
          {showGrid && <rect width="900" height="660" fill="url(#spaceGrid)" />}

          {/* Multi-Spectral Sensor Visualizations */}
          {activeBand === 'sar' && (
            <rect width="900" height="660" fill="url(#sarFringes)" />
          )}

          {activeBand === 'ndvi' && (
            <g>
              <rect width="900" height="660" fill="url(#ndviPattern)" />
              <text x="30" y="80" fill="#f87171" fontSize="10" fontFamily="monospace" fontWeight="800">
                SPECTRAL BAND B8 (842nm) / B4 (665nm) &bull; VEGETATION INDEX NDVI &gt; 0.68
              </text>
            </g>
          )}

          {/* Precision Crosshair Corner Brackets */}
          <g stroke="#2f3744" strokeWidth="1.2" opacity="0.8">
            <path d="M 25 35 L 50 35 M 35 25 L 35 50" />
            <path d="M 850 35 L 875 35 M 865 25 L 865 50" />
            <path d="M 25 625 L 50 625 M 35 610 L 35 635" />
            <path d="M 850 625 L 875 625 M 865 610 L 865 635" />
          </g>

          {/* Topographical LiDAR Isoclines */}
          {showContours && (
            <g stroke="#262c37" strokeWidth="0.85" fill="none" opacity="0.85">
              <path d="M 30 110 Q 200 30 450 100 T 870 70" />
              <path d="M 20 170 Q 220 80 480 150 T 880 130" />
              <path d="M 50 240 Q 260 150 520 220 T 860 210" stroke="#323a49" />
              <text x="60" y="235" fill="#4b5563" fontSize="9" fontFamily="monospace">350m MSL</text>
              <path d="M 30 330 Q 280 220 550 300 T 880 280" />
              <path d="M 40 420 Q 300 310 580 390 T 870 370" strokeWidth="1.3" stroke="#3b4457" />
              <text x="50" y="415" fill="#64748b" fontSize="10" fontFamily="monospace" fontWeight="700">380m INDEX CONTOUR</text>
              <path d="M 20 500 Q 330 410 620 480 T 880 460" />
              <path d="M 50 580 Q 350 490 650 570 T 860 550" />

              {/* Central Elevation Ridge */}
              <ellipse cx="440" cy="270" rx="145" ry="95" stroke="#323a49" strokeDasharray="4 4" />
              <ellipse cx="440" cy="270" rx="105" ry="65" stroke="#384253" />
              <ellipse cx="440" cy="270" rx="65" ry="38" stroke="#d97706" strokeWidth="1.2" opacity="0.75" />
              <text x="415" y="274" fill="#fbbf24" fontSize="9" fontFamily="monospace" fontWeight="700">RIDGE +412.5m</text>
            </g>
          )}

          {/* Infrastructure Alignment Corridor (Highway RoW) */}
          <g>
            <path
              d={layout?.alignmentPathD || "M 20 490 L 220 420 L 450 360 L 680 250 L 880 190"}
              stroke="#0284c7"
              strokeWidth={satelliteEpoch === '2020' ? '4' : '16'}
              strokeOpacity={satelliteEpoch === '2020' ? '0.1' : '0.22'}
              fill="none"
            />
            <path
              d={layout?.alignmentDashPathD || "M 20 490 L 220 420 L 450 360 L 680 250 L 880 190"}
              stroke="#38bdf8"
              strokeWidth="2.2"
              strokeDasharray="8 6"
              fill="none"
            />
            <text x="560" y="240" fill="#38bdf8" fontSize="10" fontWeight="800" fontFamily="monospace" letterSpacing="0.8">
              {layout?.alignmentLabel || "ALIGNMENT ROW: 60M GAZETTED CORRIDOR"}
            </text>

            {/* Dynamic Chainage Markers along Highway Alignment */}
            {layout?.chainageMarkers?.map((marker, mIdx) => (
              <g key={mIdx}>
                <circle cx={marker.x} cy={marker.y} r="3.5" fill="#38bdf8" stroke="#0f172a" strokeWidth="1" />
                <rect x={marker.x - 30} y={marker.y - 18} width="60" height="15" rx="3" fill="#0f172a" stroke="#0284c7" strokeWidth="1" opacity="0.92" />
                <text x={marker.x} y={marker.y - 7} textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="800" fontFamily="monospace">
                  {marker.km}
                </text>
              </g>
            ))}
          </g>

          {/* Temporal Encroachment Shed in 2023/2026 */}
          {satelliteEpoch !== '2020' && (
            <g>
              <rect x="340" y="340" width="36" height="24" fill="#ef4444" fillOpacity="0.4" stroke="#ef4444" strokeWidth="1.5" />
              <text x="358" y="356" textAnchor="middle" fill="#fecaca" fontSize="8" fontWeight="800" fontFamily="monospace">SHED</text>
            </g>
          )}

          {/* Cadastral Land Parcels */}
          {parcels.map((parcel, idx) => {
            const isSelected = selectedParcel.id === parcel.id;
            const isHovered = hoveredParcel?.id === parcel.id;
            const color = statusColors[parcel.acquisitionStatus];

            const pointsMap = [
              "240,160 410,140 430,280 230,290",
              "410,140 600,120 620,260 430,280",
              "230,290 430,280 440,430 210,440",
              "430,280 620,260 630,410 440,430",
              "620,260 820,230 830,380 630,410",
              "210,440 440,430 450,580 190,590",
            ];
            const polyPoints = parcel.points || pointsMap[idx % pointsMap.length];

            return (
              <g
                key={parcel.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectParcel(parcel);
                }}
                onMouseEnter={() => setHoveredParcel(parcel)}
                onMouseLeave={() => setHoveredParcel(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Boundary Polygon */}
                <polygon
                  points={polyPoints}
                  fill={
                    isSelected
                      ? 'url(#amberHatch)'
                      : parcel.acquisitionStatus === 'disputed'
                      ? 'url(#redHatch)'
                      : parcel.acquisitionStatus === 'acquired'
                      ? 'url(#greenHatch)'
                      : color
                  }
                  fillOpacity={isSelected ? 1 : isHovered ? 0.28 : 0.12}
                  stroke={isSelected ? '#f59e0b' : isHovered ? '#38bdf8' : color}
                  strokeWidth={isSelected ? 3.2 : isHovered ? 2.4 : 1.4}
                  strokeDasharray={parcel.acquisitionStatus === 'disputed' ? '5 3' : undefined}
                />

                {/* Selected Parcel Holographic Targeting Reticle */}
                {isSelected && (
                  <g stroke="#f59e0b" strokeWidth="1.4" fill="none">
                    <circle cx={parcel.center.x} cy={parcel.center.y} r="20" strokeDasharray="4 4" opacity="0.85" />
                    <line x1={parcel.center.x - 28} y1={parcel.center.y} x2={parcel.center.x + 28} y2={parcel.center.y} opacity="0.7" />
                    <line x1={parcel.center.x} y1={parcel.center.y - 28} x2={parcel.center.x} y2={parcel.center.y + 28} opacity="0.7" />
                    {/* Reticle Corner Ticks */}
                    <path d={`M ${parcel.center.x - 14} ${parcel.center.y - 22} L ${parcel.center.x - 22} ${parcel.center.y - 22} L ${parcel.center.x - 22} ${parcel.center.y - 14}`} />
                    <path d={`M ${parcel.center.x + 14} ${parcel.center.y - 22} L ${parcel.center.x + 22} ${parcel.center.y - 22} L ${parcel.center.x + 22} ${parcel.center.y - 14}`} />
                    <path d={`M ${parcel.center.x - 14} ${parcel.center.y + 22} L ${parcel.center.x - 22} ${parcel.center.y + 22} L ${parcel.center.x - 22} ${parcel.center.y + 14}`} />
                    <path d={`M ${parcel.center.x + 14} ${parcel.center.y + 22} L ${parcel.center.x + 22} ${parcel.center.y + 22} L ${parcel.center.x + 22} ${parcel.center.y + 14}`} />
                  </g>
                )}

                {/* Center Node */}
                <circle
                  cx={parcel.center.x}
                  cy={parcel.center.y}
                  r={isSelected ? 5 : 3.5}
                  fill={isSelected ? '#f59e0b' : color}
                />

                {/* Label Badges */}
                <text
                  x={parcel.center.x}
                  y={parcel.center.y - 12}
                  textAnchor="middle"
                  fill={isSelected ? '#f8fafc' : '#cbd5e1'}
                  fontSize={isSelected ? '12' : '10'}
                  fontWeight={isSelected ? '800' : '600'}
                  fontFamily="monospace"
                  letterSpacing="0.5"
                >
                  {parcel.surveyNo}
                </text>
                <text
                  x={parcel.center.x}
                  y={parcel.center.y + 18}
                  textAnchor="middle"
                  fill={isSelected ? '#f59e0b' : '#71717a'}
                  fontSize="9.5"
                  fontFamily="monospace"
                  fontWeight="700"
                >
                  {parcel.areaAcres} Ac &bull; {parcel.khasraNo}
                </text>
              </g>
            );
          })}

          {/* Laser Rangefinder Visual Lines */}
          {measurePoints.map((pt, i) => (
            <g key={i}>
              <circle cx={pt.x} cy={pt.y} r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
              <text x={pt.x + 8} y={pt.y - 6} fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="800">
                P{i + 1}
              </text>
              {i > 0 && (
                <line
                  x1={measurePoints[i - 1].x}
                  y1={measurePoints[i - 1].y}
                  x2={pt.x}
                  y2={pt.y}
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                />
              )}
            </g>
          ))}

          {/* Animated Orbital Radar Sweep Line */}
          {radarSweep && (
            <g>
              <line x1="0" y1={cursorPos.y} x2="900" y2={cursorPos.y} stroke="#10b981" strokeWidth="0.8" strokeOpacity="0.4" />
              <line x1={cursorPos.x} y1="0" x2={cursorPos.x} y2="660" stroke="#10b981" strokeWidth="0.8" strokeOpacity="0.4" />
              <circle cx={cursorPos.x} cy={cursorPos.y} r="32" stroke="#10b981" strokeWidth="0.8" strokeOpacity="0.5" strokeDasharray="3 3" fill="none" />
            </g>
          )}
        </svg>
      </Box>

      {/* Floating Bottom Scale & Temporal Time Scrubber */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 14,
          left: 14,
          right: 14,
          bgcolor: 'rgba(10, 12, 16, 0.95)',
          backdropFilter: 'blur(16px)',
          border: '1px solid #232732',
          borderRadius: 1,
          px: 2,
          py: 0.8,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        {/* Status Legend */}
        <Stack direction="row" spacing={2.5} alignItems="center">
          <Typography variant="caption" sx={{ color: '#71717a', fontFamily: 'monospace', fontSize: '0.65rem', fontWeight: 800 }}>
            CADASTRE 1:5000 &bull; DGPS RTK ±2CM
          </Typography>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
              <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#10b981' }} />
              <Typography variant="caption" sx={{ fontSize: '0.65rem', color: '#a1a1aa', fontWeight: 600 }}>Sec 3E Acquired</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
              <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#f59e0b' }} />
              <Typography variant="caption" sx={{ fontSize: '0.65rem', color: '#a1a1aa', fontWeight: 600 }}>CALA Pending</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
              <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#ef4444' }} />
              <Typography variant="caption" sx={{ fontSize: '0.65rem', color: '#a1a1aa', fontWeight: 600 }}>Litigation</Typography>
            </Box>
          </Stack>
        </Stack>

        {/* Temporal Satellite Epoch Scrubber */}
        <Stack direction="row" spacing={1.2} alignItems="center">
          <History sx={{ fontSize: 15, color: '#f59e0b' }} />
          <Typography variant="caption" sx={{ color: '#71717a', fontWeight: 800, fontSize: '0.65rem', fontFamily: 'monospace' }}>
            SATELLITE EPOCH:
          </Typography>
          {(['2020', '2023', '2026'] as const).map((epoch) => (
            <Chip
              key={epoch}
              label={epoch === '2026' ? '2026 (CURRENT)' : epoch}
              size="small"
              onClick={() => setSatelliteEpoch(epoch)}
              sx={{
                height: 20,
                fontSize: '0.62rem',
                fontWeight: 800,
                fontFamily: 'monospace',
                cursor: 'pointer',
                bgcolor: satelliteEpoch === epoch ? '#f59e0b' : '#14171f',
                color: satelliteEpoch === epoch ? '#090a0d' : '#94a3b8',
                border: satelliteEpoch === epoch ? '1px solid #f59e0b' : '1px solid #232732',
                borderRadius: 0.5,
              }}
            />
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
