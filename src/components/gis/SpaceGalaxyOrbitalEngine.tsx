import React, { useRef, useEffect, useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Stack,
  IconButton,
  Chip,
  Tooltip,
  Paper,
  Button,
  ButtonGroup,
  Divider,
} from '@mui/material';
import {
  RotateRight,
  MyLocation,
  Sensors,
  Public,
  Layers,
} from '@mui/icons-material';
import { ProjectRow } from '@/data/inventoryData';

export interface SatelliteData {
  id: string;
  name: string;
  agency: string;
  altitudeKm: number;
  velocityKms: number;
  inclinationDeg: number;
  sensorType: string;
  resolutionM: string;
  color: string;
  radiusFactor: number;
  speedFactor: number;
  phaseOffset: number;
}

export const SATELLITES: SatelliteData[] = [
  {
    id: 'cartosat-3',
    name: 'ISRO CARTOSAT-3',
    agency: 'ISRO / NRSC',
    altitudeKm: 505.4,
    velocityKms: 7.56,
    inclinationDeg: 97.5,
    sensorType: 'Panchromatic / Multi-Spectral 0.28m PAN',
    resolutionM: '0.28m',
    color: '#38bdf8',
    radiusFactor: 1.32,
    speedFactor: 1.0,
    phaseOffset: 0.2,
  },
  {
    id: 'sentinel-2a',
    name: 'SENTINEL-2A L2A',
    agency: 'ESA / Copernicus',
    altitudeKm: 786.0,
    velocityKms: 7.45,
    inclinationDeg: 98.6,
    sensorType: '13-Band Multi-Spectral MSI (Red-Edge / SWIR)',
    resolutionM: '10.0m',
    color: '#10b981',
    radiusFactor: 1.48,
    speedFactor: 0.85,
    phaseOffset: 1.8,
  },
  {
    id: 'risat-2br1',
    name: 'ISRO RISAT-2BR1',
    agency: 'ISRO / MoD',
    altitudeKm: 576.0,
    velocityKms: 7.52,
    inclinationDeg: 37.0,
    sensorType: 'X-Band Synthetic Aperture Radar (SAR InSAR)',
    resolutionM: '0.35m',
    color: '#f59e0b',
    radiusFactor: 1.36,
    speedFactor: 1.05,
    phaseOffset: 3.4,
  },
  {
    id: 'gisat-1',
    name: 'ISRO GISAT-1 / EOS-03',
    agency: 'ISRO Earth Obs',
    altitudeKm: 35786.0,
    velocityKms: 3.07,
    inclinationDeg: 4.5,
    sensorType: 'Continuous Geostationary Optical & Hyper-spectral',
    resolutionM: '42.0m',
    color: '#ec4899',
    radiusFactor: 1.95,
    speedFactor: 0.35,
    phaseOffset: 4.9,
  },
];

// Major ground telemetry stations and project coordinates across India (Lat, Lon in degrees)
export const GROUND_BEACONS = [
  { id: 'NHAI-DEL-MUM-P4', name: 'Delhi-Mumbai Expressway Pkg 4', state: 'Gujarat', lat: 22.3, lon: 73.2, color: '#ef4444' },
  { id: 'JJM-UP-BUND-08', name: 'Bundelkhand Water Pipeline Pkg 8', state: 'Uttar Pradesh', lat: 25.4, lon: 80.3, color: '#38bdf8' },
  { id: 'DFCCIL-EDFC-PKG-201', name: 'Eastern DFC Khurja-Ludhiana', state: 'Uttar Pradesh', lat: 28.5, lon: 77.8, color: '#f59e0b' },
  { id: 'PGCIL-HVDC-RAIGARH', name: 'Raigarh-Pugalur 800kV HVDC', state: 'Chhattisgarh', lat: 21.9, lon: 83.4, color: '#10b981' },
  { id: 'NHAI-BLR-CHE-EXP-02', name: 'Bengaluru-Chennai Expressway', state: 'Karnataka', lat: 12.9, lon: 77.9, color: '#a855f7' },
  { id: 'NHAI-VR-EXP-PKG-01', name: 'Varanasi-Kolkata Expressway', state: 'Jharkhand', lat: 23.3, lon: 85.3, color: '#f97316' },
  { id: 'MMRDA-MUM-LINE-4', name: 'Mumbai Metro Line 4', state: 'Maharashtra', lat: 19.1, lon: 72.9, color: '#06b6d4' },
];

