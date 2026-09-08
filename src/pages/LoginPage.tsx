import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Stack,
  InputAdornment,
  IconButton,
  Divider,
  Chip,
  Paper,
  Tab,
  Tabs,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Shield,
  Refresh,
  AccountBalance,
  VpnKey,
} from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [authTab, setAuthTab] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('8K3P9');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleRefreshCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setCaptchaInput('');
  };

  const handleFillDemo = () => {
    setEmail('demo@paimana.com');
    setPassword('password123');
    setCaptchaInput(captchaCode);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Captcha validation
    if (captchaInput.trim().toUpperCase() !== captchaCode) {
      setError('Invalid security code (CAPTCHA). Please enter the characters shown.');
      return;
    }

    setLoading(true);
    try {
      await login({ email, password });
      navigate('/', { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed. Please verify credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      navigate('/', { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Single Sign-On authentication failed.';
      setError(msg);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#f1f5f9',
      }}
    >
      {/* Top Tricolor Strip */}
      <Box
        sx={{
          height: '4px',
          width: '100%',
          background: 'linear-gradient(90deg, #c2410c 0%, #c2410c 33.3%, #ffffff 33.3%, #ffffff 66.6%, #15803d 66.6%, #15803d 100%)',
        }}
      />

      {/* Official Government Header Banner */}
      <Box sx={{ bgcolor: '#ffffff', color: '#0f172a', py: 1.5, px: { xs: 2, md: 4 }, borderBottom: '1px solid #e2e8f0' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" spacing={1}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <AccountBalance sx={{ color: '#0b2545', fontSize: 28 }} />
            <Box>
              <Typography variant="caption" sx={{ display: 'block', fontWeight: 800, letterSpacing: 0.8, textTransform: 'uppercase', color: '#64748b', fontSize: '0.62rem' }}>
                भारत सरकार &bull; Government of India
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.88rem', lineHeight: 1.2, color: '#0b2545' }}>
                Ministry of Statistics and Programme Implementation (MoSPI)
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Shield sx={{ fontSize: 16, color: '#15803d' }} />
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 700 }}>
              NIC PARICHAY SECURED GATEWAY &bull; OFFICIAL ACCESS
            </Typography>
          </Stack>
        </Stack>
      </Box>

      {/* Main Login Form Container */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2.5,
        }}
      >
        <Card
          sx={{
            maxWidth: 480,
            width: '100%',
            borderRadius: 1.5,
            border: '1px solid #cbd5e1',
            borderTop: '4px solid #0b2545',
            bgcolor: '#ffffff',
            boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.06)',
          }}
        >
          {/* Card Header */}
          <Box sx={{ p: 3, pb: 2, bgcolor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1,
                  bgcolor: '#0b2545',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontSize: 20,
                }}
              >
                P
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0b2545', fontSize: '1.05rem', lineHeight: 1.2 }}>
                  PAIMANA &bull; OCMS Portal
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.72rem' }}>
                  Central Sector Infrastructure Delay Monitoring Gateway
                </Typography>
              </Box>
            </Stack>

            <Tabs
              value={authTab}
              onChange={(_, v) => setAuthTab(v)}
              sx={{
                minHeight: 36,
                mt: 1.5,
                '& .MuiTab-root': {
                  minHeight: 36,
                  textTransform: 'uppercase',
                  fontWeight: 800,
                  fontSize: '0.72rem',
                  letterSpacing: 0.5,
                  color: '#64748b',
                  '&.Mui-selected': { color: '#0b2545' },
                },
                '& .MuiTabs-indicator': { bgcolor: '#0b2545', height: 2 },
              }}
            >
              <Tab label="Parichay / Officer ID" />
              <Tab label="MeriPehchaan (National SSO)" />
            </Tabs>
          </Box>

          <CardContent sx={{ p: 3 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2.5, borderRadius: 1, fontSize: '0.8rem' }}>
                {error}
              </Alert>
            )}

            {/* Quick Demo Credentials Banner */}
            <Paper
              elevation={0}
              onClick={handleFillDemo}
              sx={{
                p: 1.5,
                mb: 2.5,
                borderRadius: 1,
                bgcolor: '#f8fafc',
                border: '1px solid #cbd5e1',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                '&:hover': {
                  borderColor: '#0b2545',
                  bgcolor: '#f1f5f9',
                },
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#0b2545', display: 'block', fontSize: '0.68rem', letterSpacing: 0.5 }}>
                    AUTHORIZED EVALUATION CREDENTIALS
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.74rem' }}>
                    demo@paimana.com &bull; password123
                  </Typography>
                </Box>
                <Chip label="Auto-Fill Form" size="small" sx={{ height: 22, fontSize: '0.68rem', fontWeight: 800, bgcolor: '#0b2545', color: '#ffffff' }} />
              </Stack>
            </Paper>

            {/* TAB 0: Official Email / Password Form */}
            {authTab === 0 ? (
              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', display: 'block', mb: 0.5 }}>
                      Official Email Address / NIC Parichay ID
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. analyst@gov.in or demo@paimana.com"
                    />
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', display: 'block', mb: 0.5 }}>
                      Password
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton size="small" onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: '#64748b' }}>
                              {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  {/* Captcha Block */}
                  <Box sx={{ p: 1.5, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', display: 'block', mb: 1 }}>
                      Security Verification Code
                    </Typography>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box
                        sx={{
                          px: 2,
                          py: 0.6,
                          bgcolor: '#ffffff',
                          letterSpacing: 6,
                          fontWeight: 900,
                          fontSize: '1.05rem',
                          fontFamily: 'monospace',
                          color: '#0b2545',
                          userSelect: 'none',
                          border: '1px dashed #cbd5e1',
                          borderRadius: 1,
                        }}
                      >
                        {captchaCode}
                      </Box>
                      <IconButton size="small" onClick={handleRefreshCaptcha} title="Regenerate code" sx={{ color: '#64748b' }}>
                        <Refresh fontSize="small" />
                      </IconButton>
                      <TextField
                        size="small"
                        required
                        placeholder="Enter Code"
                        value={captchaInput}
                        onChange={(e) => setCaptchaInput(e.target.value)}
                        sx={{ width: 140 }}
                      />
                    </Stack>
                  </Box>

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <VpnKey fontSize="small" />}
                    sx={{
                      py: 1.2,
                      bgcolor: '#0b2545',
                      color: '#ffffff',
                      '&:hover': { bgcolor: '#1e3a8a' },
                      borderRadius: 1,
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      letterSpacing: 0.5,
                    }}
                  >
                    {loading ? 'Authenticating with Parichay…' : 'Authenticate & Access Portal'}
                  </Button>
                </Stack>
              </Box>
            ) : (
              /* TAB 1: National Single Sign-On (MeriPehchaan / Google) */
              <Box sx={{ py: 1 }}>
                <Typography variant="body2" sx={{ color: '#475569', mb: 2.5, fontSize: '0.82rem', lineHeight: 1.5 }}>
                  National Single Sign-On (NSSO / MeriPehchaan) allows designated Ministry Officers and Agency Project Directors to authenticate with registered enterprise accounts.
                </Typography>

                <Button
                  variant="outlined"
                  fullWidth
                  disabled={googleLoading}
                  onClick={handleGoogleSignIn}
                  sx={{
                    py: 1.2,
                    borderColor: '#cbd5e1',
                    color: '#0f172a',
                    bgcolor: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    borderRadius: 1,
                    '&:hover': {
                      bgcolor: '#f8fafc',
                      borderColor: '#0b2545',
                    },
                  }}
                  startIcon={
                    googleLoading ? (
                      <CircularProgress size={18} />
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 48 48">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                      </svg>
                    )
                  }
                >
                  {googleLoading ? 'Connecting to NSSO…' : 'Sign In with MeriPehchaan / Google'}
                </Button>
              </Box>
            )}

            <Divider sx={{ my: 2.5, borderColor: '#e2e8f0' }} />

            {/* Official Security Disclaimer */}
            <Box sx={{ p: 1.5, bgcolor: '#fef2f2', borderRadius: 1, border: '1px solid #fecaca' }}>
              <Typography variant="caption" sx={{ display: 'block', color: '#991b1b', fontSize: '0.68rem', lineHeight: 1.4 }}>
                <strong>Statutory Notice:</strong> This portal is restricted to authorized Government of India personnel. Unauthorized attempts to gain access will be prosecuted under Sections 43 and 66 of the Information Technology Act, 2000.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Official Gov Footer */}
      <Box sx={{ py: 1.5, textAlign: 'center', bgcolor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.72rem' }}>
          National Informatics Centre &bull; Ministry of Statistics and Programme Implementation, New Delhi &bull; Smart India Hackathon 2026
        </Typography>
      </Box>
    </Box>
  );
}
