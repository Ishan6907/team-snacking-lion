import { useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Checkbox,
  Chip,
  Paper,
  IconButton,
  Collapse,
  Button,
} from '@mui/material';
import {
  CheckCircle,
  WarningAmber,
  Schedule,
  KeyboardArrowDown,
  KeyboardArrowUp,
  FilePresent,
  Shield,
  Fingerprint,
} from '@mui/icons-material';
import type { ParcelData } from './GisMapCanvas';
import AuditDocumentModal, { type AuditDocument } from './AuditDocumentModal';

interface LegalChecklistProps {
  parcel: ParcelData;
}

export default function LegalChecklist({ parcel }: LegalChecklistProps) {
  const [items, setItems] = useState<AuditDocument[]>([
    {
      id: 'doc-1',
      title: 'Title Deed & Revenue Record of Rights (RoR 7/12)',
      documentType: 'Registered Sale Deed No. 4412/2016',
      authority: 'Tehsildar & Sub-Registrar Office (SRO)',
      status: 'verified',
      date: '14-May-2024',
      citation: 'UP-REV-KHATAUNI-2024-00918',
      remarks: 'Khatauni mutation confirmed. Clear hereditary title without undivided co-parcener claims.',
      hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      blockNumber: 14892104,
      signatory: 'Shri A.K. Sharma, Sub-Registrar / SRO Sadar',
      clauses: [
        'Khasra title mutation entered in Jamabandi Volume IV, Folio 182 without encumbrance.',
        'No minor coparcener or Hindu Undivided Family (HUF) adverse claims registered.',
        'Boundaries demarcated: North by canal, South by PWD road, East by Plot 142/4, West by Govt RoW.',
      ],
    },
    {
      id: 'doc-2',
      title: '30-Year Encumbrance Certificate (EC)',
      documentType: 'Form No. 15 (Nil Encumbrance)',
      authority: 'District Registration Department',
      status: 'verified',
      date: '02-Jun-2024',
      citation: 'EC-SR-SEARCH-1994-2024-PASS',
      remarks: 'No mortgage, hypothecation, or registered bank liens found in the 30-year search window.',
      hash: '7d5a99f603f2c1a6520f139605d3e7c8d78302ac05297040f3ee189d3c186ec4',
      blockNumber: 14892108,
      signatory: 'District Registrar & Encumbrance Officer',
      clauses: [
        'Search conducted across Books 1 through 4 from 1st April 1994 to 31st May 2024.',
        'Zero subsisting registered mortgages, charges, court attachments, or lis pendens found.',
        'Tenure holder possesses absolute alienable title free from crown or municipal revenue dues.',
      ],
    },
    {
      id: 'doc-3',
      title: 'Section 3A/3D Statutory Land Acquisition Gazette',
      documentType: 'Gazette S.O. 1892(E) Notification',
      authority: 'Ministry of Road Transport & Highways / CALA',
      status: parcel.acquisitionStatus === 'disputed' ? 'flagged' : 'verified',
      date: '18-Aug-2024',
      citation: 'GAZ-MORTH-NH48-SEC3D-8821',
      remarks: parcel.acquisitionStatus === 'disputed'
        ? 'Active Writ Petition filed in High Court challenging tree compensation valuation.'
        : 'Statutory 21-day objection period elapsed without adverse claims.',
      hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      blockNumber: 14892115,
      signatory: 'Competent Authority & District Land Officer',
      clauses: [
        'Section 3A declaration published in national dailies and state gazette notification.',
        'Section 3D vesting declaration issued: Land vests absolutely in Central Govt free from encumbrances.',
        'Survey verified by CALA Joint Measurement Survey (JMS) with geodetic RTK coordinates.',
      ],
    },
    {
      id: 'doc-4',
      title: 'MoEFCC Forest & Eco-Sensitive Clearance',
      documentType: 'Stage-I Forest Diversion Clearance',
      authority: 'Ministry of Environment, Forest & Climate Change',
      status: 'verified',
      date: '10-Oct-2024',
      citation: 'MOEF-FC-STAGE1-2024-771',
      remarks: 'Compensatory Afforestation (CA) funds deposited in CAMPA head. Tree-felling permission active.',
      hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      blockNumber: 14892122,
      signatory: 'Principal Chief Conservator of Forests (PCCF)',
      clauses: [
        'Diversion of 0.85 ha forest land permitted under Section 2 of Forest Conservation Act, 1980.',
        'Net Present Value (NPV) ₹9.85 Lakhs deposited with CAMPA ad-hoc authority.',
        'Mandatory plantation of 1,000 indigenous saplings along designated right-of-way.',
      ],
    },
    {
      id: 'doc-5',
      title: 'Utility Relocation NOC (GAIL / Discom / Jal Nigam)',
      documentType: 'Composite Utility Shifting Clearance',
      authority: 'District Joint Utility Clearance Committee',
      status: parcel.acquisitionStatus === 'compensation_pending' ? 'pending' : 'verified',
      date: '05-Nov-2024',
      citation: 'NOC-UTIL-SHIF-2024-118',
      remarks: parcel.acquisitionStatus === 'compensation_pending'
        ? '33kV transmission pole shifting estimate under administrative financial sanction.'
        : 'Gas pipeline encasement completed. Underground fiber duct relocated outside RoW.',
      hash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
      blockNumber: 14892130,
      signatory: 'Superintending Engineer & Nodal Officer',
      clauses: [
        'GAIL gas line depressurization and caging protocol approved by safety directorate.',
        'State Discom 33kV overhead lines shifting scheduled during planned shutdown window.',
        'Potable water transmission main bypass connected with zero interruption to local habitation.',
      ],
    },
  ]);

  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<AuditDocument | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const toggleStatus = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const nextStatus: Record<string, 'verified' | 'pending' | 'flagged'> = {
          verified: 'pending',
          pending: 'flagged',
          flagged: 'verified',
        };
        return { ...item, status: nextStatus[item.status] };
      })
    );
  };

  const openAuditModal = (doc: AuditDocument) => {
    setSelectedDoc(doc);
    setModalOpen(true);
  };

  const getStatusBadge = (status: 'verified' | 'pending' | 'flagged') => {
    switch (status) {
      case 'verified':
        return (
          <Chip
            icon={<CheckCircle sx={{ fontSize: '12px !important', color: '#15803d' }} />}
            label="VERIFIED"
            size="small"
            sx={{
              height: 20,
              bgcolor: '#f0fdf4',
              color: '#15803d',
              fontWeight: 800,
              fontSize: '0.62rem',
              letterSpacing: 0.5,
              border: '1px solid #bbf7d0',
              borderRadius: 0.5,
            }}
          />
        );
      case 'pending':
        return (
          <Chip
            icon={<Schedule sx={{ fontSize: '12px !important', color: '#b45309' }} />}
            label="IN REVIEW"
            size="small"
            sx={{
              height: 20,
              bgcolor: '#fffbeb',
              color: '#b45309',
              fontWeight: 800,
              fontSize: '0.62rem',
              letterSpacing: 0.5,
              border: '1px solid #fde68a',
              borderRadius: 0.5,
            }}
          />
        );
      case 'flagged':
        return (
          <Chip
            icon={<WarningAmber sx={{ fontSize: '12px !important', color: '#b91c1c' }} />}
            label="EXCEPTION"
            size="small"
            sx={{
              height: 20,
              bgcolor: '#fef2f2',
              color: '#b91c1c',
              fontWeight: 800,
              fontSize: '0.62rem',
              letterSpacing: 0.5,
              border: '1px solid #fecaca',
              borderRadius: 0.5,
            }}
          />
        );
    }
  };

  const verifiedCount = items.filter((i) => i.status === 'verified').length;
  const readinessPct = Math.round((verifiedCount / items.length) * 100);

  return (
    <Box sx={{ color: '#0f172a' }}>
      {/* Top Header & Readiness Bar */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
        <Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <Shield sx={{ fontSize: 16, color: '#0b2545' }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0b2545', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.76rem' }}>
              Statutory Clearances Checklist
            </Typography>
          </Stack>
          <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.74rem' }}>
            5 Mandatory Instruments for {parcel.surveyNo} ({parcel.khasraNo})
          </Typography>
        </Box>

        <Chip
          label={`${readinessPct}% TITLE READY`}
          size="small"
          sx={{
            fontWeight: 800,
            fontFamily: 'monospace',
            letterSpacing: 0.5,
            bgcolor: readinessPct >= 80 ? '#f0fdf4' : '#fffbeb',
            color: readinessPct >= 80 ? '#15803d' : '#b45309',
            border: readinessPct >= 80 ? '1px solid #bbf7d0' : '1px solid #fde68a',
            fontSize: '0.68rem',
            borderRadius: 0.5,
          }}
        />
      </Stack>

      {/* Checklist Instruments */}
      <Stack spacing={1.2}>
        {items.map((item) => {
          const isExpanded = expandedItem === item.id;

          return (
            <Paper
              elevation={0}
              key={item.id}
              sx={{
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
              <Box sx={{ p: 1.5, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
                <Stack direction="row" spacing={1.2} alignItems="flex-start" sx={{ flexGrow: 1 }}>
                  <Checkbox
                    size="small"
                    checked={item.status === 'verified'}
                    indeterminate={item.status === 'pending'}
                    onClick={() => toggleStatus(item.id)}
                    sx={{
                      p: 0,
                      mt: 0.2,
                      color: item.status === 'flagged' ? '#ef4444' : '#94a3b8',
                      '&.Mui-checked': { color: '#15803d' },
                    }}
                  />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.82rem', lineHeight: 1.3 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.72rem', display: 'block', mt: 0.2 }}>
                      {item.documentType} &bull; <span style={{ color: '#334155', fontWeight: 600 }}>{item.authority}</span>
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  {getStatusBadge(item.status)}
                  <IconButton
                    size="small"
                    onClick={() => setExpandedItem(isExpanded ? null : item.id)}
                    sx={{ color: '#64748b', p: 0.2 }}
                  >
                    {isExpanded ? <KeyboardArrowUp fontSize="small" /> : <KeyboardArrowDown fontSize="small" />}
                  </IconButton>
                </Stack>
              </Box>

              <Collapse in={isExpanded}>
                <Box sx={{ px: 2, pb: 1.8, pt: 0.8, borderTop: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
                  <Typography variant="caption" sx={{ color: '#334155', fontSize: '0.74rem', display: 'block', mb: 1, lineHeight: 1.4 }}>
                    <strong style={{ color: '#0f172a' }}>Legal Findings:</strong> {item.remarks}
                  </Typography>

                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <Fingerprint sx={{ fontSize: 14, color: '#0284c7' }} />
                    <Typography variant="caption" sx={{ color: '#0284c7', fontFamily: 'monospace', fontSize: '0.68rem' }}>
                      HASH: {item.hash.slice(0, 16)}...{item.hash.slice(-8)}
                    </Typography>
                  </Stack>

                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" sx={{ color: '#64748b', fontFamily: 'monospace', fontSize: '0.68rem' }}>
                      CIT: {item.citation}
                    </Typography>
                    <Button
                      size="small"
                      startIcon={<FilePresent sx={{ fontSize: '14px !important' }} />}
                      onClick={() => openAuditModal(item)}
                      sx={{
                        color: '#0b2545',
                        bgcolor: '#eff6ff',
                        border: '1px solid #bfdbfe',
                        fontSize: '0.7rem',
                        textTransform: 'none',
                        py: 0.3,
                        px: 1,
                        fontWeight: 700,
                        '&:hover': { bgcolor: '#dbeafe' },
                      }}
                    >
                      Audit Scan &amp; Proof
                    </Button>
                  </Stack>
                </Box>
              </Collapse>
            </Paper>
          );
        })}
      </Stack>

      {/* Cryptographic Document Modal */}
      <AuditDocumentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        document={selectedDoc}
        parcel={parcel}
      />
    </Box>
  );
}
