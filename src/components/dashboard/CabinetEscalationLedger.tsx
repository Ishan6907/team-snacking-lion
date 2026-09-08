import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Gavel,
  CheckCircle,
  HourglassEmpty,
  NotificationsActive,
} from '@mui/icons-material';

interface EscalationRecord {
  id: string;
  meetingRef: string;
  date: string;
  projectCode: string;
  projectName: string;
  nodalAuthority: string;
  directiveSummary: string;
  status: 'directive_issued' | 'cabinet_monitoring' | 'concurrence_granted' | 'pending_mod' | 'resolved';
}

const LEDGER_DATA: EscalationRecord[] = [
  {
    id: 'ESC-2025-081',
    meetingRef: 'PMO/PRAGATI-XLIV/2025',
    date: '2025-02-12',
    projectCode: 'MoSPI/OCMS/RAIL-2002-0418',
    projectName: 'Udhampur-Srinagar-Baramulla Rail Link',
    nodalAuthority: 'Prime Minister Office / Railway Board',
    directiveSummary: 'Katra-Reasi safety trial commissioning expedited; Northern Railway & GSI to complete Tunnel T-49 grouting audit by Q3 FY26.',
    status: 'directive_issued',
  },
  {
    id: 'ESC-2025-079',
    meetingRef: 'CCI/INTER-MIN/2025/HSR',
    date: '2025-02-04',
    projectCode: 'MoSPI/OCMS/HSR-2015-0812',
    projectName: 'Mumbai-Ahmedabad High Speed Rail',
    nodalAuthority: 'Cabinet Committee on Infrastructure',
    directiveSummary: 'MMRDA and Maharashtra Forest Dept instructed to hand over Vikhroli shaft utility right-of-way for undersea TBM-3 launch.',
    status: 'cabinet_monitoring',
  },
  {
    id: 'ESC-2025-074',
    meetingRef: 'MoJS/CWC-REV/2025/POL',
    date: '2025-01-26',
    projectCode: 'MoSPI/OCMS/WTR-2009-0044',
    projectName: 'Polavaram National Irrigation Project',
    nodalAuthority: 'Central Water Commission (CWC)',
    directiveSummary: 'Dam Design Review Panel issued concurrence for vibro-stone column ground improvement at damaged diaphragm wall gap.',
    status: 'concurrence_granted',
  },
  {
    id: 'ESC-2025-068',
    meetingRef: 'MoR-MoD/TASKFORCE/2025',
    date: '2025-01-18',
    projectCode: 'MoSPI/OCMS/RAIL-2020-0588',
    projectName: 'Bengaluru Suburban Railway (BSRP)',
    nodalAuthority: 'Ministry of Defence / K-RIDE',
    directiveSummary: 'Joint committee formed for executing Section 11 parcel alienation at Jalahalli Air Force Station corridor within 45 days.',
    status: 'pending_mod',
  },
  {
    id: 'ESC-2025-062',
    meetingRef: 'DEA/EFC-APP/2025/MDU',
    date: '2025-01-10',
    projectCode: 'MoSPI/OCMS/HLTH-2018-0291',
    projectName: 'AIIMS Madurai Apex Campus',
    nodalAuthority: 'Expenditure Finance Committee (EFC)',
    directiveSummary: 'Enhanced sanction of ₹1,977 Cr approved; JICA loan disbursement synchronized with civil contract Phase-II.',
    status: 'concurrence_granted',
  },
  {
    id: 'ESC-2024-118',
    meetingRef: 'SC-HPC/ENV/2024/CHD',
    date: '2024-12-14',
    projectCode: 'MoSPI/OCMS/ROADS-2016-0155',
    projectName: 'Char Dham All-Weather Highway',
    nodalAuthority: 'Supreme Court High-Powered Committee',
    directiveSummary: 'Geotechnical remediation plan at Silkyara tunnel validated; NHIDCL mandated to install continuous crown micro-seismic sensors.',
    status: 'directive_issued',
  },
];