export const STATE_COORDINATES: Record<string, { lat: number; lon: number }> = {
  'Gujarat': { lat: 22.3, lon: 71.8 },
  'Maharashtra': { lat: 19.4, lon: 74.5 },
  'Uttar Pradesh': { lat: 26.8, lon: 80.9 },
  'Karnataka': { lat: 14.5, lon: 75.8 },
  'Tamil Nadu': { lat: 11.1, lon: 78.6 },
  'Rajasthan': { lat: 26.9, lon: 73.8 },
  'Madhya Pradesh': { lat: 23.2, lon: 77.4 },
  'West Bengal': { lat: 23.5, lon: 87.8 },
  'Bihar': { lat: 25.6, lon: 85.1 },
  'Andhra Pradesh': { lat: 15.9, lon: 79.7 },
  'Telangana': { lat: 17.8, lon: 79.1 },
  'Kerala': { lat: 10.5, lon: 76.4 },
  'Punjab': { lat: 31.1, lon: 75.3 },
  'Haryana': { lat: 29.0, lon: 76.1 },
  'Delhi': { lat: 28.6, lon: 77.2 },
  'Assam': { lat: 26.2, lon: 92.9 },
  'Odisha': { lat: 20.5, lon: 84.8 },
  'Jharkhand': { lat: 23.6, lon: 85.3 },
  'Chhattisgarh': { lat: 21.3, lon: 81.9 },
  'Uttarakhand': { lat: 30.1, lon: 79.0 },
  'Himachal Pradesh': { lat: 31.8, lon: 77.2 },
  'Jammu and Kashmir': { lat: 33.8, lon: 74.8 },
  'Goa': { lat: 15.3, lon: 74.1 },
  'Tripura': { lat: 23.8, lon: 91.3 },
  'Meghalaya': { lat: 25.5, lon: 91.4 },
  'Manipur': { lat: 24.8, lon: 93.9 },
  'Nagaland': { lat: 26.1, lon: 94.5 },
  'Arunachal Pradesh': { lat: 28.1, lon: 94.6 },
  'Mizoram': { lat: 23.2, lon: 92.8 },
  'Sikkim': { lat: 27.5, lon: 88.5 },
};

// Simplified polygon outline of the Indian Subcontinent for 3D Globe vector projection
const INDIA_COASTLINE_COORDS: [number, number][] = [
  [35.0, 74.5], [34.5, 77.5], [32.5, 78.5], [30.5, 80.0], [27.5, 88.0],
  [27.8, 89.5], [27.0, 92.0], [28.0, 96.0], [26.0, 97.0], [24.0, 93.5],
  [22.5, 89.5], [21.5, 87.0], [19.5, 85.0], [17.5, 83.0], [15.5, 80.2],
  [13.0, 80.3], [10.0, 79.8], [8.1, 77.5],  [9.5, 76.2],  [12.0, 75.0],
  [15.0, 73.8], [19.0, 72.8], [21.0, 72.6], [20.8, 70.4], [22.4, 69.0],
  [23.5, 68.2], [24.5, 71.0], [27.5, 70.0], [30.5, 73.5], [32.5, 74.5],
  [35.0, 74.5]
];

// Asian continental reference lines for context
const ASIA_LANDMASS_COORDS: [number, number][] = [
  [1.3, 103.8], [6.0, 102.0], [10.0, 105.0], [15.0, 108.0], [22.0, 114.0],
  [30.0, 122.0], [38.0, 120.0], [42.0, 130.0], [45.0, 100.0], [40.0, 70.0],
  [30.0, 50.0], [25.0, 57.0], [25.0, 62.0], [24.5, 68.0]
];

interface SpaceGalaxyOrbitalEngineProps {
  activeProject?: ProjectRow;
  onSelectProject?: (projectId: string) => void;
  onSwitchToCadastral?: () => void;
}

