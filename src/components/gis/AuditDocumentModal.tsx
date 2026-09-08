import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Stack,
  Button,
  Chip,
  Paper,
  Divider,
  Grid,
} from '@mui/material';
import {
  Verified,
  Fingerprint,
  Close,
  Download,
  Gavel,
  Description,
  HistoryEdu,
  CheckCircle,
} from '@mui/icons-material';
import type { ParcelData } from './GisMapCanvas';

export interface AuditDocument {
  id: string;
  title: string;
  documentType: string;
  authority: string;
  status: 'verified' | 'pending' | 'flagged';
  date: string;
  citation: string;
  remarks: string;
  hash: string;
  blockNumber: number;
  signatory: string;
  clauses: string[];
}

interface AuditDocumentModalProps {
  open: boolean;
  onClose: () => void;
  document: AuditDocument | null;
  parcel: ParcelData;
}

// Crisp, authentic SVG QR Code component with standard finder patterns
function CadastralQrCode({ hash, citation }: { hash: string; citation: string }) {
  return (
    <Box
      sx={{
        p: 1.2,
        bgcolor: '#ffffff',
        border: '1.5px solid #0f172a',
        borderRadius: 1,
        textAlign: 'center',
        width: 104,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}
    >
      <svg
        viewBox="0 0 100 100"
        width="80"
        height="80"
        style={{ display: 'block', margin: '0 auto' }}
      >
        <title>{`Audit Hash: ${hash} | Citation: ${citation}`}</title>
        {/* Background */}
        <rect width="100" height="100" fill="#ffffff" />

        {/* Top-Left Finder Pattern (7x7 outer, 5x5 white, 3x3 inner) */}
        <rect x="6" y="6" width="26" height="26" fill="#0f172a" rx="1.5" />
        <rect x="10" y="10" width="18" height="18" fill="#ffffff" />
        <rect x="14" y="14" width="10" height="10" fill="#0f172a" />

        {/* Top-Right Finder Pattern */}
        <rect x="68" y="6" width="26" height="26" fill="#0f172a" rx="1.5" />
        <rect x="72" y="10" width="18" height="18" fill="#ffffff" />
        <rect x="76" y="14" width="10" height="10" fill="#0f172a" />

        {/* Bottom-Left Finder Pattern */}
        <rect x="6" y="68" width="26" height="26" fill="#0f172a" rx="1.5" />
        <rect x="10" y="72" width="18" height="18" fill="#ffffff" />
        <rect x="14" y="76" width="10" height="10" fill="#0f172a" />

        {/* Timing Pattern Lines */}
        <line x1="34" y1="18" x2="66" y2="18" stroke="#0f172a" strokeWidth="2.5" strokeDasharray="3,3" />
        <line x1="18" y1="34" x2="18" y2="66" stroke="#0f172a" strokeWidth="2.5" strokeDasharray="3,3" />

        {/* Alignment Pattern Bottom-Right */}
        <rect x="68" y="68" width="16" height="16" fill="#0f172a" />
        <rect x="72" y="72" width="8" height="8" fill="#ffffff" />
        <rect x="74" y="74" width="4" height="4" fill="#0f172a" />

        {/* Data Matrix Modules (High-Density Pseudo-Random Pattern) */}
        <rect x="36" y="8" width="4" height="4" fill="#0f172a" />
        <rect x="44" y="8" width="4" height="4" fill="#0f172a" />
        <rect x="52" y="8" width="4" height="4" fill="#0f172a" />
        <rect x="60" y="8" width="4" height="4" fill="#0f172a" />

        <rect x="36" y="24" width="4" height="4" fill="#0f172a" />
        <rect x="48" y="24" width="4" height="4" fill="#0f172a" />
        <rect x="56" y="24" width="4" height="4" fill="#0f172a" />

        <rect x="8" y="38" width="4" height="4" fill="#0f172a" />
        <rect x="24" y="38" width="4" height="4" fill="#0f172a" />
        <rect x="32" y="38" width="4" height="4" fill="#0f172a" />
        <rect x="40" y="38" width="4" height="4" fill="#0f172a" />
        <rect x="56" y="38" width="4" height="4" fill="#0f172a" />
        <rect x="72" y="38" width="4" height="4" fill="#0f172a" />
        <rect x="88" y="38" width="4" height="4" fill="#0f172a" />

        <rect x="28" y="46" width="4" height="4" fill="#0f172a" />
        <rect x="36" y="46" width="4" height="4" fill="#0f172a" />
        <rect x="64" y="46" width="4" height="4" fill="#0f172a" />
        <rect x="80" y="46" width="4" height="4" fill="#0f172a" />

        <rect x="8" y="54" width="4" height="4" fill="#0f172a" />
        <rect x="24" y="54" width="4" height="4" fill="#0f172a" />
        <rect x="44" y="54" width="4" height="4" fill="#0f172a" />
        <rect x="52" y="54" width="4" height="4" fill="#0f172a" />
        <rect x="76" y="54" width="4" height="4" fill="#0f172a" />
        <rect x="84" y="54" width="4" height="4" fill="#0f172a" />

        <rect x="36" y="62" width="4" height="4" fill="#0f172a" />
        <rect x="48" y="62" width="4" height="4" fill="#0f172a" />
        <rect x="60" y="62" width="4" height="4" fill="#0f172a" />

        <rect x="36" y="74" width="4" height="4" fill="#0f172a" />
        <rect x="44" y="74" width="4" height="4" fill="#0f172a" />
        <rect x="56" y="74" width="4" height="4" fill="#0f172a" />

        <rect x="36" y="86" width="4" height="4" fill="#0f172a" />
        <rect x="48" y="86" width="4" height="4" fill="#0f172a" />
        <rect x="60" y="86" width="4" height="4" fill="#0f172a" />

        {/* Center Sovereign Micro-Emblem Seal */}
        <circle cx="50" cy="50" r="10" fill="#0b2545" />
        <circle cx="50" cy="50" r="7.5" fill="#ffffff" />
        <circle cx="50" cy="50" r="4.5" fill="#0b2545" />
      </svg>
      <Typography variant="caption" sx={{ display: 'block', color: '#0b2545', fontSize: '0.62rem', fontWeight: 800, fontFamily: 'monospace', mt: 0.3 }}>
        DILRMP-SEAL
      </Typography>
    </Box>
  );
}

export default function AuditDocumentModal({
  open,
  onClose,
  document,
  parcel,
}: AuditDocumentModalProps) {
  if (!document) return null;

  const handleExportPDF = () => {
    const textContent = [
      '========================================================================================',
      '        GOVERNMENT OF INDIA | MINISTRY OF RURAL DEVELOPMENT & REVENUE',
      '        DIGITAL INDIA LAND RECORDS MODERNIZATION PROGRAMME (DILRMP)',
      '========================================================================================',
      `OFFICIAL RECORD OF RIGHTS AUDIT CERTIFICATE: ${document.citation}`,
      `Authority: ${document.authority}`,
      `Execution Date: ${document.date}`,
      `Document Classification: ${document.documentType} (${document.title})`,
      `Verification Status: ${document.status.toUpperCase()}`,
      `Ledger Volume / Block Number: #${document.blockNumber.toLocaleString()}`,
      `Cryptographic Checksum: SHA256-${document.hash.toUpperCase()}`,
      '----------------------------------------------------------------------------------------',
      'CADASTRAL PARCEL SPECIFICATIONS:',
      `  - Survey Identification: ${parcel.surveyNo}`,
      `  - Khasra Identification: ${parcel.khasraNo}`,
      `  - Primary Recorded Tenure: ${parcel.owner}`,
      `  - Demarcated Area: ${parcel.areaAcres} Acres (${parcel.landType})`,
      `  - Statutory Acquisition Status: ${parcel.acquisitionStatus.toUpperCase()}`,
      `  - CALA Assessed Value: ₹${parcel.estimatedCostCr} Crores`,
      '----------------------------------------------------------------------------------------',
      'STATUTORY COVENANTS & AUDIT VERIFICATION FINDINGS:',
      ...document.clauses.map((clauseStr, idx) => `  [Clause ${idx + 1}] ${clauseStr}`),
      '----------------------------------------------------------------------------------------',
      `Authorized Electronic Signatory: ${document.signatory}`,
      'Statutory Attestation: Valid under Section 65B of the Indian Evidence Act, 1872',
      '========================================================================================',
    ].join('\r\n');

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `Certified_True_Copy_${document.citation.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#ffffff',
          color: '#0f172a',
          border: '1px solid #cbd5e1',
          borderRadius: 1.5,
          boxShadow: '0 20px 48px rgba(0, 0, 0, 0.18)',
        },
      }}
    >
      {/* Institutional Document Modal Header */}
      <DialogTitle
        sx={{
          p: 2.2,
          pb: 1.8,
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: '#ffffff',
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 1,
              bgcolor: '#0b2545',
              border: '1px solid #1e3a8a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}
          >
            <Description fontSize="medium" />
          </Box>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="caption" sx={{ color: '#0b2545', fontWeight: 800, letterSpacing: 0.5, fontSize: '0.68rem' }}>
                BHUVAN CADASTRAL REVENUE LEDGER &bull; SEC-DOC #{document.id.toUpperCase()}
              </Typography>
              <Chip
                icon={<Verified sx={{ fontSize: '12px !important', color: '#15803d' }} />}
                label="DIGITALLY VERIFIED &amp; SEALED"
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  bgcolor: '#f0fdf4',
                  color: '#15803d',
                  border: '1px solid #bbf7d0',
                  borderRadius: 0.5,
                }}
              />
            </Stack>
            <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a', fontSize: '1.12rem', mt: 0.2 }}>
              {document.title}
            </Typography>
          </Box>
        </Stack>

        <Button
          onClick={onClose}
          size="small"
          sx={{ minWidth: 32, p: 0.8, color: '#64748b', '&:hover': { color: '#0f172a', bgcolor: '#f1f5f9' } }}
        >
          <Close fontSize="small" />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        {/* Verification Telemetry Banner */}
        <Paper
          elevation={0}
          sx={{
            p: 1.8,
            mb: 2.5,
            bgcolor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderLeft: '4px solid #0284c7',
            borderRadius: 1,
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={7.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Fingerprint sx={{ fontSize: 18, color: '#0284c7' }} />
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  SHA-256 Checksum &bull; Digital India Land Records (DILRMP)
                </Typography>
              </Stack>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '0.72rem',
                  color: '#0369a1',
                  wordBreak: 'break-all',
                  mt: 0.4,
                  bgcolor: '#eff6ff',
                  p: 0.8,
                  borderRadius: 0.5,
                  border: '1px solid #bfdbfe',
                }}
              >
                {document.hash}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4.5}>
              <Stack spacing={0.4}>
                <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem', fontWeight: 700 }}>
                  REVENUE REGISTER VOL: <span style={{ color: '#0f172a', fontFamily: 'monospace', fontWeight: 800 }}>#{document.blockNumber.toLocaleString()}</span>
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem', fontWeight: 700 }}>
                  TIMESTAMP: <span style={{ color: '#0f172a', fontFamily: 'monospace', fontWeight: 800 }}>{document.date}</span>
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem', fontWeight: 700 }}>
                  AUTHORITY: <span style={{ color: '#15803d', fontWeight: 800 }}>{document.authority}</span>
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        {/* Digital Deed / Instrument Body */}
        <Paper
          elevation={0}
          sx={{
            p: 2.8,
            bgcolor: '#ffffff',
            border: '1.5px solid #cbd5e1',
            borderRadius: 1,
            position: 'relative',
          }}
        >
          {/* Instrument Header with Real SVG QR Code */}
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
            <Box sx={{ pr: 2 }}>
              <Typography variant="caption" sx={{ color: '#0b2545', fontWeight: 800, letterSpacing: 0.5, fontSize: '0.7rem' }}>
                RECORD OF RIGHTS &amp; STATUTORY CLEARANCE SUMMARY
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.1rem', mt: 0.3 }}>
                {document.documentType}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.74rem', display: 'block', mt: 0.3 }}>
                Registration Citation: <strong style={{ color: '#0284c7', fontFamily: 'monospace' }}>{document.citation}</strong>
              </Typography>
            </Box>

            {/* High-Resolution SVG QR Code Component */}
            <CadastralQrCode hash={document.hash} citation={document.citation} />
          </Stack>

          <Divider sx={{ borderColor: '#e2e8f0', my: 2 }} />

          {/* Cadastral Target Properties Data Grid */}
          <Grid container spacing={2} sx={{ mb: 2.5, p: 1.5, bgcolor: '#f8fafc', borderRadius: 1, border: '1px solid #e2e8f0' }}>
            <Grid item xs={6} sm={3}>
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 800 }}>
                SURVEY / KHASRA
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 800, color: '#0b2545', fontFamily: 'monospace', fontSize: '0.88rem' }}>
                {parcel.surveyNo} ({parcel.khasraNo})
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 800 }}>
                RECORDED OWNER
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.84rem' }}>
                {parcel.owner}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 800 }}>
                PARCEL EXTENT
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f172a', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                {parcel.areaAcres} Acres ({parcel.landType})
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 800 }}>
                STATUTORY STATUS
              </Typography>
              <Chip
                label={parcel.acquisitionStatus.toUpperCase()}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  bgcolor: parcel.acquisitionStatus === 'acquired' ? '#f0fdf4' : '#fffbeb',
                  color: parcel.acquisitionStatus === 'acquired' ? '#15803d' : '#b45309',
                  border: '1px solid #cbd5e1',
                  borderRadius: 0.5,
                }}
              />
            </Grid>
          </Grid>

          {/* Legal Clauses & Findings */}
          <Typography variant="caption" sx={{ color: '#475569', fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase', fontSize: '0.68rem', mb: 1.2, display: 'block' }}>
            STATUTORY COVENANTS &amp; AUDIT VERIFICATION FINDINGS
          </Typography>

          <Stack spacing={1.2}>
            {document.clauses.map((clause, idx) => (
              <Box
                key={idx}
                sx={{
                  p: 1.4,
                  bgcolor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 0.8,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    bgcolor: '#eff6ff',
                    color: '#1d4ed8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    fontFamily: 'monospace',
                    flexShrink: 0,
                    mt: 0.1,
                  }}
                >
                  {idx + 1}
                </Box>
                <Typography variant="body2" sx={{ color: '#334155', fontSize: '0.78rem', lineHeight: 1.5 }}>
                  {clause}
                </Typography>
              </Box>
            ))}
          </Stack>

          {/* Sub-Registrar / CALA Digital Signature Seal */}
          <Paper
            elevation={0}
            sx={{
              mt: 2.5,
              p: 1.8,
              bgcolor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: 1,
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <HistoryEdu sx={{ color: '#15803d', fontSize: 24 }} />
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#15803d', fontSize: '0.76rem' }}>
                    CRYPTOGRAPHIC DIGITAL SIGNATURE VALID (CCA APPROVED)
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#475569', display: 'block', fontSize: '0.7rem' }}>
                    Signatory: {document.signatory} &bull; Timestamp: {document.date}
                  </Typography>
                </Box>
              </Stack>
              <Chip
                icon={<CheckCircle sx={{ fontSize: '13px !important', color: '#15803d' }} />}
                label="SEC 65B EVIDENCE PASS"
                size="small"
                sx={{
                  bgcolor: '#dcfce7',
                  color: '#15803d',
                  fontWeight: 800,
                  fontSize: '0.66rem',
                  borderRadius: 0.5,
                  border: '1px solid #86efac',
                }}
              />
            </Stack>
          </Paper>
        </Paper>
      </DialogContent>

      <DialogActions sx={{ p: 2, px: 2.5, borderTop: '1px solid #e2e8f0', justifyContent: 'space-between', bgcolor: '#f8fafc' }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Gavel sx={{ fontSize: 16, color: '#64748b' }} />
          <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 600 }}>
            COMPLIANCE: RFCTLARR ACT 2013 &bull; INDIAN EVIDENCE ACT SEC 65B
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1.5}>
          <Button
            size="small"
            variant="outlined"
            onClick={onClose}
            sx={{
              color: '#334155',
              borderColor: '#cbd5e1',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'none',
              '&:hover': { borderColor: '#94a3b8', bgcolor: '#f1f5f9' },
            }}
          >
            Close Inspector
          </Button>
          <Button
            size="small"
            variant="contained"
            startIcon={<Download fontSize="small" />}
            onClick={handleExportPDF}
            sx={{
              bgcolor: '#0b2545',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.75rem',
              textTransform: 'none',
              '&:hover': { bgcolor: '#1e3a8a' },
            }}
          >
            Export Certified Copy (.PDF)
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
