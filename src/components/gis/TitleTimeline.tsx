import { useState } from 'react';
import { Box, Typography, Stack, Paper, Chip } from '@mui/material';
import { Gavel, HistoryEdu, AssignmentTurnedIn, Verified, Lock } from '@mui/icons-material';
import type { ParcelData } from './GisMapCanvas';

interface TitleTimelineProps {
  parcel: ParcelData;
}

export default function TitleTimeline({ parcel }: TitleTimelineProps) {
  const [filter, setFilter] = useState<'all' | 'revenue' | 'court' | 'survey'>('all');

  const events = [
    {
      year: '2012',
      type: 'revenue',
      recordRef: 'UP/SRO-SADAR/2012/312',
      title: 'Ancestral Partition & Khatauni Mutation',
      authority: 'Revenue Court of Tehsildar (Decree No. 312/2012)',
      description: `Lawful partition decree registered among heirs. Survey ${parcel.surveyNo} carved with unencumbered title.`,
      icon: <HistoryEdu sx={{ fontSize: 13, color: '#0284c7' }} />,
      tag: 'DEED RECORDED',
      tagColor: '#0284c7',
    },
    {
      year: '2018',
      type: 'revenue',
      recordRef: 'SDM/ZON/2018/143',
      title: 'Zoning & Non-Agricultural Conversion (143/UPZA)',
      authority: 'Sub-Divisional Magistrate (SDM) Court',
      description: 'Permitted mixed-use development zoning variance filed in district gazette.',
      icon: <AssignmentTurnedIn sx={{ fontSize: 13, color: '#15803d' }} />,
      tag: 'ZONING CLEARED',
      tagColor: '#15803d',
    },
    {
      year: '2021',
      type: 'court',
      recordRef: 'HC/WRIT-C/1892/2021',
      title: 'High Court Interim Stay on Acquisition (Writ 1892)',
      authority: 'Honorable High Court of Judicature',
      description: 'Tenure holder disputed circle rate compensation calculation under Section 3G. Stay vacated after parity deposit.',
      icon: <Gavel sx={{ fontSize: 13, color: '#b91c1c' }} />,
      tag: 'STAY VACATED',
      tagColor: '#b91c1c',
    },
    {
      year: '2024',
      type: 'survey',
      recordRef: 'NHAI/RO-DL/2024/JMS',
      title: 'CALA Joint Measurement Survey (JMS) Completed',
      authority: 'NHAI Project Director & District Revenue Team',
      description: 'DGPS survey finalized. Boundary pillars pegged. Title free from third-party adverse possession.',
      icon: <Verified sx={{ fontSize: 13, color: '#c2410c' }} />,
      tag: 'DGPS CERTIFIED',
      tagColor: '#c2410c',
    },
    {
      year: 'Current',
      type: 'survey',
      recordRef: 'MORTH/NH48/2025/3E',
      title: 'Bhuvan Cadastral Verification & Section 3E Possession Handover',
      authority: 'National Infrastructure Pipeline (NIP) / CALA',
      description: `Physical possession handover scheduled. Direct treasury compensation tranche ₹${parcel.estimatedCostCr.toFixed(2)} Cr earmarked.`,
      icon: <Verified sx={{ fontSize: 13, color: '#15803d' }} />,
      tag: 'ACTIVE AUDIT',
      tagColor: '#15803d',
    },
  ];

  const filteredEvents = filter === 'all' ? events : events.filter((e) => e.type === filter);

  return (
    <Box sx={{ color: '#0f172a', mt: 1.5 }}>
      {/* Header with Title Badge */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <Lock sx={{ fontSize: 16, color: '#0b2545' }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0b2545', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.76rem' }}>
              Chain-of-Title Provenance Ledger
            </Typography>
          </Stack>
          <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.74rem' }}>
            Verified 30-Year Revenue Records for {parcel.surveyNo}
          </Typography>
        </Box>
        <Chip
          label="30-YR AUDIT PASS"
          size="small"
          sx={{
            height: 20,
            fontSize: '0.62rem',
            fontWeight: 800,
            letterSpacing: 0.5,
            bgcolor: '#f0fdf4',
            color: '#15803d',
            border: '1px solid #bbf7d0',
            borderRadius: 0.5,
          }}
        />
      </Stack>

      {/* Filter Chips */}
      <Stack direction="row" spacing={0.8} sx={{ mb: 2, overflowX: 'auto', pb: 0.5 }}>
        {(['all', 'revenue', 'court', 'survey'] as const).map((cat) => (
          <Chip
            key={cat}
            label={cat === 'all' ? 'ALL EVENTS (5)' : cat.toUpperCase()}
            size="small"
            onClick={() => setFilter(cat)}
            sx={{
              height: 22,
              fontSize: '0.65rem',
              fontWeight: 700,
              cursor: 'pointer',
              bgcolor: filter === cat ? '#0b2545' : '#f8fafc',
              color: filter === cat ? '#ffffff' : '#334155',
              border: filter === cat ? '1px solid #0b2545' : '1px solid #cbd5e1',
              borderRadius: 0.5,
              '&:hover': {
                bgcolor: filter === cat ? '#1e3a8a' : '#f1f5f9',
              },
            }}
          />
        ))}
      </Stack>

      {/* Timeline Stream */}
      <Box sx={{ position: 'relative', pl: 3, '&::before': { content: '""', position: 'absolute', top: 8, bottom: 8, left: 9, width: 2, bgcolor: '#cbd5e1' } }}>
        <Stack spacing={1.5}>
          {filteredEvents.map((evt, idx) => (
            <Box key={idx} sx={{ position: 'relative' }}>
              {/* Node Pip */}
              <Box
                sx={{
                  position: 'absolute',
                  left: -22,
                  top: 8,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  bgcolor: '#ffffff',
                  border: `2px solid ${evt.tagColor}`,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2,
                }}
              >
                {evt.icon}
              </Box>

              <Paper
                elevation={0}
                sx={{
                  p: 1.5,
                  bgcolor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 1,
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    borderColor: '#0b2545',
                    bgcolor: '#ffffff',
                  },
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#0b2545', fontFamily: 'monospace', fontSize: '0.78rem' }}>
                      [{evt.year}]
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.8rem' }}>
                      {evt.title}
                    </Typography>
                  </Stack>
                  <Chip
                    label={evt.tag}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: '0.6rem',
                      fontWeight: 800,
                      letterSpacing: 0.5,
                      bgcolor: '#ffffff',
                      color: evt.tagColor,
                      border: `1px solid ${evt.tagColor}50`,
                      borderRadius: 0.5,
                    }}
                  />
                </Stack>

                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.6 }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem' }}>
                    {evt.authority}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#0284c7', fontFamily: 'monospace', fontSize: '0.65rem' }}>
                    REF: {evt.recordRef}
                  </Typography>
                </Stack>

                <Typography variant="caption" sx={{ color: '#334155', fontSize: '0.74rem', display: 'block', lineHeight: 1.4 }}>
                  {evt.description}
                </Typography>
              </Paper>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
