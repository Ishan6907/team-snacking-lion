import { useState, useMemo } from 'react';
import { Card, CardContent, Typography, Tooltip as MuiTooltip, Box, Stack, Chip } from '@mui/material';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
const INDIA_TOPO_URL = 'https://cdn.jsdelivr.net/npm/india-topojson@1.0.0/india.json';

// Simple color interpolation to replace d3-scale dependency
function interpolateColor(c1: string, c2: string, t: number): string {
  const parse = (hex: string) => [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
  const [r1, g1, b1] = parse(c1);
  const [r2, g2, b2] = parse(c2);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r},${g},${b})`;
}

interface StateData {
  state: string;
  count: number;
  avgDelay: number;
}

interface IndiaHeatmapProps {
  data: StateData[];
}

export default function IndiaHeatmap({ data }: IndiaHeatmapProps) {
  const [tooltipContent, setTooltipContent] = useState('');

  const maxDelay = useMemo(() => Math.max(...data.map((d) => d.avgDelay), 1), [data]);

  const colorScale = useMemo(
    () => (value: number): string => {
      const t = Math.max(0, Math.min(1, value / maxDelay));
      if (t < 0.5) return interpolateColor('#93c5fd', '#f59e0b', t * 2); // Soft Blue to Amber
      return interpolateColor('#f59e0b', '#dc2626', (t - 0.5) * 2); // Amber to Crimson
    },
    [maxDelay],
  );

  const dataMap = useMemo(() => {
    const m = new Map<string, StateData>();
    const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    data.forEach((d) => {
      m.set(d.state.toLowerCase(), d);
      m.set(clean(d.state), d);
    });
    return m;
  }, [data]);

  return (
    <Card sx={{ borderRadius: 1, border: '1px solid #e2e8f0', bgcolor: '#ffffff', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.78rem' }}>
            State-wise Infrastructure Delay Dispersion
          </Typography>
          <Chip label="State Project Telemetry" size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, bgcolor: '#f1f5f9', color: '#0b2545', border: '1px solid #cbd5e1' }} />
        </Stack>

        <MuiTooltip title={tooltipContent} followCursor>
          <Box sx={{ bgcolor: '#f8fafc', borderRadius: 1, p: 1, border: '1px solid #e2e8f0' }}>
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ scale: 950, center: [82, 22] }}
              width={500}
              height={460}
              style={{ width: '100%', height: 'auto' }}
            >
              <Geographies geography={INDIA_TOPO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const rawName = (geo.properties.ST_NM || '').toLowerCase();
                    const cleanName = rawName.replace(/[^a-z0-9]/g, '');
                    const stateData =
                      dataMap.get(rawName) ||
                      dataMap.get(cleanName) ||
                      (rawName.includes('andaman') ? dataMap.get('andaman & nicobar') : undefined) ||
                      (rawName.includes('daman') || rawName.includes('dadra')
                        ? dataMap.get('dadra & nagar haveli and daman & diu')
                        : undefined) ||
                      (rawName.includes('delhi') ? dataMap.get('delhi') : undefined) ||
                      (rawName.includes('odisha') || rawName.includes('orissa') ? dataMap.get('odisha') : undefined) ||
                      (rawName.includes('uttarakhand') || rawName.includes('uttaranchal')
                        ? dataMap.get('uttarakhand')
                        : undefined);
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={stateData ? colorScale(stateData.avgDelay) : '#e2e8f0'}
                        stroke="#cbd5e1"
                        strokeWidth={0.7}
                        onMouseEnter={() => {
                          setTooltipContent(
                            stateData
                              ? `${geo.properties.ST_NM}: ${stateData.count} Projects • Avg Delay: ${stateData.avgDelay} Days`
                              : geo.properties.ST_NM || '',
                          );
                        }}
                        onMouseLeave={() => setTooltipContent('')}
                        style={{
                          default: { outline: 'none' },
                          hover: { outline: 'none', fill: stateData ? '#c2410c' : '#94a3b8', cursor: 'pointer' },
                          pressed: { outline: 'none' },
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ComposableMap>
          </Box>
        </MuiTooltip>
      </CardContent>

      {/* GIS Data Transparency Notice */}
      <Box sx={{ px: 2.5, pb: 2, pt: 0, borderTop: '1px solid #f1f5f9' }}>
        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.64rem', display: 'block', lineHeight: 1.3, mt: 1 }}>
          <strong>Geographic Granularity &amp; Transparency:</strong> Boundaries represent Survey of India / TopoJSON state administrative divisions. Color gradients reflect mean predicted delay days from the ML model. Production upgrade path: Integrate ISRO Bhuvan WMS district tiles or Sentinel Hub API for sub-district resolution.
        </Typography>
      </Box>
    </Card>
  );
}
