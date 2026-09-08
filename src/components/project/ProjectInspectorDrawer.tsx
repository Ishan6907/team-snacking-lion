import { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Stack,
  Divider,
  Button,
  Chip,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Close,
  OpenInNew,
  CheckCircle,
  Schedule,
  Flag,
  WarningAmber,
  AssignmentTurnedIn,
  Policy,
} from "@mui/icons-material";
import { formatCurrency, formatDelayDays } from "@/utils/formatters";
import MoRDGovernanceModule from "../mord/MoRDGovernanceModule";

interface ProjectInspectorDrawerProps {
  open: boolean;
  onClose: () => void;
  project: any;
}

export default function ProjectInspectorDrawer({
  open,
  onClose,
  project,
}: ProjectInspectorDrawerProps) {
  const [escalated, setEscalated] = useState(false);
  const [mordOpen, setMordOpen] = useState(false);

  if (!project) return null;

  const handleOpenDossier = () => {
    window.open("/dossier.html", "_blank");
  };

  const handleEscalate = () => {
    setEscalated(true);
    // In a real app, dispatch an API call to pragmatic backend here.
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: 520,
            bgcolor: "#f8fafc",
            borderLeft: "1px solid #e2e8f0",
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{ p: 3, bgcolor: "#ffffff", borderBottom: "1px solid #e2e8f0" }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            sx={{ mb: 2 }}
          >
            <Box>
              <Typography
                variant="overline"
                sx={{ fontWeight: 800, color: "#64748b", letterSpacing: 1 }}
              >
                {project.mospiCode || `MOSPI-${project.id.toUpperCase()}`}
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  color: "#0f172a",
                  lineHeight: 1.2,
                  mt: 0.5,
                }}
              >
                {project.name}
              </Typography>
            </Box>
            <IconButton
              onClick={onClose}
              size="small"
              sx={{ color: "#64748b" }}
            >
              <Close />
            </IconButton>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Chip
              label={project.sector}
              size="small"
              sx={{
                bgcolor: "#f1f5f9",
                color: "#475569",
                fontWeight: 600,
                fontSize: "0.75rem",
              }}
            />
            <Chip
              label={project.state}
              size="small"
              sx={{
                bgcolor: "#f1f5f9",
                color: "#475569",
                fontWeight: 600,
                fontSize: "0.75rem",
              }}
            />
            <Chip
              label={project.riskLevel.toUpperCase()}
              size="small"
              color={
                project.riskLevel === "critical"
                  ? "error"
                  : project.riskLevel === "high"
                    ? "warning"
                    : "success"
              }
              sx={{ fontWeight: 800, fontSize: "0.7rem", letterSpacing: 0.5 }}
            />
          </Stack>
        </Box>

        {/* Content Body */}
        <Box sx={{ p: 3, flexGrow: 1, overflowY: "auto" }}>
          {/* Section: Financials & Baseline */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 800,
                color: "#0b2545",
                textTransform: "uppercase",
                letterSpacing: 0.8,
                display: "block",
                mb: 1.5,
                fontSize: "0.7rem",
              }}
            >
              01 &bull; Financial Sanction & Progress
            </Typography>

            <Stack spacing={2}>
              <Box
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
              >
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: 1,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: "#64748b", display: "block", mb: 0.5 }}
                  >
                    Original Sanctioned Cost
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 800,
                      color: "#0f172a",
                      fontFamily: "monospace",
                    }}
                  >
                    {formatCurrency(project.sanctionedCost)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: 1,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: "#64748b", display: "block", mb: 0.5 }}
                  >
                    Cumulative Expenditure
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 800,
                      color: "#0f172a",
                      fontFamily: "monospace",
                    }}
                  >
                    {formatCurrency(project.expenditure)}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  p: 2,
                  bgcolor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 1,
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 1 }}
                >
                  <Typography variant="caption" sx={{ color: "#64748b" }}>
                    Physical Progress Validation
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 800, color: "#0f172a" }}
                  >
                    {project.physicalProgress}%
                  </Typography>
                </Stack>
                <Box
                  sx={{
                    width: "100%",
                    height: 6,
                    bgcolor: "#f1f5f9",
                    borderRadius: 3,
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      width: `${project.physicalProgress}%`,
                      height: "100%",
                      bgcolor: "#0b2545",
                    }}
                  />
                </Box>
              </Box>
            </Stack>
          </Box>

          {/* Section: Risk & Temporal Delay */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 800,
                color: "#0b2545",
                textTransform: "uppercase",
                letterSpacing: 0.8,
                display: "block",
                mb: 1.5,
                fontSize: "0.7rem",
              }}
            >
              02 &bull; Predictive Temporal Analysis
            </Typography>

            <Box
              sx={{
                p: 2,
                bgcolor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: 1,
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 1,
                    bgcolor:
                      (project as any).delayDays > 180 ? "#fef2f2" : "#fffbeb",
                    color:
                      (project as any).delayDays > 180 ? "#b91c1c" : "#b45309",
                    display: "flex",
                  }}
                >
                  <Schedule fontSize="medium" />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 700, color: "#0f172a" }}
                    >
                      Historical Delay Recorded
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 800,
                        fontFamily: "monospace",
                        color: "#b91c1c",
                      }}
                    >
                      {formatDelayDays((project as any).delayDays)}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mt: 0.5 }}
                  >
                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                      Forecasted Milestone Slippage
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 800,
                        fontFamily: "monospace",
                        color: "#c2410c",
                      }}
                    >
                      +{formatDelayDays((project as any).predictedDelay ?? 0)}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </Box>
          </Box>

          {/* Section: Statutory Bottlenecks & Critical Path */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 800,
                color: "#0b2545",
                textTransform: "uppercase",
                letterSpacing: 0.8,
                display: "block",
                mb: 1.5,
                fontSize: "0.7rem",
              }}
            >
              03 &bull; Statutory & Technical Roadblocks
            </Typography>

            <Stack spacing={1.5}>
              {/* Primary Bottleneck notice */}
              <Box
                sx={{
                  p: 2,
                  borderRadius: 1,
                  bgcolor: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderLeft: "4px solid #b91c1c",
                }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ mb: 0.8 }}
                >
                  <WarningAmber sx={{ fontSize: 16, color: "#b91c1c" }} />
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 800,
                      color: "#b91c1c",
                      textTransform: "uppercase",
                      fontSize: "0.7rem",
                    }}
                  >
                    Primary Critical-Path Impediment
                  </Typography>
                </Stack>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#7f1d1d",
                    fontSize: "0.82rem",
                    lineHeight: 1.5,
                  }}
                >
                  {project.primaryBottleneck ||
                    "Inter-agency utility diversion and pending forest conservation clearances."}
                </Typography>
              </Box>

              {/* Clearance Milestone */}
              {project.clearanceMilestone && (
                <Box
                  sx={{
                    p: 1.8,
                    borderRadius: 1,
                    bgcolor: "#eff6ff",
                    border: "1px solid #bfdbfe",
                    borderLeft: "4px solid #1d4ed8",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 0.5 }}
                  >
                    <AssignmentTurnedIn
                      sx={{ fontSize: 16, color: "#1d4ed8" }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 800,
                        color: "#1d4ed8",
                        textTransform: "uppercase",
                        fontSize: "0.7rem",
                      }}
                    >
                      Key Milestone Under Adjudication
                    </Typography>
                  </Stack>
                  <Typography
                    variant="body2"
                    sx={{ color: "#1e40af", fontSize: "0.82rem" }}
                  >
                    {project.clearanceMilestone}
                  </Typography>
                </Box>
              )}

              {/* Metadata attributes */}
              <Box
                sx={{
                  p: 2,
                  borderRadius: 1,
                  bgcolor: "#f8fafc",
                  border: "1px solid #e2e8f0",
                }}
              >
                <Stack spacing={1.2}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                      Implementing Agency
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 700,
                        color: "#0f172a",
                        textAlign: "right",
                      }}
                    >
                      {project.implementingAgency || "Central Authority"}
                    </Typography>
                  </Stack>
                  <Divider sx={{ borderColor: "#e2e8f0" }} />
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                      Lead Contractor
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 700,
                        color: "#0f172a",
                        textAlign: "right",
                      }}
                    >
                      {project.contractor || "EPC Consortium"}
                    </Typography>
                  </Stack>
                  <Divider sx={{ borderColor: "#e2e8f0" }} />
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                      Cabinet Note Reference
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 800,
                        color: "#0b2545",
                        fontFamily: "monospace",
                      }}
                    >
                      {project.cabinetNoteRef || "PMO/PRAGATI/2025/REV"}
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Box>

        {/* Action Bottom Bar */}
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid #e2e8f0",
            bgcolor: "#ffffff",
          }}
        >
          <Stack spacing={1.5}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<Policy />}
              onClick={() => setMordOpen(true)}
              sx={{
                bgcolor: "#047857",
                color: "#ffffff",
                "&:hover": { bgcolor: "#065f46" },
                fontWeight: 800,
                fontSize: "0.82rem",
                textTransform: "none",
                py: 1,
              }}
            >
              Initiate MoRD Land & Policy Interventions
            </Button>

            <Button
              variant="outlined"
              fullWidth
              startIcon={<OpenInNew />}
              onClick={handleOpenDossier}
              sx={{
                borderColor: "#0b2545",
                color: "#0b2545",
                "&:hover": { bgcolor: "#f1f5f9" },
                fontWeight: 800,
                fontSize: "0.82rem",
                textTransform: "none",
                py: 1,
              }}
            >
              Open Full Analytical Dossier
            </Button>

            <Button
              variant="outlined"
              fullWidth
              startIcon={<Flag />}
              onClick={handleEscalate}
              sx={{
                borderColor: "#cbd5e1",
                color: "#475569",
                "&:hover": {
                  borderColor: "#b91c1c",
                  color: "#b91c1c",
                  bgcolor: "#fef2f2",
                },
                fontWeight: 700,
                fontSize: "0.78rem",
                textTransform: "none",
                py: 0.8,
              }}
            >
              Escalate to Cabinet Committee
            </Button>
          </Stack>
        </Box>
      </Drawer>

      <MoRDGovernanceModule
        open={mordOpen}
        onClose={() => setMordOpen(false)}
        projectInfo={project}
      />

      <Snackbar
        open={escalated}
        autoHideDuration={4000}
        onClose={() => setEscalated(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity="success"
          icon={<CheckCircle fontSize="inherit" />}
          sx={{
            bgcolor: "#f0fdf4",
            color: "#15803d",
            border: "1px solid #bbf7d0",
            fontFamily: "monospace",
            fontSize: "0.78rem",
          }}
        >
          Dispatched escalation brief for {project.mospiCode || project.id} to
          Cabinet Secretariat PRAGATI desk.
        </Alert>
      </Snackbar>
    </>
  );
}
