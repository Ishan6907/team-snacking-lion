import { useState, useMemo } from 'react';
import { Card, CardContent, Typography, Tooltip as MuiTooltip, Box } from '@mui/material';
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
      if (t < 0.5) return interpolateColor('#C8E6C9', '#FFE082', t * 2);
      return interpolateColor('#FFE082', '#EF5350', (t - 0.5) * 2);
    },
    [maxDelay],
  );

  const dataMap = useMemo(() => {
    const m = new Map<string, StateData>();
    data.forEach((d) => m.set(d.state.toLowerCase(), d));
    return m;
  }, [data]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          State-wise Delay Heatmap
        </Typography>
        <MuiTooltip title={tooltipContent} followCursor>
          <Box>
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ scale: 1000, center: [82, 22] }}
              width={500}
              height={500}
              style={{ width: '100%', height: 'auto' }}
            >
              <Geographies geography={INDIA_TOPO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const stateName = (geo.properties.ST_NM || '').toLowerCase();
                    const stateData = dataMap.get(stateName);
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={stateData ? colorScale(stateData.avgDelay) : '#ECEFF1'}
                        stroke="#fff"
                        strokeWidth={0.5}
                        onMouseEnter={() => {
                          setTooltipContent(
                            stateData
                              ? `${geo.properties.ST_NM}: ${stateData.count} projects, ${stateData.avgDelay}d avg delay`
                              : geo.properties.ST_NM || '',
                          );
                        }}
                        onMouseLeave={() => setTooltipContent('')}
                        style={{
                          default: { outline: 'none' },
                          hover: { outline: 'none', opacity: 0.8 },
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
    </Card>
  );
}
