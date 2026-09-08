import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Stack,
  Alert,
  Switch,
  FormControlLabel,
  Slider,
  CircularProgress,
  Tab,
  Tabs,
  Paper,
  Chip,
} from '@mui/material';
import {
  Person as PersonIcon,
  Security as SecurityIcon,
  Tune as TuneIcon,
  Save as SaveIcon,
  PictureAsPdf as PdfIcon,
  Calculate as CalculateIcon,
} from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/api/client';
import LossSplittingInspector from '@/components/ml/LossSplittingInspector';

export default function SettingsPage() {
  const { user, changePassword, updateProfile } = useAuth();
  const [tab, setTab] = useState(0);

  // Profile state
  const [name, setName] = useState(user?.name || 'Demo Analyst');
  const [email, setEmail] = useState(user?.email || 'demo@paimana.com');
  const [agency, setAgency] = useState(user?.agency || 'Ministry of Statistics & Programme Implementation (MoSPI)');
  const [department, setDepartment] = useState(user?.department || 'Infrastructure & Project Monitoring Division');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Problem statement / ML threshold parameters
  const [criticalDelayThreshold, setCriticalDelayThreshold] = useState<number>(180);
  const [warningDelayThreshold, setWarningDelayThreshold] = useState<number>(60);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [autoRecompute, setAutoRecompute] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(75);
  const [modelSuccess, setModelSuccess] = useState('');

  // Report download state
  const [downloadingReport, setDownloadingReport] = useState(false);
  const [reportError, setReportError] = useState('');

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileSuccess('');
    try {
      await updateProfile({ name, email, agency, department });
      setProfileSuccess('Profile details saved successfully.');
    } catch {
      setProfileSuccess('Profile updated in local session.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setPasswordLoading(true);
    try {
      await changePassword(oldPassword, newPassword);
      setPasswordSuccess('Password has been successfully updated.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to change password.';
      setPasswordError(msg);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleExportReport = async () => {
    setDownloadingReport(true);
    setReportError('');
    try {
      const response = await apiClient.get('/reports/summary', {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'MoSPI_Flash_Report_PAIMANA.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      setReportError('Unable to generate official summary report. Ensure backend service is active.');
    } finally {
      setDownloadingReport(false);
    }
  };

  return (
    <Box>
      {/* Official Header */}
      <Paper
        elevation={0}
        sx={{
          p: 2.2,
          mb: 3,
          borderRadius: 1,
          border: '1px solid #e2e8f0',
          borderLeft: '4px solid #0b2545',
          bgcolor: '#ffffff',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between" spacing={2}>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 800, color: '#0b2545', textTransform: 'uppercase', letterSpacing: 0.8, fontSize: '0.68rem' }}>
              GOVERNANCE & SYSTEM RULES
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mt: 0.3 }}>
              Officer Profile & Telemetry Parameters
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.2 }}>
              Configure statutory clearance rules, Parichay authentication credentials, and threshold sensitivity
            </Typography>
          </Box>
          <Button
            variant="outlined"
            size="small"
            startIcon={downloadingReport ? <CircularProgress size={14} color="inherit" /> : <PdfIcon fontSize="small" />}
            onClick={handleExportReport}
            disabled={downloadingReport}
            sx={{
              borderColor: '#cbd5e1',
              color: '#0b2545',
              fontSize: '0.74rem',
              fontWeight: 800,
              letterSpacing: 0.5,
              bgcolor: '#ffffff',
              '&:hover': {
                borderColor: '#0b2545',
                bgcolor: '#f1f5f9',
              },
            }}
          >
            {downloadingReport ? 'Compiling…' : 'Export MoSPI Summary (PDF)'}
          </Button>
        </Stack>
      </Paper>

      {reportError && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: 1 }} onClose={() => setReportError('')}>
          {reportError}
        </Alert>
      )}

      <Card sx={{ borderRadius: 1, border: '1px solid #e2e8f0', bgcolor: '#ffffff', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
        <Box sx={{ borderBottom: 1, borderColor: '#e2e8f0', px: 2 }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{
              '& .MuiTab-root': {
                color: '#64748b',
                textTransform: 'uppercase',
                fontWeight: 800,
                fontSize: '0.74rem',
                letterSpacing: 0.5,
                '&.Mui-selected': { color: '#0b2545' },
              },
              '& .MuiTabs-indicator': { bgcolor: '#0b2545', height: 2 },
            }}
          >
            <Tab icon={<PersonIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Profile & Ministry" />
            <Tab icon={<SecurityIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Security & Password" />
            <Tab icon={<TuneIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Predictive Risk Thresholds & Alerts" />
            <Tab icon={<CalculateIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Statutory Loss Optimization & Data Splitting" />
          </Tabs>
        </Box>

        <CardContent sx={{ p: 3.5 }}>
          {/* TAB 0: PROFILE */}
          {tab === 0 && (
            <Box component="form" onSubmit={handleProfileSave}>
              <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 0.5, color: '#0f172a' }}>
                Officer & Nodal Ministry Credentials
              </Typography>
              <Typography variant="caption" color="#64748b" sx={{ mb: 3, display: 'block' }}>
                Designation details displayed on generated MoSPI executive summary reports
              </Typography>

              {profileSuccess && (
                <Alert severity="success" sx={{ mb: 3, borderRadius: 1 }}>
                  {profileSuccess}
                </Alert>
              )}

              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Full Name"
                    fullWidth
                    size="small"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Official Email"
                    fullWidth
                    size="small"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Ministry / Nodal Agency"
                    fullWidth
                    size="small"
                    value={agency}
                    onChange={(e) => setAgency(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Department / Directorate"
                    fullWidth
                    size="small"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="caption" fontWeight={700} color="#64748b">
                      ACCESS ROLE:
                    </Typography>
                    <Chip label={user?.role?.toUpperCase() || 'ANALYST'} color="primary" size="small" sx={{ fontWeight: 800, fontFamily: 'monospace' }} />
                  </Stack>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3.5 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={profileLoading}
                  startIcon={profileLoading ? <CircularProgress size={16} /> : <SaveIcon fontSize="small" />}
                  sx={{ borderRadius: 1, px: 3, bgcolor: '#0b2545', color: '#ffffff', fontWeight: 800, '&:hover': { bgcolor: '#1e3a8a' } }}
                >
                  Save Profile
                </Button>
              </Box>
            </Box>
          )}

          {/* TAB 1: SECURITY / PASSWORD */}
          {tab === 1 && (
            <Box component="form" onSubmit={handlePasswordChange} sx={{ maxWidth: 540 }}>
              <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 0.5, color: '#0f172a' }}>
                Change Portal Password
              </Typography>
              <Typography variant="caption" color="#64748b" sx={{ mb: 3, display: 'block' }}>
                Update your login credentials. Changes persist across the active session.
              </Typography>

              {passwordSuccess && (
                <Alert severity="success" sx={{ mb: 3, borderRadius: 1 }}>
                  {passwordSuccess}
                </Alert>
              )}
              {passwordError && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }}>
                  {passwordError}
                </Alert>
              )}

              <Stack spacing={2}>
                <TextField
                  label="Current Password"
                  type="password"
                  fullWidth
                  size="small"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Default: password123"
                />
                <TextField
                  label="New Password"
                  type="password"
                  fullWidth
                  size="small"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  helperText="Minimum 6 characters"
                />
                <TextField
                  label="Confirm New Password"
                  type="password"
                  fullWidth
                  size="small"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Box sx={{ pt: 1 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={passwordLoading}
                    startIcon={passwordLoading ? <CircularProgress size={16} /> : <SecurityIcon fontSize="small" />}
                    sx={{ borderRadius: 1, px: 3, bgcolor: '#0b2545', color: '#ffffff', fontWeight: 800, '&:hover': { bgcolor: '#06172b' } }}
                  >
                    {passwordLoading ? 'Updating…' : 'Update Password'}
                  </Button>
                </Box>
              </Stack>
            </Box>
          )}

          {/* TAB 2: PROBLEM STATEMENT / AI PARAMETERS */}
          {tab === 2 && (
            <Box>
              <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 0.5, color: '#0f172a' }}>
                Schedule Slippage Thresholds & Rules
              </Typography>
              <Typography variant="caption" color="#64748b" sx={{ mb: 3, display: 'block' }}>
                Configure parametric criteria used to flag critical milestone risks across Central Sector portfolios
              </Typography>

              {modelSuccess && (
                <Alert severity="success" sx={{ mb: 3, borderRadius: 1 }}>
                  {modelSuccess}
                </Alert>
              )}

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2.5, borderRadius: 1, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <Typography variant="subtitle2" fontWeight={800} color="#0f172a" gutterBottom>
                      Critical Delay Threshold (Days)
                    </Typography>
                    <Typography variant="caption" color="#64748b" display="block" sx={{ mb: 2 }}>
                      Projects exceeding this delay are escalated to PMO Infrastructure Taskforce
                    </Typography>
                    <Slider
                      value={criticalDelayThreshold}
                      min={90}
                      max={730}
                      step={30}
                      valueLabelDisplay="auto"
                      onChange={(_, v) => setCriticalDelayThreshold(v as number)}
                      sx={{ color: '#b91c1c' }}
                    />
                    <Typography variant="caption" fontWeight={800} color="#b91c1c">
                      Flag at: {criticalDelayThreshold} days ({Math.round(criticalDelayThreshold / 30)} months)
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2.5, borderRadius: 1, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <Typography variant="subtitle2" fontWeight={800} color="#0f172a" gutterBottom>
                      Warning Delay Threshold (Days)
                    </Typography>
                    <Typography variant="caption" color="#64748b" display="block" sx={{ mb: 2 }}>
                      Projects with predicted delays between warning and critical are flagged for early intervention
                    </Typography>
                    <Slider
                      value={warningDelayThreshold}
                      min={30}
                      max={180}
                      step={15}
                      valueLabelDisplay="auto"
                      onChange={(_, v) => setWarningDelayThreshold(v as number)}
                      sx={{ color: '#c2410c' }}
                    />
                    <Typography variant="caption" fontWeight={800} color="#c2410c">
                      Flag at: {warningDelayThreshold} days ({Math.round(warningDelayThreshold / 30)} months)
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2.5, borderRadius: 1, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <Typography variant="subtitle2" fontWeight={800} color="#0f172a" gutterBottom>
                      Model Confidence Cutoff (%)
                    </Typography>
                    <Typography variant="caption" color="#64748b" display="block" sx={{ mb: 2 }}>
                      Filter predictions below this empirical baseline reliability percentage
                    </Typography>
                    <Slider
                      value={confidenceThreshold}
                      min={50}
                      max={95}
                      step={5}
                      valueLabelDisplay="auto"
                      onChange={(_, v) => setConfidenceThreshold(v as number)}
                      sx={{ color: '#0b2545' }}
                    />
                    <Typography variant="caption" fontWeight={800} color="#0b2545">
                      Confidence required: {confidenceThreshold}%
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2.5, borderRadius: 1, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <Typography variant="subtitle2" fontWeight={800} color="#0f172a" gutterBottom>
                      Automation & Ingestion Triggers
                    </Typography>
                    <Stack spacing={1} sx={{ mt: 1 }}>
                      <FormControlLabel
                        control={<Switch checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#0b2545' } }} />}
                        label={<Typography variant="caption" color="#334155">Weekly escalation digest to Cabinet Secretariat</Typography>}
                      />
                      <FormControlLabel
                        control={<Switch checked={autoRecompute} onChange={(e) => setAutoRecompute(e.target.checked)} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#0b2545' } }} />}
                        label={<Typography variant="caption" color="#334155">Auto-recompute predictions on new CUF upload</Typography>}
                      />
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3.5 }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon fontSize="small" />}
                  onClick={() => {
                    setModelSuccess('Analytical parameters and delay thresholds saved.');
                    setTimeout(() => setModelSuccess(''), 3000);
                  }}
                  sx={{ borderRadius: 1, px: 3, bgcolor: '#0b2545', color: '#ffffff', fontWeight: 800, '&:hover': { bgcolor: '#06172b' } }}
                >
                  Apply Delay Rules
                </Button>
              </Box>
            </Box>
          )}

          {/* TAB 3: LOSS OPTIMIZATION & SPLITTING (FOCAL LOSS / F1) */}
          {tab === 3 && (
            <LossSplittingInspector />
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
