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
} from '@mui/material';
import { CloudUpload, Error as ErrorIcon, Description } from '@mui/icons-material';
import { useUpload } from '@/hooks/useUpload';

export default function UploadPage() {
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
      <Typography variant="h4" sx={{ mb: 3 }}>Upload Data</Typography>

      <Card>
        <CardContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Upload a CUF (Central Update Format) file to update project data and trigger new predictions.
          </Typography>

          {/* Drop zone */}
          <Box
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            sx={{
              border: '2px dashed',
              borderColor: dragActive ? 'primary.main' : 'divider',
              borderRadius: 2,
              p: 6,
              textAlign: 'center',
              bgcolor: dragActive ? 'primary.50' : 'background.default',
              transition: 'all 0.2s',
              cursor: 'pointer',
            }}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <input id="file-input" type="file" accept=".csv,.xlsx,.xls" hidden onChange={handleInputChange} />
            <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography variant="body1" fontWeight={600}>
              Drop your file here or click to browse
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Supports .csv, .xlsx, .xls files
            </Typography>
          </Box>

          {/* Selected file info */}
          {selectedFile && (
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2, p: 1.5, bgcolor: 'action.hover', borderRadius: 1 }}>
              <Description color="primary" />
              <Typography variant="body2" fontWeight={500} sx={{ flexGrow: 1 }}>{selectedFile.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </Typography>
            </Stack>
          )}

          {/* Upload button */}
          {selectedFile && !result && (
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleUpload}
              disabled={isUploading}
              startIcon={<CloudUpload />}
            >
              {isUploading ? 'Uploading…' : 'Upload & Process'}
            </Button>
          )}

          {/* Progress */}
          {isUploading && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block', textAlign: 'center' }}>
                {progress}% uploaded
              </Typography>
            </Box>
          )}

          {/* Result */}
          {result && (
            <Alert severity={result.errors.length > 0 ? 'warning' : 'success'} sx={{ mt: 2 }}>
              <AlertTitle>{result.errors.length > 0 ? 'Upload completed with warnings' : 'Upload successful!'}</AlertTitle>
              <Typography variant="body2">
                {result.recordsProcessed} records processed, {result.recordsSkipped} skipped.
              </Typography>
              {result.errors.length > 0 && (
                <List dense sx={{ mt: 1 }}>
                  {result.errors.map((err, i) => (
                    <ListItem key={i} disableGutters>
                      <ListItemIcon sx={{ minWidth: 28 }}><ErrorIcon fontSize="small" color="warning" /></ListItemIcon>
                      <ListItemText primary={err} primaryTypographyProps={{ variant: 'caption' }} />
                    </ListItem>
                  ))}
                </List>
              )}
            </Alert>
          )}

          {/* Error */}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              <AlertTitle>Upload failed</AlertTitle>
              {error instanceof Error ? error.message : String(error)}
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