function getStatusBadge(status: EscalationRecord['status']) {
  switch (status) {
    case 'directive_issued':
      return (
        <Chip
          label="DIRECTIVE ISSUED"
          size="small"
          icon={<NotificationsActive sx={{ fontSize: '11px !important', color: '#c2410c' }} />}
          sx={{
            fontWeight: 800,
            fontSize: '0.62rem',
            bgcolor: '#fff7ed',
            color: '#c2410c',
            border: '1px solid #fdba74',
            borderRadius: 0.5,
            height: 20,
          }}
        />
      );
    case 'cabinet_monitoring':
      return (
        <Chip
          label="CABINET MONITORING"
          size="small"
          icon={<HourglassEmpty sx={{ fontSize: '11px !important', color: '#b91c1c' }} />}
          sx={{
            fontWeight: 800,
            fontSize: '0.62rem',
            bgcolor: '#fef2f2',
            color: '#b91c1c',
            border: '1px solid #fca5a5',
            borderRadius: 0.5,
            height: 20,
          }}
        />
      );
    case 'concurrence_granted':
    case 'resolved':
      return (
        <Chip
          label="CONCURRENCE GRANTED"
          size="small"
          icon={<CheckCircle sx={{ fontSize: '11px !important', color: '#15803d' }} />}
          sx={{
            fontWeight: 800,
            fontSize: '0.62rem',
            bgcolor: '#f0fdf4',
            color: '#15803d',
            border: '1px solid #86efac',
            borderRadius: 0.5,
            height: 20,
          }}
        />
      );
    case 'pending_mod':
      return (
        <Chip
          label="DEFENCE CLEARANCE PENDING"
          size="small"
          icon={<HourglassEmpty sx={{ fontSize: '11px !important', color: '#1d4ed8' }} />}
          sx={{
            fontWeight: 800,
            fontSize: '0.62rem',
            bgcolor: '#eff6ff',
            color: '#1d4ed8',
            border: '1px solid #93c5fd',
            borderRadius: 0.5,
            height: 20,
          }}
        />
      );
    default:
      return null;
  }
}

export default function CabinetEscalationLedger() {
  return (
    <Card sx={{ borderRadius: 1, border: '1px solid #e2e8f0', bgcolor: '#ffffff', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.3 }}>
              <Gavel sx={{ fontSize: 16, color: '#0b2545' }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.78rem' }}>
                PRAGATI & Cabinet Escalation Ledger
              </Typography>
            </Stack>
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.72rem' }}>
              Inter-Ministerial Task Force & Prime Minister&apos;s Review Directives Log
            </Typography>
          </Box>
          <Chip
            label="QUARTERLY STATUTORY LOG"
            size="small"
            sx={{ fontWeight: 700, bgcolor: '#f1f5f9', color: '#0b2545', border: '1px solid #cbd5e1', fontSize: '0.65rem' }}
          />
        </Stack>

        <TableContainer sx={{ maxHeight: 380 }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ bgcolor: '#f8fafc', color: '#334155', fontWeight: 800, fontSize: '0.7rem', textTransform: 'uppercase', borderColor: '#e2e8f0' }}>
                  Meeting Reference & Date
                </TableCell>
                <TableCell sx={{ bgcolor: '#f8fafc', color: '#334155', fontWeight: 800, fontSize: '0.7rem', textTransform: 'uppercase', borderColor: '#e2e8f0' }}>
                  Project & Code
                </TableCell>
                <TableCell sx={{ bgcolor: '#f8fafc', color: '#334155', fontWeight: 800, fontSize: '0.7rem', textTransform: 'uppercase', borderColor: '#e2e8f0' }}>
                  Nodal Authority
                </TableCell>
                <TableCell sx={{ bgcolor: '#f8fafc', color: '#334155', fontWeight: 800, fontSize: '0.7rem', textTransform: 'uppercase', borderColor: '#e2e8f0' }}>
                  Executive Directive / Resolution
                </TableCell>
                <TableCell sx={{ bgcolor: '#f8fafc', color: '#334155', fontWeight: 800, fontSize: '0.7rem', textTransform: 'uppercase', borderColor: '#e2e8f0' }}>
                  Escalation Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {LEDGER_DATA.map((item) => (
                <TableRow key={item.id} sx={{ '&:hover': { bgcolor: '#f8fafc' }, borderColor: '#e2e8f0' }}>
                  <TableCell sx={{ borderColor: '#e2e8f0', py: 1.2 }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#0b2545', display: 'block', fontSize: '0.72rem' }}>
                      {item.meetingRef}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem' }}>
                      {item.date}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ borderColor: '#e2e8f0', py: 1.2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.8rem' }}>
                      {item.projectName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem' }}>
                      {item.projectCode}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ borderColor: '#e2e8f0', py: 1.2 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: '#334155', fontSize: '0.74rem' }}>
                      {item.nodalAuthority}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ borderColor: '#e2e8f0', py: 1.2, maxWidth: 360 }}>
                    <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.74rem', lineHeight: 1.4, display: 'block' }}>
                      {item.directiveSummary}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ borderColor: '#e2e8f0', py: 1.2 }}>
                    {getStatusBadge(item.status)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
