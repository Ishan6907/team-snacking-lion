import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stack,
  Divider,
  Chip,
  Tabs,
  Tab,
  LinearProgress,
  Paper,
} from "@mui/material";
import {
  Terrain,
  Landscape,
  Description,
  Policy,
  Warning,
  CheckCircle,
  AccountBalance,
  Science,
} from "@mui/icons-material";

interface MoRDGovernanceModuleProps {
  open: boolean;
  onClose: () => void;
  projectInfo: any;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`mord-tabpanel-${index}`}
      aria-labelledby={`mord-tab-${index}`}
      {...other}
      style={{ height: "100%", overflow: "auto" }}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function MoRDGovernanceModule({
  open,
  onClose,
  projectInfo,
}: MoRDGovernanceModuleProps) {
  const [value, setValue] = React.useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{ sx: { height: "85vh", bgcolor: "#f8fafc" } }}
    >
      <DialogTitle
        sx={{ borderBottom: "1px solid #e2e8f0", bgcolor: "#ffffff", p: 3 }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box>
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{ mb: 1 }}
            >
              <AccountBalance sx={{ color: "#0b2545", fontSize: 28 }} />
              <Typography
                variant="h5"
                sx={{ fontWeight: 800, color: "#0b2545", letterSpacing: -0.5 }}
              >
                MoRD Land Governance & Policy Engine
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ color: "#475569" }}>
              Integrating DoLR/MoRD Statutory Directives for{" "}
              {projectInfo?.name || "Selected Project"}
            </Typography>
          </Box>
          <Chip
            label="SIH 2026: MoRD Integration"
            size="small"
            sx={{ bgcolor: "#dbeafe", color: "#1e40af", fontWeight: 700 }}
          />
        </Stack>
      </DialogTitle>

      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "#ffffff",
          px: 3,
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab
            icon={<Warning />}
            iconPosition="start"
            label="25017: Predictive Land Delays"
            sx={{ fontWeight: 700, textTransform: "none" }}
          />
          <Tab
            icon={<Terrain />}
            iconPosition="start"
            label="26015: Geo-Watershed Analysis"
            sx={{ fontWeight: 700, textTransform: "none" }}
          />
          <Tab
            icon={<Landscape />}
            iconPosition="start"
            label="26016: Nat. Land Acquisition"
            sx={{ fontWeight: 700, textTransform: "none" }}
          />
          <Tab
            icon={<Description />}
            iconPosition="start"
            label="26018: AI Record Digitization"
            sx={{ fontWeight: 700, textTransform: "none" }}
          />
          <Tab
            icon={<Science />}
            iconPosition="start"
            label="26019: Policy Sandbox"
            sx={{ fontWeight: 700, textTransform: "none" }}
          />
        </Tabs>
      </Box>

      <DialogContent sx={{ p: 0, bgcolor: "#f1f5f9" }}>
        {/* 25017: Predictive Land Delays */}
        <CustomTabPanel value={value} index={0}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 800, color: "#0f172a", mb: 1 }}
          >
            AI-Powered Predictive Detection of Land Acquisition Delays
            (SIH25017)
          </Typography>
          <Typography variant="body2" sx={{ color: "#475569", mb: 3 }}>
            Analyzes historical and real-time project data (compensation status,
            legal disputes, possession status) to generate early warnings for
            administrative bottlenecks.
          </Typography>

          <Stack spacing={3}>
            <Paper sx={{ p: 3, border: "1px solid #e2e8f0", borderRadius: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, color: "#0f172a", mb: 2 }}
              >
                Land Acquisition Risk Matrix
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{ mb: 0.5 }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Legal & Compensation Disputes
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#b91c1c", fontWeight: 700 }}
                    >
                      High Risk (82%)
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={82}
                    color="error"
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Box>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{ mb: 0.5 }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Administrative Approval Timelines
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#b45309", fontWeight: 700 }}
                    >
                      Medium Risk (65%)
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={65}
                    color="warning"
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Box>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{ mb: 0.5 }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Rehabilitation & Resettlement
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#15803d", fontWeight: 700 }}
                    >
                      Low Risk (20%)
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={20}
                    color="success"
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              </Stack>
            </Paper>
          </Stack>
        </CustomTabPanel>

        {/* 26015: Geo-Watershed Analysis */}
        <CustomTabPanel value={value} index={1}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 800, color: "#0f172a", mb: 1 }}
          >
            Geospatial Watershed Visualization (SIH26015)
          </Typography>
          <Typography variant="body2" sx={{ color: "#475569", mb: 3 }}>
            Integration of SRISHTI-DRISHTI 30m spatial resolution satellite data
            to interpret land degradation and drainage changes for the project
            area.
          </Typography>

          <Paper
            sx={{
              p: 3,
              border: "1px solid #e2e8f0",
              borderRadius: 2,
              bgcolor: "#ffffff",
            }}
          >
            <Stack direction="row" spacing={3}>
              <Box
                sx={{
                  flex: 1,
                  height: 300,
                  bgcolor: "#e2e8f0",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Terrain sx={{ fontSize: 64, color: "#94a3b8" }} />
                <Typography sx={{ ml: 2, color: "#64748b", fontWeight: 600 }}>
                  Live SRISHTI Geo-Coded Overlay
                </Typography>
              </Box>
              <Stack spacing={2} sx={{ width: 300 }}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "#f8fafc",
                    borderRadius: 1,
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 700, color: "#64748b" }}
                  >
                    Vegetation Change
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 800, color: "#b91c1c" }}
                  >
                    -12.4% Coverage
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "#f8fafc",
                    borderRadius: 1,
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 700, color: "#64748b" }}
                  >
                    Soil Moisture Index
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 800, color: "#15803d" }}
                  >
                    Stable
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  sx={{ textTransform: "none", fontWeight: 700 }}
                >
                  Run Thematic Analysis
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </CustomTabPanel>

        {/* 26016: National Land Acquisition */}
        <CustomTabPanel value={value} index={2}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 800, color: "#0f172a", mb: 1 }}
          >
            National Land Acquisition & Management Tracker (SIH26016)
          </Typography>
          <Typography variant="body2" sx={{ color: "#475569", mb: 3 }}>
            End-to-End digital workflow integration for this project—from
            proposal to final possession.
          </Typography>

          <Paper
            sx={{
              p: 3,
              border: "1px solid #e2e8f0",
              borderRadius: 2,
              bgcolor: "#ffffff",
            }}
          >
            <Stack spacing={3}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Lifecycle Status
                </Typography>
                <Chip label="Possession Pending" size="small" color="warning" />
              </Stack>
              <Divider />
              <Box sx={{ position: "relative" }}>
                <Stack direction="row" spacing={0} sx={{ mt: 2 }}>
                  {[
                    "Proposal",
                    "Notification",
                    "Award",
                    "Compensation",
                    "Possession",
                  ].map((step, i) => (
                    <Box key={step} sx={{ flex: 1, textAlign: "center" }}>
                      <CheckCircle
                        sx={{
                          color: i < 3 ? "#15803d" : "#cbd5e1",
                          fontSize: 28,
                          mb: 1,
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          fontWeight: 600,
                          color: i < 3 ? "#15803d" : "#64748b",
                        }}
                      >
                        {step}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Stack>
          </Paper>
        </CustomTabPanel>

        {/* 26018: AI Record Digitization */}
        <CustomTabPanel value={value} index={3}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 800, color: "#0f172a", mb: 1 }}
          >
            Intelligent Legacy Record OCR & Validation (SIH26018)
          </Typography>
          <Typography variant="body2" sx={{ color: "#475569", mb: 3 }}>
            AI-powered extraction of Khasra/Khata numbers and ownership details
            from handwritten and legacy PDF cadastral documents.
          </Typography>

          <Paper
            sx={{
              p: 3,
              border: "1px solid #e2e8f0",
              borderRadius: 2,
              bgcolor: "#ffffff",
            }}
          >
            <Stack direction="row" spacing={3}>
              <Box
                sx={{
                  flex: 1,
                  p: 2,
                  bgcolor: "#f8fafc",
                  border: "1px dashed #cbd5e1",
                  borderRadius: 2,
                  textAlign: "center",
                }}
              >
                <Description sx={{ fontSize: 40, color: "#94a3b8", mb: 1 }} />
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: "#64748b" }}
                >
                  Legacy_Register_1984.pdf (Processing...)
                </Typography>
                <LinearProgress sx={{ mt: 2 }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                  Extracted Entities (Confidence)
                </Typography>
                <Stack spacing={1}>
                  <Box
                    sx={{
                      p: 1.5,
                      bgcolor: "#f0fdf4",
                      border: "1px solid #bbf7d0",
                      borderRadius: 1,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ color: "#166534", fontWeight: 700 }}
                    >
                      Survey No: 45A/2 (98%)
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 1.5,
                      bgcolor: "#fef2f2",
                      border: "1px solid #fecaca",
                      borderRadius: 1,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ color: "#991b1b", fontWeight: 700 }}
                    >
                      Owner: [Unreadable] (32%) - Human Verification Required
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </Paper>
        </CustomTabPanel>

        {/* 26019: Policy Sandbox */}
        <CustomTabPanel value={value} index={4}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 800, color: "#0f172a", mb: 1 }}
          >
            Digital Platform for Evidence-Based Land Governance (SIH26019)
          </Typography>
          <Typography variant="body2" sx={{ color: "#475569", mb: 3 }}>
            Policy simulation sandbox to evaluate the localized impact of new
            land reforms and climate resilience metrics on this project.
          </Typography>

          <Paper
            sx={{
              p: 3,
              border: "1px solid #e2e8f0",
              borderRadius: 2,
              bgcolor: "#ffffff",
            }}
          >
            <Stack spacing={2}>
              <Box
                sx={{
                  p: 2,
                  bgcolor: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: 1,
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Policy sx={{ fontSize: 32, color: "#1e40af" }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Simulate LARR Act 2013 Amendment
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                      Calculates projected timeline shifts if compensation
                      disbursement is accelerated.
                    </Typography>
                  </Box>
                </Stack>
              </Box>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#0b2545",
                  textTransform: "none",
                  fontWeight: 700,
                }}
              >
                Run AI Policy Simulation
              </Button>
            </Stack>
          </Paper>
        </CustomTabPanel>
      </DialogContent>

      <DialogActions
        sx={{ p: 3, borderTop: "1px solid #e2e8f0", bgcolor: "#ffffff" }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            fontWeight: 700,
            textTransform: "none",
            color: "#475569",
            borderColor: "#cbd5e1",
          }}
        >
          Close Module
        </Button>
      </DialogActions>
    </Dialog>
  );
}
