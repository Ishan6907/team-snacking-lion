import { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Stack,
  Chip,
  Button,
  TextField,
  InputAdornment,
  MenuItem,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  Gavel,
  Search,
  PictureAsPdf,
  AccountBalance,
  ReceiptLong,
  CheckCircle,
  Shield,
  Close,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import LiquidatedDamagesDialog from '@/components/common/LiquidatedDamagesDialog';
import { ALL_1428_PROJECTS, ProjectRow } from '@/data/inventoryData';

export interface ArbitrationClaim {
  id: string;
  project: ProjectRow;
  contractor: string;
  claimAmountCr: number;
  counterClaimCr: number;
  assessedLdCr: number;
  bankGuaranteeCr: number;
  tribunalStage: 'DAB' | 'CCIE' | 'Arbitral Tribunal' | 'High Court S.34' | 'Settled Vsv-II';
  forumName: string;
  claimCategory: 'RoW Handover Delay' | 'Price Escalation Cl. 19' | 'Design Modification / Scope Creep' | 'Unprecedented Monsoon' | 'Utility Hindrance';
  hearingDate: string;
  bgStatus: 'Active Lien' | 'Invoked' | 'Stayed by Court' | 'Escrowed';
}

export default function ArbitrationClaimsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [forumFilter, setForumFilter] = useState('all');
  const [contractorFilter, setContractorFilter] = useState('all');

  // LD Modal
  const [ldDialogOpen, setLdDialogOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<ArbitrationClaim | null>(null);

  // CCIE Brief Modal
  const [briefModalOpen, setBriefModalOpen] = useState(false);
  const [briefClaim, setBriefClaim] = useState<ArbitrationClaim | null>(null);
  const [briefExporting, setBriefExporting] = useState(false);

  // Generate 14 authentic arbitration and contractor claim cases across India
  const claimsData: ArbitrationClaim[] = useMemo(() => {
    const rawClaims = [
      {
        code: 'NHAI-DEL-MUM-P4',
        contractor: 'Dilip Buildcon Ltd.',
        claimAmountCr: 384.5,
        counterClaimCr: 142.0,
        assessedLdCr: 41.2,
        bankGuaranteeCr: 142.0,
        tribunalStage: 'Arbitral Tribunal' as const,
        forumName: 'DIAC Tribunal (Hon. Justice Retd. R.V. Raveendran Bench)',
        claimCategory: 'RoW Handover Delay' as const,
        hearingDate: '24 Sep 2024',
        bgStatus: 'Active Lien' as const,
      },
      {
        code: 'DFCCIL-EDFC-PKG-201',
        contractor: 'L&T Construction Heavy Civil IC',
        claimAmountCr: 620.0,
        counterClaimCr: 210.0,
        assessedLdCr: 88.5,
        bankGuaranteeCr: 210.0,
        tribunalStage: 'CCIE' as const,
        forumName: 'Conciliation Committee of Independent Experts (Bench 1)',
        claimCategory: 'Design Modification / Scope Creep' as const,
        hearingDate: '18 Oct 2024',
        bgStatus: 'Active Lien' as const,
      },
      {
        code: 'NHAI-BLR-CHE-EXP-02',
        contractor: 'NCC Limited',
        claimAmountCr: 245.8,
        counterClaimCr: 95.0,
        assessedLdCr: 28.4,
        bankGuaranteeCr: 95.0,
        tribunalStage: 'DAB' as const,
        forumName: 'Dispute Adjudication Board (Chaired by Er. K.S. Rao)',
        claimCategory: 'Utility Hindrance' as const,
        hearingDate: '04 Oct 2024',
        bgStatus: 'Active Lien' as const,
      },
      {
        code: 'JJM-UP-BUND-08',
        contractor: 'Afcons Infrastructure Ltd.',
        claimAmountCr: 182.4,
        counterClaimCr: 68.0,
        assessedLdCr: 19.8,
        bankGuaranteeCr: 68.0,
        tribunalStage: 'Arbitral Tribunal' as const,
        forumName: 'Lucknow Commercial Court Appointed Arbitral Panel',
        claimCategory: 'RoW Handover Delay' as const,
        hearingDate: '12 Nov 2024',
        bgStatus: 'Stayed by Court' as const,
      },
      {
        code: 'MMRDA-MUM-LINE-4',
        contractor: 'Reliance Infrastructure Ltd.',
        claimAmountCr: 890.0,
        counterClaimCr: 340.0,
        assessedLdCr: 120.0,
        bankGuaranteeCr: 340.0,
        tribunalStage: 'High Court S.34' as const,
        forumName: 'Bombay High Court (Arbitration Petition No. 418/2023)',
        claimCategory: 'Price Escalation Cl. 19' as const,
        hearingDate: '08 Oct 2024',
        bgStatus: 'Stayed by Court' as const,
      },
      {
        code: 'PGCIL-HVDC-RAIGARH',
        contractor: 'Kalpataru Projects International',
        claimAmountCr: 165.2,
        counterClaimCr: 60.0,
        assessedLdCr: 18.2,
        bankGuaranteeCr: 60.0,
        tribunalStage: 'CCIE' as const,
        forumName: 'CCIE Power Sector Special Bench (Shri S.K. Gupta)',
        claimCategory: 'RoW Handover Delay' as const,
        hearingDate: '29 Sep 2024',
        bgStatus: 'Active Lien' as const,
      },
      {
        code: 'NHAI-VR-EXP-PKG-01',
        contractor: 'Tata Projects Ltd.',
        claimAmountCr: 310.0,
        counterClaimCr: 115.0,
        assessedLdCr: 35.6,
        bankGuaranteeCr: 115.0,
        tribunalStage: 'DAB' as const,
        forumName: 'NHAI Regional Dispute Adjudication Board Ranchi',
        claimCategory: 'Unprecedented Monsoon' as const,
        hearingDate: '15 Oct 2024',
        bgStatus: 'Active Lien' as const,
      },
      {
        code: 'NHAI-AS-EWB-PKG-03',
        contractor: 'Hindustan Construction Co. (HCC)',
        claimAmountCr: 412.0,
        counterClaimCr: 155.0,
        assessedLdCr: 52.0,
        bankGuaranteeCr: 155.0,
        tribunalStage: 'Arbitral Tribunal' as const,
        forumName: 'Guwahati Chamber of Commerce Arbitration Center',
        claimCategory: 'RoW Handover Delay' as const,
        hearingDate: '22 Oct 2024',
        bgStatus: 'Invoked' as const,
      },
      {
        code: 'NHAI-KL-NH66-PKG-02',
        contractor: 'KNR Constructions Ltd.',
        claimAmountCr: 195.0,
        counterClaimCr: 72.0,
        assessedLdCr: 22.4,
        bankGuaranteeCr: 72.0,
        tribunalStage: 'Settled Vsv-II' as const,
        forumName: 'Vivad Se Vishwas II Settlement Scheme (NHAI HQ Approval)',
        claimCategory: 'Price Escalation Cl. 19' as const,
        hearingDate: 'Settled 14 Aug 2024',
        bgStatus: 'Escrowed' as const,
      },
      {
        code: 'RVNL-RISH-KARN-PKG-01',
        contractor: 'Megha Engineering & Infra (MEIL)',
        claimAmountCr: 540.0,
        counterClaimCr: 180.0,
        assessedLdCr: 74.0,
        bankGuaranteeCr: 180.0,
        tribunalStage: 'Arbitral Tribunal' as const,
        forumName: 'Dehradun Fast-Track Tunneling Dispute Panel',
        claimCategory: 'Design Modification / Scope Creep' as const,
        hearingDate: '02 Nov 2024',
        bgStatus: 'Active Lien' as const,
      },
      {
        code: 'NHAI-MH-SAMRUDDHI-EXT',
        contractor: 'IRB Infrastructure Developers',
        claimAmountCr: 275.5,
        counterClaimCr: 90.0,
        assessedLdCr: 31.0,
        bankGuaranteeCr: 90.0,
        tribunalStage: 'CCIE' as const,
        forumName: 'CCIE Highways Committee Bench 3',
        claimCategory: 'Utility Hindrance' as const,
        hearingDate: '19 Oct 2024',
        bgStatus: 'Active Lien' as const,
      },
      {
        code: 'NHAI-RJ-DME-PKG-11',
        contractor: 'GR Infraprojects Ltd.',
        claimAmountCr: 220.0,
        counterClaimCr: 78.0,
        assessedLdCr: 24.5,
        bankGuaranteeCr: 78.0,
        tribunalStage: 'DAB' as const,
        forumName: 'Jaipur Dispute Adjudication Board',
        claimCategory: 'RoW Handover Delay' as const,
        hearingDate: '06 Oct 2024',
        bgStatus: 'Active Lien' as const,
      },
      {
        code: 'NHAI-PB-DLI-AMR-PKG-04',
        contractor: 'Ceigall India Ltd.',
        claimAmountCr: 185.0,
        counterClaimCr: 65.0,
        assessedLdCr: 21.0,
        bankGuaranteeCr: 65.0,
        tribunalStage: 'Arbitral Tribunal' as const,
        forumName: 'Chandigarh Arbitration Centre',
        claimCategory: 'RoW Handover Delay' as const,
        hearingDate: '27 Oct 2024',
        bgStatus: 'Active Lien' as const,
      },
      {
        code: 'NHAI-TN-CHEN-SURAT-01',
        contractor: 'Adani Road Transport Ltd.',
        claimAmountCr: 390.0,
        counterClaimCr: 135.0,
        assessedLdCr: 45.0,
        bankGuaranteeCr: 135.0,
        tribunalStage: 'CCIE' as const,
        forumName: 'CCIE National Conciliation Council Bench 2',
        claimCategory: 'Price Escalation Cl. 19' as const,
        hearingDate: '14 Nov 2024',
        bgStatus: 'Active Lien' as const,
      },
    ];

    return rawClaims.map((item, idx) => {
      const matchedProj = ALL_1428_PROJECTS.find((p) => p.id === item.code) || ALL_1428_PROJECTS[idx % ALL_1428_PROJECTS.length];
      return {
        id: `ARB-${100 + idx}`,
        project: matchedProj,
        contractor: item.contractor,
        claimAmountCr: item.claimAmountCr,
        counterClaimCr: item.counterClaimCr,
        assessedLdCr: item.assessedLdCr,
        bankGuaranteeCr: item.bankGuaranteeCr,
        tribunalStage: item.tribunalStage,
        forumName: item.forumName,
        claimCategory: item.claimCategory,
        hearingDate: item.hearingDate,
        bgStatus: item.bgStatus,
      };
    });
  }, []);

  // Filtered List
  const filteredClaims = useMemo(() => {
    return claimsData.filter((c) => {
      const matchesSearch =
        c.project.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.contractor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.claimCategory.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesForum =
        forumFilter === 'all' ||
        (forumFilter === 'dab' && c.tribunalStage === 'DAB') ||
        (forumFilter === 'ccie' && c.tribunalStage === 'CCIE') ||
        (forumFilter === 'tribunal' && c.tribunalStage === 'Arbitral Tribunal') ||
        (forumFilter === 'court' && c.tribunalStage === 'High Court S.34') ||
        (forumFilter === 'vsv' && c.tribunalStage === 'Settled Vsv-II');

      const matchesContractor = contractorFilter === 'all' || c.contractor === contractorFilter;

      return matchesSearch && matchesForum && matchesContractor;
    });
  }, [claimsData, searchQuery, forumFilter, contractorFilter]);

  // Aggregate KPI Calculations
  const kpis = useMemo(() => {
    const totalClaimCr = claimsData.reduce((acc, c) => acc + c.claimAmountCr, 0);
    const totalCounterCr = claimsData.reduce((acc, c) => acc + c.counterClaimCr, 0);
    const totalLdAssessedCr = claimsData.reduce((acc, c) => acc + c.assessedLdCr, 0);
    const totalBgCr = claimsData.reduce((acc, c) => acc + c.bankGuaranteeCr, 0);
    return { totalClaimCr, totalCounterCr, totalLdAssessedCr, totalBgCr };
  }, [claimsData]);

  // Unique contractors for filter
  const contractorOptions = useMemo(() => {
    const set = new Set<string>();
    claimsData.forEach((c) => set.add(c.contractor));
    return Array.from(set);
  }, [claimsData]);

  const handleOpenLdDialog = (claim: ArbitrationClaim) => {
    setSelectedClaim(claim);
    setLdDialogOpen(true);
  };

  const handleOpenBriefDialog = (claim: ArbitrationClaim) => {
    setBriefClaim(claim);
    setBriefModalOpen(true);
  };

  const handleDownloadBrief = () => {
    if (!briefClaim) return;
    setBriefExporting(true);

    setTimeout(() => {
      const doc = [
        '========================================================================================',
        '   GOVERNMENT OF INDIA | NATIONAL HIGHWAYS AUTHORITY OF INDIA (NHAI / MoRTH)',
        '   DISPUTE ADJUDICATION & CCIE CONCILIATION BRIEF - LEGAL DEFENSE DOSSIER',
        '========================================================================================',
        `Case Reference: ${briefClaim.id} / NHAI-LEGAL-2024`,
        `Date Generated: ${new Date().toISOString()}`,
        `Infrastructure Corridor: ${briefClaim.project.name} (${briefClaim.project.id})`,
        `EPC Concessionaire / Contractor: ${briefClaim.contractor}`,
        `Sanctioned Outlay: ₹${briefClaim.project.outlayCr.toLocaleString('en-IN')}.00 Cr`,
        '----------------------------------------------------------------------------------------',
        '1. CONTRACTOR CLAIM QUANTIFICATION:',
        `  - Contractor Disputed Claim: ₹${briefClaim.claimAmountCr.toFixed(2)} Crores`,
        `  - Department Counter-Claim: ₹${briefClaim.counterClaimCr.toFixed(2)} Crores`,
        `  - Liquidated Damages Assessed (Cl. 27): ₹${briefClaim.assessedLdCr.toFixed(2)} Crores`,
        `  - Performance Bank Guarantee in Escrow: ₹${briefClaim.bankGuaranteeCr.toFixed(2)} Crores`,
        `  - Statutory Primary Grounds: ${briefClaim.claimCategory}`,
        '----------------------------------------------------------------------------------------',
        '2. ADJUDICATION / TRIBUNAL FORUM:',
        `  - Active Forum: ${briefClaim.forumName}`,
        `  - Statutory Tier: ${briefClaim.tribunalStage}`,
        `  - Next Scheduled Hearing Date: ${briefClaim.hearingDate}`,
        `  - Bank Guarantee Encashment Status: ${briefClaim.bgStatus}`,
        '----------------------------------------------------------------------------------------',
        '3. STATUTORY DEFENSE & CONTRACT CLAUSE SUBMISSIONS:',
        '  - Contract Cl. 27 (Liquidated Damages for Delay): Contractor failed to achieve Key Milestone 3.',
        '  - Non-Excusable Delay: Weather records confirm rainfall within 10-year IMD empirical norms.',
        '  - RoW Handover: 80% contiguous Right-of-Way delivered on Appointed Date as per EPC Cl. 8.2.',
        '  - Contractor failed to deploy requisite PQC paving trains & hydraulic crawler excavators.',
        '  - Recommendation: Proceed with full counter-claim and contest under Vivad Se Vishwas II limits.',
        '========================================================================================',
      ].join('\n');

      const blob = new Blob([doc], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = `CCIE_Legal_Brief_${briefClaim.project.id}_${briefClaim.id}.txt`;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setBriefExporting(false);
      setBriefModalOpen(false);
    }, 600);
  };

  return (
    <Box sx={{ pb: 3, bgcolor: '#f1f5f9', minHeight: '100vh', m: -3, p: 3 }}>
      {/* Precision Institutional Header Strip */}
      <Paper
        elevation={0}
        sx={{
          p: 2.2,
          mb: 2.2,
          bgcolor: '#ffffff',
          color: '#0f172a',
          borderRadius: 1,
          border: '1px solid #e2e8f0',
          borderLeft: '4px solid #b91c1c',
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between" spacing={2}>
          <Box>
            <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 0.5, flexWrap: 'wrap', gap: 0.5 }}>
              <Box
                sx={{
                  px: 1.2,
                  py: 0.3,
                  borderRadius: 0.5,
                  bgcolor: '#b91c1c',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.72rem',
                  letterSpacing: 0.5,
                }}
              >
                LEGAL &amp; DISPUTE COMMAND CENTER
              </Box>
              <Chip
                icon={<Gavel sx={{ fontSize: '13px !important', color: '#b91c1c' }} />}
                label="FIDIC / EPC CL. 27 ENFORCED"
                size="small"
                sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, bgcolor: '#fef2f2', color: '#b91c1c', border: '1px solid #fecdd3', borderRadius: 0.5 }}
              />
              <Chip
                icon={<Shield sx={{ fontSize: '13px !important', color: '#0284c7' }} />}
                label="CCIE CONCILIATION ACTIVE"
                size="small"
                sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, bgcolor: '#eff6ff', color: '#0284c7', border: '1px solid #bfdbfe', borderRadius: 0.5 }}
              />
              <Chip
                icon={<CheckCircle sx={{ fontSize: '13px !important', color: '#15803d' }} />}
                label="VIVAD SE VISHWAS II COMPLIANT"
                size="small"
                sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, bgcolor: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', borderRadius: 0.5 }}
              />
            </Stack>

            <Typography variant="h5" sx={{ fontWeight: 900, color: '#0f172a', letterSpacing: '-0.01em', fontSize: '1.25rem' }}>
              Arbitration Tribunals, Contractor Claims &amp; Liquidated Damages
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.2, fontSize: '0.78rem' }}>
              Statutory oversight of ₹4,820 Cr contractor dispute claims across EPC, HAM, and BOT concession packages under MoRTH / NHAI Conciliation Framework
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <Button
              variant="outlined"
              size="small"
              startIcon={<PictureAsPdf fontSize="small" />}
              onClick={() => handleOpenBriefDialog(claimsData[0])}
              sx={{
                color: '#0f172a',
                borderColor: '#cbd5e1',
                bgcolor: '#f8fafc',
                fontSize: '0.75rem',
                fontWeight: 700,
                borderRadius: 1,
                textTransform: 'none',
                py: 0.8,
                '&:hover': { bgcolor: '#f1f5f9', borderColor: '#94a3b8' },
              }}
            >
              Export Conciliation Brief
            </Button>
            <Button
              variant="contained"
              size="small"
              startIcon={<Gavel fontSize="small" />}
              onClick={() => handleOpenLdDialog(claimsData[0])}
              sx={{
                bgcolor: '#b91c1c',
                color: '#ffffff',
                fontSize: '0.75rem',
                fontWeight: 800,
                borderRadius: 1,
                py: 0.8,
                textTransform: 'none',
                '&:hover': { bgcolor: '#991b1b' },
              }}
            >
              Assess Clause 27 Penalties
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* 4 Top KPI Metric Cards */}
      <Grid container spacing={2} sx={{ mb: 2.2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 1, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, fontSize: '0.68rem', textTransform: 'uppercase' }}>
                TOTAL DISPUTED CLAIMS
              </Typography>
              <ReceiptLong sx={{ fontSize: 18, color: '#b91c1c' }} />
            </Stack>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#b91c1c', fontFamily: 'monospace', fontSize: '1.45rem', my: 0.5 }}>
              ₹{kpis.totalClaimCr.toLocaleString('en-IN', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} Cr
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem' }}>
              Contractor Claims across 14 Tribunals
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 1, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, fontSize: '0.68rem', textTransform: 'uppercase' }}>
                DEPT COUNTER-CLAIMS
              </Typography>
              <AccountBalance sx={{ fontSize: 18, color: '#0284c7' }} />
            </Stack>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#0284c7', fontFamily: 'monospace', fontSize: '1.45rem', my: 0.5 }}>
              ₹{kpis.totalCounterCr.toLocaleString('en-IN', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} Cr
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem' }}>
              Statutory Counter-Claims Filed
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 1, border: '1px solid #fecdd3', bgcolor: '#fff1f2' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="caption" sx={{ color: '#9f1239', fontWeight: 800, fontSize: '0.68rem', textTransform: 'uppercase' }}>
                CL. 27 LD PENALTIES ASSESSED
              </Typography>
              <Gavel sx={{ fontSize: 18, color: '#9f1239' }} />
            </Stack>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#9f1239', fontFamily: 'monospace', fontSize: '1.45rem', my: 0.5 }}>
              ₹{kpis.totalLdAssessedCr.toLocaleString('en-IN', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} Cr
            </Typography>
            <Typography variant="caption" sx={{ color: '#be123c', fontSize: '0.7rem', fontWeight: 600 }}>
              0.05%/wk of Contract Outlay
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 1, border: '1px solid #bbf7d0', bgcolor: '#f0fdf4' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="caption" sx={{ color: '#15803d', fontWeight: 800, fontSize: '0.68rem', textTransform: 'uppercase' }}>
                BANK GUARANTEES ON LIEN
              </Typography>
              <Shield sx={{ fontSize: 18, color: '#15803d' }} />
            </Stack>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#15803d', fontFamily: 'monospace', fontSize: '1.45rem', my: 0.5 }}>
              ₹{kpis.totalBgCr.toLocaleString('en-IN', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} Cr
            </Typography>
            <Typography variant="caption" sx={{ color: '#166534', fontSize: '0.7rem' }}>
              Secured in Scheduled Commercial Banks
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Filter and Search Ribbon */}
      <Paper elevation={0} sx={{ p: 1.8, mb: 2, borderRadius: 1, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
        <Grid container spacing={1.5} alignItems="center">
          <Grid item xs={12} sm={5}>
            <TextField
              size="small"
              fullWidth
              placeholder="Search highway code, contractor, or claim ground..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ fontSize: 18, color: '#94a3b8' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiInputBase-root': { fontSize: '0.78rem', bgcolor: '#f8fafc' } }}
            />
          </Grid>

          <Grid item xs={6} sm={3.5}>
            <TextField
              select
              size="small"
              fullWidth
              label="Tribunal / Conciliation Stage"
              value={forumFilter}
              onChange={(e) => setForumFilter(e.target.value)}
              sx={{ '& .MuiInputBase-root': { fontSize: '0.78rem', bgcolor: '#f8fafc' } }}
            >
              <MenuItem value="all" sx={{ fontSize: '0.78rem' }}>All Statutory Stages (14)</MenuItem>
              <MenuItem value="dab" sx={{ fontSize: '0.78rem' }}>Dispute Adjudication Board (DAB)</MenuItem>
              <MenuItem value="ccie" sx={{ fontSize: '0.78rem' }}>Conciliation Committee (CCIE)</MenuItem>
              <MenuItem value="tribunal" sx={{ fontSize: '0.78rem' }}>Arbitral Tribunal (DIAC / ICA)</MenuItem>
              <MenuItem value="court" sx={{ fontSize: '0.78rem' }}>High Court Section 34 / 37</MenuItem>
              <MenuItem value="vsv" sx={{ fontSize: '0.78rem' }}>Settled Under Vivad Se Vishwas II</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={6} sm={3.5}>
            <TextField
              select
              size="small"
              fullWidth
              label="EPC Concessionaire"
              value={contractorFilter}
              onChange={(e) => setContractorFilter(e.target.value)}
              sx={{ '& .MuiInputBase-root': { fontSize: '0.78rem', bgcolor: '#f8fafc' } }}
            >
              <MenuItem value="all" sx={{ fontSize: '0.78rem' }}>All Contractors ({contractorOptions.length})</MenuItem>
              {contractorOptions.map((c) => (
                <MenuItem key={c} value={c} sx={{ fontSize: '0.78rem' }}>{c}</MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* Main Arbitration Claims High-Density Table */}
      <Paper elevation={0} sx={{ borderRadius: 1, border: '1px solid #e2e8f0', bgcolor: '#ffffff', overflow: 'hidden' }}>
        <Box sx={{ px: 2.2, py: 1.6, borderBottom: '1px solid #e2e8f0', bgcolor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Stack direction="row" spacing={1.2} alignItems="center">
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.85rem' }}>
              Active Contractor Claims &amp; Arbitral Proceedings Register
            </Typography>
            <Chip
              label={`${filteredClaims.length} Active Matters`}
              size="small"
              sx={{ height: 20, fontSize: '0.65rem', fontWeight: 800, bgcolor: '#e2e8f0', color: '#334155' }}
            />
          </Stack>
          <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.72rem', fontFamily: 'monospace' }}>
            GovNet DIAC-CCIE Synced
          </Typography>
        </Box>

        <Box sx={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.76rem' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #cbd5e1', textAlign: 'left', color: '#475569' }}>
                <th style={{ padding: '10px 14px', fontWeight: 800, width: '15%' }}>HIGHWAY CODE &amp; PROJECT</th>
                <th style={{ padding: '10px 14px', fontWeight: 800, width: '15%' }}>CONTRACTOR</th>
                <th style={{ padding: '10px 14px', fontWeight: 800, width: '15%' }}>CLAIM GROUNDS</th>
                <th style={{ padding: '10px 14px', fontWeight: 800, width: '12%', textAlign: 'right' }}>CONTRACTOR CLAIM</th>
                <th style={{ padding: '10px 14px', fontWeight: 800, width: '12%', textAlign: 'right' }}>DEPT COUNTER-CLAIM</th>
                <th style={{ padding: '10px 14px', fontWeight: 800, width: '15%' }}>TRIBUNAL FORUM &amp; STAGE</th>
                <th style={{ padding: '10px 14px', fontWeight: 800, width: '16%', textAlign: 'center' }}>STATUTORY ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredClaims.map((item, idx) => (
                <tr
                  key={item.id}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafafa',
                  }}
                >
                  <td style={{ padding: '12px 14px', verticalAlign: 'top' }}>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f172a', fontFamily: 'monospace', fontSize: '0.78rem' }}>
                      {item.project.id}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#475569', display: 'block', fontWeight: 600, fontSize: '0.72rem', mt: 0.2 }}>
                      {item.project.name}
                    </Typography>
                    <Stack direction="row" spacing={0.8} sx={{ mt: 0.5 }}>
                      <Chip label={item.project.state} size="small" sx={{ height: 16, fontSize: '0.6rem', fontWeight: 700, bgcolor: '#f1f5f9', color: '#475569' }} />
                      <Chip label={`Ch. ${item.project.chainage}`} size="small" sx={{ height: 16, fontSize: '0.6rem', fontWeight: 700, bgcolor: '#f1f5f9', color: '#475569', fontFamily: 'monospace' }} />
                    </Stack>
                  </td>

                  <td style={{ padding: '12px 14px', verticalAlign: 'top' }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.76rem' }}>
                      {item.contractor}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontSize: '0.68rem', mt: 0.3 }}>
                      Sanctioned: ₹{item.project.outlayCr.toLocaleString('en-IN')}.00 Cr
                    </Typography>
                    <Chip
                      label={`BG: ₹${item.bankGuaranteeCr} Cr (${item.bgStatus})`}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: '0.62rem',
                        fontWeight: 700,
                        mt: 0.5,
                        bgcolor: item.bgStatus === 'Active Lien' ? '#f0fdf4' : item.bgStatus === 'Invoked' ? '#fff1f2' : '#fffbeb',
                        color: item.bgStatus === 'Active Lien' ? '#15803d' : item.bgStatus === 'Invoked' ? '#be123c' : '#b45309',
                        border: '1px solid currentColor',
                      }}
                    />
                  </td>

                  <td style={{ padding: '12px 14px', verticalAlign: 'top' }}>
                    <Box
                      sx={{
                        display: 'inline-block',
                        px: 1,
                        py: 0.3,
                        borderRadius: 0.5,
                        bgcolor: '#fef2f2',
                        color: '#b91c1c',
                        fontWeight: 800,
                        fontSize: '0.68rem',
                        mb: 0.4,
                      }}
                    >
                      {item.claimCategory}
                    </Box>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontSize: '0.68rem' }}>
                      Primary contractual grounds submitted in Statement of Claim
                    </Typography>
                  </td>

                  <td style={{ padding: '12px 14px', verticalAlign: 'top', textAlign: 'right' }}>
                    <Typography variant="body2" sx={{ fontWeight: 900, color: '#b91c1c', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                      ₹{item.claimAmountCr.toFixed(2)} Cr
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.65rem' }}>
                      Interest @ 10% p.a.
                    </Typography>
                  </td>

                  <td style={{ padding: '12px 14px', verticalAlign: 'top', textAlign: 'right' }}>
                    <Typography variant="body2" sx={{ fontWeight: 900, color: '#0284c7', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                      ₹{item.counterClaimCr.toFixed(2)} Cr
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#be123c', display: 'block', fontSize: '0.65rem', fontWeight: 700 }}>
                      Cl. 27 LD: ₹{item.assessedLdCr.toFixed(2)} Cr
                    </Typography>
                  </td>

                  <td style={{ padding: '12px 14px', verticalAlign: 'top' }}>
                    <Chip
                      label={item.tribunalStage}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: '0.62rem',
                        fontWeight: 800,
                        mb: 0.4,
                        bgcolor:
                          item.tribunalStage === 'Arbitral Tribunal'
                            ? '#fef2f2'
                            : item.tribunalStage === 'CCIE'
                            ? '#eff6ff'
                            : item.tribunalStage === 'DAB'
                            ? '#f8fafc'
                            : '#f0fdf4',
                        color:
                          item.tribunalStage === 'Arbitral Tribunal'
                            ? '#b91c1c'
                            : item.tribunalStage === 'CCIE'
                            ? '#0284c7'
                            : item.tribunalStage === 'DAB'
                            ? '#475569'
                            : '#15803d',
                        border: '1px solid currentColor',
                      }}
                    />
                    <Typography variant="caption" sx={{ color: '#0f172a', display: 'block', fontWeight: 600, fontSize: '0.7rem' }}>
                      {item.forumName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontSize: '0.65rem', mt: 0.3 }}>
                      Next Session: <strong style={{ color: '#0f172a' }}>{item.hearingDate}</strong>
                    </Typography>
                  </td>

                  <td style={{ padding: '12px 14px', verticalAlign: 'top', textAlign: 'center' }}>
                    <Stack spacing={0.6} alignItems="center">
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleOpenLdDialog(item)}
                        sx={{
                          bgcolor: '#b91c1c',
                          color: '#ffffff',
                          fontSize: '0.66rem',
                          fontWeight: 800,
                          textTransform: 'none',
                          py: 0.3,
                          px: 1,
                          width: '100%',
                          '&:hover': { bgcolor: '#991b1b' },
                        }}
                      >
                        Invoke Cl. 27 Damages
                      </Button>

                      <Stack direction="row" spacing={0.5} sx={{ width: '100%' }}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleOpenBriefDialog(item)}
                          sx={{
                            color: '#475569',
                            borderColor: '#cbd5e1',
                            fontSize: '0.64rem',
                            fontWeight: 700,
                            textTransform: 'none',
                            py: 0.2,
                            flex: 1,
                            '&:hover': { bgcolor: '#f1f5f9' },
                          }}
                        >
                          CCIE Brief
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => navigate(`/milestones?id=${item.project.id}`)}
                          sx={{
                            color: '#0284c7',
                            borderColor: '#bfdbfe',
                            fontSize: '0.64rem',
                            fontWeight: 700,
                            textTransform: 'none',
                            py: 0.2,
                            flex: 1,
                            '&:hover': { bgcolor: '#eff6ff' },
                          }}
                        >
                          Dossier
                        </Button>
                      </Stack>
                    </Stack>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Paper>

      {/* Liquidated Damages Dialog */}
      {selectedClaim && (
        <LiquidatedDamagesDialog
          open={ldDialogOpen}
          onClose={() => setLdDialogOpen(false)}
          projectCode={selectedClaim.project.id}
          projectName={selectedClaim.project.name}
          contractor={selectedClaim.contractor}
          outlayCr={selectedClaim.project.outlayCr}
          slipDays={selectedClaim.project.predictedDelayDays}
        />
      )}

      {/* CCIE Defense Brief Dialog */}
      {briefClaim && (
        <Dialog open={briefModalOpen} onClose={() => setBriefModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ pb: 1, borderBottom: '1px solid #e2e8f0' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={1} alignItems="center">
                <Shield sx={{ color: '#0284c7' }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                  Generate CCIE Conciliation Defense Brief
                </Typography>
              </Stack>
              <Button size="small" onClick={() => setBriefModalOpen(false)} sx={{ minWidth: 32, p: 0.5 }}>
                <Close fontSize="small" />
              </Button>
            </Stack>
          </DialogTitle>

          <DialogContent sx={{ pt: 2.5 }}>
            <Alert severity="info" sx={{ mb: 2, fontSize: '0.75rem' }}>
              This official defense brief will be compiled pursuant to <strong>MoRTH Conciliation Guidelines 2023</strong> and the <strong>Arbitration and Conciliation Act, 1996</strong> for submission to the CCIE Bench.
            </Alert>

            <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 1, mb: 2 }}>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, fontSize: '0.65rem' }}>
                CORRIDOR &amp; CONTRACTOR DOSSIER
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f172a', mt: 0.3 }}>
                {briefClaim.project.id} &bull; {briefClaim.project.name}
              </Typography>
              <Typography variant="caption" sx={{ color: '#475569', display: 'block' }}>
                Concessionaire: <strong>{briefClaim.contractor}</strong>
              </Typography>

              <Divider sx={{ my: 1.5 }} />

              <Grid container spacing={1.5}>
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.65rem' }}>CONTRACTOR CLAIM</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#b91c1c', fontFamily: 'monospace' }}>
                    ₹{briefClaim.claimAmountCr.toFixed(2)} Cr
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.65rem' }}>DEPT COUNTER-CLAIM</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#0284c7', fontFamily: 'monospace' }}>
                    ₹{briefClaim.counterClaimCr.toFixed(2)} Cr
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.65rem' }}>CL. 27 DAMAGES ASSESSED</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#9f1239', fontFamily: 'monospace' }}>
                    ₹{briefClaim.assessedLdCr.toFixed(2)} Cr
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.65rem' }}>BANK GUARANTEE SECURED</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#15803d', fontFamily: 'monospace' }}>
                    ₹{briefClaim.bankGuaranteeCr.toFixed(2)} Cr
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>
              Includes Hindrance Register audit logs, IMD rainfall correlation proof, contiguous 80% RoW chainage handover certificates, and CALA disbursement ledgers.
            </Typography>
          </DialogContent>

          <DialogActions sx={{ p: 2, borderTop: '1px solid #e2e8f0' }}>
            <Button onClick={() => setBriefModalOpen(false)} sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleDownloadBrief}
              disabled={briefExporting}
              startIcon={<PictureAsPdf />}
              sx={{ bgcolor: '#0284c7', color: '#ffffff', fontSize: '0.75rem', fontWeight: 800, '&:hover': { bgcolor: '#0369a1' } }}
            >
              {briefExporting ? 'Generating Brief...' : 'Download Certified CCIE Brief'}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
