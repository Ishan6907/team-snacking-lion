import { useCallback, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  LinearProgress,
  Alert,
  AlertTitle,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
} from '@mui/material';
import { CloudUpload, Error as ErrorIcon, Description } from '@mui/icons-material';
import { useUpload } from '@/hooks/useUpload';
import { useAuth } from '@/context/AuthContext';

export default function UploadPage() {
  const { user } = useAuth();
  const isViewer = user?.role === 'viewer';
  const { upload, progress, isUploading, result, error, reset } = useUpload();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFile = useCallback((file: File) => {
    setSelectedFile(file);
    reset();
  }, [reset]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleUpload = () => {
    if (selectedFile) upload(selectedFile);
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
        <Typography variant="caption" sx={{ fontWeight: 800, color: '#0b2545', textTransform: 'uppercase', letterSpacing: 0.8, fontSize: '0.68rem' }}>
          DATA INGESTION PIPELINE
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mt: 0.3 }}>
          Central Update Format (CUF) Monthly Ingestion
        </Typography>
        <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.2 }}>
          Upload standardized project monitoring datasets to recompute delay forecasts and milestone risks
        </Typography>
      </Paper>

      {isViewer && (
        <Alert severity="warning" sx={{ mb: 2.5, borderRadius: 1, fontSize: '0.8rem' }}>
          <strong>Read-Only Role Access:</strong> Your account role is <strong>Viewer</strong>. Ingesting new CUF spreadsheets and re-triggering ML pipelines requires <strong>Analyst</strong> or <strong>Admin</strong> privileges.
        </Alert>
      )}

      <Card sx={{ borderRadius: 1, border: '1px solid #e2e8f0', bgcolor: '#ffffff', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
        <CardContent sx={{ p: 3 }}>
          {/* Drop zone */}
          <Box
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            sx={{
              border: '2px dashed',
              borderColor: dragActive ? '#0b2545' : '#cbd5e1',
              borderRadius: 1,
              p: 6,
              textAlign: 'center',
              bgcolor: dragActive ? '#eff6ff' : '#f8fafc',
              transition: 'all 0.15s ease',
              cursor: 'pointer',
              '&:hover': {
                borderColor: '#0b2545',
                bgcolor: '#f1f5f9',
              },
            }}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <input id="file-input" type="file" accept=".csv,.xlsx,.xls" hidden onChange={handleInputChange} />
            <CloudUpload sx={{ fontSize: 44, color: dragActive ? '#0b2545' : '#64748b', mb: 1.5 }} />
            <Typography variant="body1" sx={{ fontWeight: 700, color: '#0f172a' }}>
              Drop CUF Spreadsheet or Click to Browse Local Files
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.5 }}>
              Standard MoSPI Schema &bull; Accepts .csv, .xlsx, .xls
            </Typography>
          </Box>

          {/* Selected file info */}
          {selectedFile && (
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mt: 2.5, p: 1.5, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 1 }}>
              <Description sx={{ color: '#0b2545' }} />
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a', flexGrow: 1 }}>{selectedFile.name}</Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                {(selectedFile.size / 1024).toFixed(1)} KB
              </Typography>
            </Stack>
          )}

          {/* Upload button */}
          {selectedFile && !result && (
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2.5, py: 1.2, bgcolor: '#0b2545', color: '#ffffff', fontWeight: 800, '&:hover': { bgcolor: '#06172b' } }}
              onClick={handleUpload}
              disabled={isUploading || isViewer}
              startIcon={<CloudUpload />}
            >
              {isUploading ? 'Ingesting & Calculating ML Predictions…' : 'Ingest CUF & Run Delay Engine'}
            </Button>
          )}

          {/* Progress */}
          {isUploading && (
            <Box sx={{ mt: 2.5 }}>
              <LinearProgress variant="determinate" value={progress} sx={{ height: 6, borderRadius: 1, bgcolor: '#f1f5f9', '& .MuiLinearProgress-bar': { bgcolor: '#0b2545' } }} />
              <Typography variant="caption" sx={{ color: '#64748b', mt: 0.8, display: 'block', textAlign: 'center' }}>
                {progress}% Ingested
              </Typography>
            </Box>
          )}

          {/* Result */}
          {result && (
            <Alert severity={result.errors.length > 0 ? 'warning' : 'success'} sx={{ mt: 2.5, borderRadius: 1 }}>
              <AlertTitle sx={{ fontWeight: 800 }}>{result.errors.length > 0 ? 'Ingestion Completed with Warnings' : 'Ingestion Successful'}</AlertTitle>
              <Typography variant="body2" sx={{ fontSize: '0.82rem' }}>
                {result.recordsProcessed} projects evaluated, {result.recordsSkipped} skipped.
              </Typography>
              {result.errors.length > 0 && (
                <List dense sx={{ mt: 1 }}>
                  {result.errors.map((err, i) => (
                    <ListItem key={i} disableGutters>
                      <ListItemIcon sx={{ minWidth: 24 }}><ErrorIcon fontSize="small" color="warning" /></ListItemIcon>
                      <ListItemText primary={err} primaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }} />
                    </ListItem>
                  ))}
                </List>
              )}
            </Alert>
          )}

          {/* Error */}
          {error && (
            <Alert severity="error" sx={{ mt: 2.5, borderRadius: 1 }}>
              <AlertTitle sx={{ fontWeight: 800 }}>Upload Error</AlertTitle>
              {error instanceof Error ? error.message : String(error)}
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