export default function SpaceGalaxyOrbitalEngine({
  activeProject,
  onSelectProject,
  onSwitchToCadastral,
}: SpaceGalaxyOrbitalEngineProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Dynamic ground beacons including activeProject
  const computedGroundBeacons = useMemo(() => {
    const list = [...GROUND_BEACONS];
    if (activeProject) {
      const exists = list.some((b) => b.id === activeProject.id);
      if (!exists) {
        const coords = STATE_COORDINATES[activeProject.state] || { lat: 22.0, lon: 78.0 };
        list.push({
          id: activeProject.id,
          name: activeProject.name,
          state: activeProject.state,
          lat: coords.lat,
          lon: coords.lon,
          color: '#f43f5e',
        });
      }
    }
    return list;
  }, [activeProject]);

  // Clickable items screen tracker
  const clickableItemsRef = useRef<{ id: string; type: 'sat' | 'beacon'; x: number; y: number }[]>([]);

  // Active satellite selection
  const [selectedSatellite, setSelectedSatellite] = useState<SatelliteData>(SATELLITES[0]);
  const [sensorBand, setSensorBand] = useState<'optical' | 'sar' | 'lidar' | 'ndvi' | 'thermal'>('optical');
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [laserBeamActive, setLaserBeamActive] = useState<boolean>(true);

  // 3D Camera State: Yaw (theta), Pitch (phi), Zoom
  const [camera, setCamera] = useState({
    yaw: -1.3, // Centered on India (~75°E)
    pitch: 0.35, // Looking slightly downward onto Northern Hemisphere
    zoom: 1.0, // Scale factor
  });

  // Mouse Interaction State
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const cameraRef = useRef(camera);
  cameraRef.current = camera;

  // Live telemetry clock
  const [telemetryClock, setTelemetryClock] = useState({
    utc: '',
    ist: '',
    etaSeconds: 142,
    dopplerShiftKhz: '+4.82',
  });

  // Generate 800 deep cosmic space galaxy stars once
  const galaxyStars = useMemo(() => {
    const stars = [];
    for (let i = 0; i < 900; i++) {
      const radius = 250 + Math.random() * 650;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      const size = Math.random() < 0.08 ? 2.5 : Math.random() < 0.25 ? 1.8 : 1.0;
      const baseAlpha = 0.3 + Math.random() * 0.7;
      const twinkleSpeed = 0.002 + Math.random() * 0.005;
      const hue = Math.random() < 0.2 ? 210 : Math.random() < 0.1 ? 45 : 0;
      stars.push({ radius, theta, phi, size, baseAlpha, twinkleSpeed, hue });
    }
    return stars;
  }, []);

  // Update real-time mission clock
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTelemetryClock((prev) => ({
        utc: now.toISOString().substring(11, 19) + ' UTC',
        ist: now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST',
        etaSeconds: prev.etaSeconds > 1 ? prev.etaSeconds - 1 : 180,
        dopplerShiftKhz: (4.82 + Math.sin(Date.now() / 1500) * 1.4).toFixed(2),
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Main 60fps 3D Space Galaxy Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const render = () => {
      time += 0.015 * speedMultiplier;

      // Handle auto-rotation
      if (autoRotate && !isDraggingRef.current) {
        setCamera((prev) => ({
          ...prev,
          yaw: prev.yaw + 0.0018 * speedMultiplier,
        }));
      }

      // Responsive canvas sizing
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      const centerX = width / 2;
      const centerY = height / 2;
      const currentCamera = cameraRef.current;
      const earthRadius = 175 * currentCamera.zoom;

      clickableItemsRef.current = [];

      ctx.clearRect(0, 0, width, height);

      // 1. DEEP COSMIC SPACE GALAXY BACKGROUND
      const spaceGrad = ctx.createRadialGradient(centerX, centerY, 50, centerX, centerY, Math.max(width, height) * 0.85);
      spaceGrad.addColorStop(0, '#040d1a');
      spaceGrad.addColorStop(0.4, '#020712');
      spaceGrad.addColorStop(0.8, '#01040a');
      spaceGrad.addColorStop(1, '#000205');
      ctx.fillStyle = spaceGrad;
      ctx.fillRect(0, 0, width, height);

      // Swirling cosmic nebulae
      const nebula1 = ctx.createRadialGradient(centerX - 180, centerY - 140, 10, centerX - 180, centerY - 140, 320);
      nebula1.addColorStop(0, 'rgba(14, 165, 233, 0.12)');
      nebula1.addColorStop(0.5, 'rgba(99, 102, 241, 0.06)');
      nebula1.addColorStop(1, 'transparent');
      ctx.fillStyle = nebula1;
      ctx.fillRect(0, 0, width, height);

      const nebula2 = ctx.createRadialGradient(centerX + 220, centerY + 160, 20, centerX + 220, centerY + 160, 360);
      nebula2.addColorStop(0, 'rgba(217, 70, 239, 0.08)');
      nebula2.addColorStop(0.6, 'rgba(56, 189, 248, 0.04)');
      nebula2.addColorStop(1, 'transparent');
      ctx.fillStyle = nebula2;
      ctx.fillRect(0, 0, width, height);

      // Twinkling Galaxy Stars
      const nowMs = Date.now();
      for (let i = 0; i < galaxyStars.length; i++) {
        const star = galaxyStars[i];
        const starYaw = star.theta + currentCamera.yaw * 0.15;
        const starPitch = star.phi + currentCamera.pitch * 0.15;
        const x3d = star.radius * Math.cos(starPitch) * Math.sin(starYaw);
        const y3d = -star.radius * Math.sin(starPitch);

        const starX = centerX + x3d * currentCamera.zoom;
        const starY = centerY + y3d * currentCamera.zoom;

        if (starX >= -10 && starX <= width + 10 && starY >= -10 && starY <= height + 10) {
          const alpha = star.baseAlpha + Math.sin(nowMs * star.twinkleSpeed) * 0.25;
          ctx.beginPath();
          ctx.arc(starX, starY, star.size, 0, Math.PI * 2);
          if (star.hue === 210) {
            ctx.fillStyle = `rgba(186, 230, 253, ${Math.max(0.1, alpha)})`;
          } else if (star.hue === 45) {
            ctx.fillStyle = `rgba(254, 240, 138, ${Math.max(0.1, alpha)})`;
          } else {
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, alpha)})`;
          }
          ctx.fill();
        }
      }

      // 3D Coordinate Transformation
      const projectGeoToScreen = (latDeg: number, lonDeg: number, radius: number) => {
        const latRad = (latDeg * Math.PI) / 180;
        const lonRad = (lonDeg * Math.PI) / 180;

        const x0 = radius * Math.cos(latRad) * Math.sin(lonRad + currentCamera.yaw);
        const y0 = -radius * Math.sin(latRad);
        const z0 = radius * Math.cos(latRad) * Math.cos(lonRad + currentCamera.yaw);

        const cosP = Math.cos(currentCamera.pitch);
        const sinP = Math.sin(currentCamera.pitch);
        const y1 = y0 * cosP - z0 * sinP;
        const z1 = y0 * sinP + z0 * cosP;
        const x1 = x0;

        return {
          x: centerX + x1,
          y: centerY + y1,
          z: z1,
          isFront: z1 > 0,
        };
      };

      // 2. 3D EARTH GLOBE
      const atmoGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        earthRadius * 0.95,
        centerX,
        centerY,
        earthRadius * 1.35
      );
      atmoGlow.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
      atmoGlow.addColorStop(0.3, 'rgba(14, 165, 233, 0.15)');
      atmoGlow.addColorStop(0.7, 'rgba(99, 102, 241, 0.05)');
      atmoGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = atmoGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, earthRadius * 1.35, 0, Math.PI * 2);
      ctx.fill();

      const planetGrad = ctx.createRadialGradient(
        centerX - earthRadius * 0.35,
        centerY - earthRadius * 0.35,
        earthRadius * 0.1,
        centerX,
        centerY,
        earthRadius
      );
      planetGrad.addColorStop(0, '#0c4a6e');
      planetGrad.addColorStop(0.4, '#073655');
      planetGrad.addColorStop(0.75, '#041f38');
      planetGrad.addColorStop(1, '#020f1e');
      ctx.fillStyle = planetGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, earthRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(125, 211, 252, 0.6)';
      ctx.stroke();

      // Earth Latitude Parallels
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
      const parallels = [-60, -40, -20, 0, 20, 40, 60];
      for (const lat of parallels) {
        ctx.beginPath();
        let first = true;
        for (let lon = -180; lon <= 180; lon += 6) {
          const pt = projectGeoToScreen(lat, lon, earthRadius);
          if (pt.isFront) {
            if (first) {
              ctx.moveTo(pt.x, pt.y);
              first = false;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          } else {
            first = true;
          }
        }
        ctx.stroke();
      }

      // Earth Longitude Meridians
      for (let lon = -180; lon < 180; lon += 30) {
        ctx.beginPath();
        let first = true;
        for (let lat = -80; lat <= 80; lat += 5) {
          const pt = projectGeoToScreen(lat, lon, earthRadius);
          if (pt.isFront) {
            if (first) {
              ctx.moveTo(pt.x, pt.y);
              first = false;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          } else {
            first = true;
          }
        }
        ctx.stroke();
      }

      // Asian Continental Coastline Reference
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
      ctx.beginPath();
      let firstAsia = true;
      for (const [lat, lon] of ASIA_LANDMASS_COORDS) {
        const pt = projectGeoToScreen(lat, lon, earthRadius);
        if (pt.isFront) {
          if (firstAsia) {
            ctx.moveTo(pt.x, pt.y);
            firstAsia = false;
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        } else {
          firstAsia = true;
        }
      }
      ctx.stroke();

      // Coastline of Indian Subcontinent
      ctx.lineWidth = 2.2;
      ctx.strokeStyle = '#38bdf8';
      ctx.beginPath();
      let firstIndia = true;
      for (const [lat, lon] of INDIA_COASTLINE_COORDS) {
        const pt = projectGeoToScreen(lat, lon, earthRadius);
        if (pt.isFront) {
          if (firstIndia) {
            ctx.moveTo(pt.x, pt.y);
            firstIndia = false;
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        } else {
          firstIndia = true;
        }
      }
      ctx.stroke();
      if (sensorBand === 'ndvi') {
        ctx.fillStyle = 'rgba(34, 197, 94, 0.28)';
      } else if (sensorBand === 'sar') {
        ctx.fillStyle = 'rgba(245, 158, 11, 0.22)';
      } else if (sensorBand === 'lidar') {
        ctx.fillStyle = 'rgba(168, 85, 247, 0.24)';
      } else {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
      }
      ctx.fill();

      // 3. 3D SATELLITE ORBITAL TRAJECTORIES
      const satellitePositions: { sat: SatelliteData; screenX: number; screenY: number; z: number; isFront: boolean }[] = [];

      for (const sat of SATELLITES) {
        const orbitRadius = earthRadius * sat.radiusFactor;
        const incRad = (sat.inclinationDeg * Math.PI) / 180;
        const currentSatAngle = time * sat.speedFactor + sat.phaseOffset;

        ctx.beginPath();
        let firstRing = true;
        for (let a = 0; a <= Math.PI * 2 + 0.1; a += 0.08) {
          const xOrb = orbitRadius * Math.cos(a);
          const yOrb = orbitRadius * Math.sin(a) * Math.sin(incRad);
          const zOrb = orbitRadius * Math.sin(a) * Math.cos(incRad);

          const xRot = xOrb * Math.cos(currentCamera.yaw * 0.3) - zOrb * Math.sin(currentCamera.yaw * 0.3);
          const zRot = xOrb * Math.sin(currentCamera.yaw * 0.3) + zOrb * Math.cos(currentCamera.yaw * 0.3);

          const yFinal = yOrb * Math.cos(currentCamera.pitch) - zRot * Math.sin(currentCamera.pitch);
          const xFinal = xRot;

          const sx = centerX + xFinal;
          const sy = centerY + yFinal;

          if (firstRing) {
            ctx.moveTo(sx, sy);
            firstRing = false;
          } else {
            ctx.lineTo(sx, sy);
          }
        }

        const isSatSelected = sat.id === selectedSatellite.id;
        ctx.lineWidth = isSatSelected ? 1.4 : 0.7;
        ctx.strokeStyle = isSatSelected ? sat.color : 'rgba(148, 163, 184, 0.25)';
        if (isSatSelected) {
          ctx.setLineDash([4, 4]);
        } else {
          ctx.setLineDash([]);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        const satXOrb = orbitRadius * Math.cos(currentSatAngle);
        const satYOrb = orbitRadius * Math.sin(currentSatAngle) * Math.sin(incRad);
        const satZOrb = orbitRadius * Math.sin(currentSatAngle) * Math.cos(incRad);

        const satXRot = satXOrb * Math.cos(currentCamera.yaw * 0.3) - satZOrb * Math.sin(currentCamera.yaw * 0.3);
        const satZRot = satXOrb * Math.sin(currentCamera.yaw * 0.3) + satZOrb * Math.cos(currentCamera.yaw * 0.3);

        const satYFinal = satYOrb * Math.cos(currentCamera.pitch) - satZRot * Math.sin(currentCamera.pitch);
        const satZFinal = satYOrb * Math.sin(currentCamera.pitch) + satZRot * Math.cos(currentCamera.pitch);
        const satXFinal = satXRot;

        const screenX = centerX + satXFinal;
        const screenY = centerY + satYFinal;

        satellitePositions.push({
          sat,
          screenX,
          screenY,
          z: satZFinal,
          isFront: satZFinal > -earthRadius * 0.5,
        });
      }

      // 4. GROUND TARGET BEACONS
      let activeGroundTargetScreen: { x: number; y: number; isFront: boolean } | null = null;

      for (const beacon of computedGroundBeacons) {
        const pt = projectGeoToScreen(beacon.lat, beacon.lon, earthRadius);
        const isCurrentActive = activeProject ? beacon.id === activeProject.id : beacon.id === 'NHAI-DEL-MUM-P4';

        if (isCurrentActive) {
          activeGroundTargetScreen = pt;
        }

        if (pt.isFront) {
          clickableItemsRef.current.push({ id: beacon.id, type: 'beacon', x: pt.x, y: pt.y });

          ctx.beginPath();
          ctx.arc(pt.x, pt.y, isCurrentActive ? 6.5 : 3.5, 0, Math.PI * 2);
          ctx.fillStyle = isCurrentActive ? '#f43f5e' : beacon.color;
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.2;
          ctx.stroke();

          if (isCurrentActive) {
            const pulseRadius = 6 + (nowMs % 1600) * 0.015;
            const pulseAlpha = Math.max(0, 1 - (nowMs % 1600) / 1600);
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, pulseRadius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(244, 63, 94, ${pulseAlpha})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.font = '700 10px monospace';
            ctx.fillText(`● TARGET: ${beacon.id}`, pt.x + 8, pt.y - 6);
            ctx.fillStyle = '#cbd5e1';
            ctx.font = '500 9px sans-serif';
            ctx.fillText(`${beacon.name} (${beacon.state})`, pt.x + 8, pt.y + 7);
          }
        }
      }

      // 5. VOLUMETRIC RECON DOWNLINK LASER BEAM
      const activeSatPos = satellitePositions.find((p) => p.sat.id === selectedSatellite.id);

      if (laserBeamActive && activeSatPos && activeGroundTargetScreen && activeGroundTargetScreen.isFront) {
        const beamGrad = ctx.createLinearGradient(
          activeSatPos.screenX,
          activeSatPos.screenY,
          activeGroundTargetScreen.x,
          activeGroundTargetScreen.y
        );
        beamGrad.addColorStop(0, `${selectedSatellite.color}cc`);
        beamGrad.addColorStop(0.7, `${selectedSatellite.color}40`);
        beamGrad.addColorStop(1, `${selectedSatellite.color}15`);

        ctx.beginPath();
        const normalX = -(activeGroundTargetScreen.y - activeSatPos.screenY);
        const normalY = activeGroundTargetScreen.x - activeSatPos.screenX;
        const len = Math.hypot(normalX, normalY) || 1;
        const nx = normalX / len;
        const ny = normalY / len;

        ctx.moveTo(activeSatPos.screenX, activeSatPos.screenY);
        ctx.lineTo(activeGroundTargetScreen.x - nx * 14, activeGroundTargetScreen.y - ny * 14);
        ctx.lineTo(activeGroundTargetScreen.x + nx * 14, activeGroundTargetScreen.y + ny * 14);
        ctx.closePath();

        ctx.fillStyle = beamGrad;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(activeSatPos.screenX, activeSatPos.screenY);
        ctx.lineTo(activeGroundTargetScreen.x, activeGroundTargetScreen.y);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.lineDashOffset = -(nowMs / 30);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.beginPath();
        ctx.arc(activeGroundTargetScreen.x, activeGroundTargetScreen.y, 16, 0, Math.PI * 2);
        ctx.strokeStyle = selectedSatellite.color;
        ctx.lineWidth = 1.4;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(activeGroundTargetScreen.x, activeGroundTargetScreen.y, 24, 0, Math.PI * 2);
        ctx.strokeStyle = `${selectedSatellite.color}50`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // 6. DRAW SATELLITE CHASSIS & SOLAR WINGS
      for (const pos of satellitePositions) {
        if (!pos.isFront) continue;

        const { sat, screenX, screenY } = pos;
        clickableItemsRef.current.push({ id: sat.id, type: 'sat', x: screenX, y: screenY });
        const isSelected = sat.id === selectedSatellite.id;

        ctx.save();
        ctx.translate(screenX, screenY);

        const busSize = isSelected ? 8 : 5.5;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-busSize / 2, -busSize / 2, busSize, busSize);
        ctx.strokeStyle = sat.color;
        ctx.lineWidth = 1.2;
        ctx.strokeRect(-busSize / 2, -busSize / 2, busSize, busSize);

        const wingW = isSelected ? 14 : 9;
        const wingH = isSelected ? 5 : 3.5;
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(-busSize / 2 - wingW, -wingH / 2, wingW, wingH);
        ctx.strokeStyle = '#38bdf8';
        ctx.strokeRect(-busSize / 2 - wingW, -wingH / 2, wingW, wingH);
        ctx.fillRect(busSize / 2, -wingH / 2, wingW, wingH);
        ctx.strokeRect(busSize / 2, -wingH / 2, wingW, wingH);

        if (isSelected) {
          ctx.beginPath();
          ctx.arc(0, 0, 15, 0, Math.PI * 2);
          ctx.strokeStyle = sat.color;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        ctx.restore();

        ctx.fillStyle = isSelected ? '#ffffff' : 'rgba(226, 232, 240, 0.7)';
        ctx.font = isSelected ? '700 10px monospace' : '500 8.5px monospace';
        ctx.fillText(sat.name, screenX + 16, screenY - 4);
        if (isSelected) {
          ctx.fillStyle = sat.color;
          ctx.font = '600 8.5px monospace';
          ctx.fillText(`${sat.altitudeKm} km • ${sat.velocityKms} km/s`, screenX + 16, screenY + 8);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [
    autoRotate,
    camera,
    galaxyStars,
    laserBeamActive,
    selectedSatellite,
    sensorBand,
    speedMultiplier,
    activeProject,
    computedGroundBeacons,
  ]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    for (const item of clickableItemsRef.current) {
      const dist = Math.hypot(item.x - clickX, item.y - clickY);
      if (dist < 24) {
        if (item.type === 'sat') {
          const sat = SATELLITES.find((s) => s.id === item.id);
          if (sat) setSelectedSatellite(sat);
        } else if (item.type === 'beacon') {
          if (onSelectProject) onSelectProject(item.id);
        }
        break;
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    setCamera((prev) => ({
      ...prev,
      yaw: prev.yaw + dx * 0.006,
      pitch: Math.max(-1.2, Math.min(1.2, prev.pitch + dy * 0.006)),
    }));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setCamera((prev) => ({
      ...prev,
      zoom: Math.max(0.55, Math.min(2.4, prev.zoom + delta)),
    }));
  };

  const handleFocusIndia = () => {
    setCamera({
      yaw: -1.3,
      pitch: 0.35,
      zoom: 1.25,
    });
  };

  const handleResetDeepSpace = () => {
    setCamera({
      yaw: 0,
      pitch: 0.2,
      zoom: 0.85,
    });
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 1.5,
        border: '1px solid #1e293b',
        bgcolor: '#030712',
        color: '#f8fafc',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Precision Orbit HUD Top Banner */}
      <Box
        sx={{
          p: 1.5,
          bgcolor: 'rgba(15, 23, 42, 0.95)',
          borderBottom: '1px solid #1e293b',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={1.5}>
          <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981' }} />
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#38bdf8', fontSize: '0.74rem', fontFamily: 'monospace' }}>
                ORBIT TRACK: {selectedSatellite.name}
              </Typography>
            </Box>

            <Chip
              label={`ALT: ${selectedSatellite.altitudeKm} KM`}
              size="small"
              sx={{ height: 18, fontSize: '0.62rem', fontWeight: 800, bgcolor: '#0f172a', color: '#94a3b8', border: '1px solid #334155', fontFamily: 'monospace' }}
            />
            <Chip
              label={`VEL: ${selectedSatellite.velocityKms} KM/S`}
              size="small"
              sx={{ height: 18, fontSize: '0.62rem', fontWeight: 800, bgcolor: '#0f172a', color: '#94a3b8', border: '1px solid #334155', fontFamily: 'monospace' }}
            />
            <Chip
              label={`INC: ${selectedSatellite.inclinationDeg}° POLAR`}
              size="small"
              sx={{ height: 18, fontSize: '0.62rem', fontWeight: 800, bgcolor: '#0f172a', color: '#38bdf8', border: '1px solid #0284c7', fontFamily: 'monospace' }}
            />
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography variant="caption" sx={{ color: '#cbd5e1', fontSize: '0.68rem', fontFamily: 'monospace' }}>
              PASS ETA: <strong style={{ color: '#f59e0b' }}>{Math.floor(telemetryClock.etaSeconds / 60)}M {telemetryClock.etaSeconds % 60}S</strong>
            </Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.68rem', fontFamily: 'monospace' }}>
              {telemetryClock.ist}
            </Typography>
          </Stack>
        </Stack>
      </Box>

      {/* Main Interactive 3D Canvas Viewport */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: 580,
          cursor: isDraggingRef.current ? 'grabbing' : 'grab',
          userSelect: 'none',
        }}
      >
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          style={{ width: '100%', height: '100%', display: 'block' }}
        />

        {/* Floating Top Left: Constellation Selector Tabs */}
        <Box
          sx={{
            position: 'absolute',
            top: 14,
            left: 14,
            bgcolor: 'rgba(15, 23, 42, 0.88)',
            p: 0.8,
            borderRadius: 1,
            border: '1px solid #334155',
            backdropFilter: 'blur(6px)',
          }}
        >
          <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.6rem', fontWeight: 800, display: 'block', px: 0.5, mb: 0.4 }}>
            SELECT SATELLITE CONSTELLATION
          </Typography>
          <Stack direction="row" spacing={0.6}>
            {SATELLITES.map((sat) => {
              const active = sat.id === selectedSatellite.id;
              const displayName = sat.id === 'sentinel-2a' ? 'SENTINEL-2A' : (sat.name.replace('ISRO ', '').split(' / ')[0]);
              return (
                <Button
                  key={sat.id}
                  size="small"
                  onClick={() => setSelectedSatellite(sat)}
                  sx={{
                    bgcolor: active ? sat.color : 'transparent',
                    color: active ? '#0f172a' : '#cbd5e1',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    textTransform: 'none',
                    py: 0.3,
                    px: 0.9,
                    borderRadius: 0.8,
                    '&:hover': {
                      bgcolor: active ? sat.color : 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  {displayName}
                </Button>
              );
            })}
          </Stack>
        </Box>

        {/* Floating Top Right: Sensor Payload Mode Strip */}
        <Box
          sx={{
            position: 'absolute',
            top: 14,
            right: 14,
            bgcolor: 'rgba(15, 23, 42, 0.88)',
            p: 0.8,
            borderRadius: 1,
            border: '1px solid #334155',
            backdropFilter: 'blur(6px)',
          }}
        >
          <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.6rem', fontWeight: 800, display: 'block', px: 0.5, mb: 0.4 }}>
            ACTIVE SENSOR RECON BAND
          </Typography>
          <Stack direction="row" spacing={0.5}>
            {[
              { id: 'optical', label: 'Optical 0.28m' },
              { id: 'sar', label: 'SAR Radar' },
              { id: 'lidar', label: 'LiDAR 3D' },
              { id: 'ndvi', label: 'NDVI Infrared' },
            ].map((mode) => {
              const active = sensorBand === mode.id;
              return (
                <Button
                  key={mode.id}
                  size="small"
                  onClick={() => setSensorBand(mode.id as any)}
                  sx={{
                    bgcolor: active ? '#0284c7' : 'rgba(255,255,255,0.05)',
                    color: '#ffffff',
                    fontSize: '0.64rem',
                    fontWeight: 700,
                    textTransform: 'none',
                    py: 0.2,
                    px: 0.8,
                    borderRadius: 0.6,
                    '&:hover': { bgcolor: active ? '#0284c7' : 'rgba(255,255,255,0.15)' },
                  }}
                >
                  {mode.label}
                </Button>
              );
            })}
          </Stack>
        </Box>

        {/* Floating Bottom Left: 3D Camera Controls & Target Focus */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 14,
            left: 14,
            bgcolor: 'rgba(15, 23, 42, 0.88)',
            p: 0.8,
            borderRadius: 1,
            border: '1px solid #334155',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            backdropFilter: 'blur(6px)',
          }}
        >
          <Tooltip title="Focus Camera on India & Active Corridor">
            <Button
              size="small"
              variant="outlined"
              startIcon={<MyLocation fontSize="small" />}
              onClick={handleFocusIndia}
              sx={{
                borderColor: '#38bdf8',
                color: '#38bdf8',
                fontSize: '0.68rem',
                fontWeight: 800,
                textTransform: 'none',
                py: 0.4,
              }}
            >
              Focus India Target
            </Button>
          </Tooltip>

          <Tooltip title="Deep Galaxy View">
            <IconButton size="small" onClick={handleResetDeepSpace} sx={{ color: '#94a3b8' }}>
              <Public fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title={autoRotate ? 'Pause Orbit' : 'Auto-Orbit Space'}>
            <IconButton
              size="small"
              onClick={() => setAutoRotate(!autoRotate)}
              sx={{ color: autoRotate ? '#10b981' : '#94a3b8' }}
            >
              <RotateRight fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Toggle Volumetric Downlink Laser">
            <IconButton
              size="small"
              onClick={() => setLaserBeamActive(!laserBeamActive)}
              sx={{ color: laserBeamActive ? '#ef4444' : '#64748b' }}
            >
              <Sensors fontSize="small" />
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ borderColor: '#334155' }} />

          <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.64rem', fontWeight: 700 }}>
            SPEED:
          </Typography>
          <ButtonGroup size="small" variant="outlined" sx={{ '& .MuiButton-root': { borderColor: '#334155', color: '#cbd5e1', fontSize: '0.62rem', py: 0.2, px: 0.6 } }}>
            <Button onClick={() => setSpeedMultiplier(1)} sx={{ bgcolor: speedMultiplier === 1 ? '#334155' : 'transparent' }}>1x</Button>
            <Button onClick={() => setSpeedMultiplier(5)} sx={{ bgcolor: speedMultiplier === 5 ? '#334155' : 'transparent' }}>5x</Button>
            <Button onClick={() => setSpeedMultiplier(20)} sx={{ bgcolor: speedMultiplier === 20 ? '#334155' : 'transparent' }}>20x</Button>
          </ButtonGroup>
        </Box>

        {/* Floating Bottom Right: Switch to Cadastral 2D View Button */}
        {onSwitchToCadastral && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 14,
              right: 14,
              bgcolor: 'rgba(15, 23, 42, 0.92)',
              p: 0.8,
              borderRadius: 1,
              border: '1px solid #38bdf8',
              boxShadow: '0 4px 16px rgba(56, 189, 248, 0.2)',
            }}
          >
            <Button
              size="small"
              variant="contained"
              startIcon={<Layers fontSize="small" />}
              onClick={onSwitchToCadastral}
              sx={{
                bgcolor: '#0284c7',
                color: '#ffffff',
                '&:hover': { bgcolor: '#0369a1' },
                fontSize: '0.74rem',
                fontWeight: 800,
                textTransform: 'none',
                py: 0.6,
                px: 1.5,
              }}
            >
              Open Micro-Cadastral Parcel HUD &rarr;
            </Button>
          </Box>
        )}
      </Box>

      {/* Target Infrastructure Corridor Beacon Quick Switcher Strip */}
      <Box sx={{ p: 1.2, bgcolor: '#0b1120', borderTop: '1px solid #1e293b' }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ overflowX: 'auto', pb: 0.2 }}>
          <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.65rem', fontWeight: 800, whiteSpace: 'nowrap', mr: 1 }}>
            GEO-TARGET BEACONS:
          </Typography>
          {GROUND_BEACONS.map((beacon) => {
            const isSelected = activeProject ? beacon.id === activeProject.id : beacon.id === 'NHAI-DEL-MUM-P4';
            return (
              <Chip
                key={beacon.id}
                label={`${beacon.name.slice(0, 24)}... (${beacon.state})`}
                size="small"
                onClick={() => onSelectProject && onSelectProject(beacon.id)}
                sx={{
                  bgcolor: isSelected ? 'rgba(239, 68, 68, 0.25)' : '#0f172a',
                  color: isSelected ? '#f87171' : '#cbd5e1',
                  border: isSelected ? '1px solid #ef4444' : '1px solid #334155',
                  fontSize: '0.64rem',
                  fontWeight: isSelected ? 800 : 500,
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'rgba(56, 189, 248, 0.2)',
                    borderColor: '#38bdf8',
                  },
                }}
              />
            );
          })}
        </Stack>
      </Box>
    </Paper>
  );
}
