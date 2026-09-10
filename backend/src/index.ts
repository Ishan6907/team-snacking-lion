import express from 'express';
import cors from 'cors';
import path from 'path';

import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import predictionRoutes from './routes/predictions';
import sectorRoutes from './routes/sectors';
import alertRoutes from './routes/alerts';
import uploadRoutes from './routes/upload';
import reportRoutes from './routes/reports';
import mlRoutes from './routes/ml';
import recommendationRoutes from './routes/recommendations';

import { requireRole } from './routes/auth';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Auth routes — public (login, register, etc.)
app.use('/api/v1/auth', authRoutes);

import districtRoutes from './routes/districts';

// Authenticated routes — require any valid role
const requireAuth = requireRole('admin', 'analyst', 'viewer');
app.use('/api/v1/projects', requireAuth, projectRoutes);
app.use('/api/v1/predictions', requireAuth, predictionRoutes);
app.use('/api/v1/sectors', requireAuth, sectorRoutes);
app.use('/api/v1/alerts', requireAuth, alertRoutes);
app.use('/api/v1/recommendations', requireAuth, recommendationRoutes);
app.use('/api/v1/districts', requireAuth, districtRoutes);

// Analyst/Admin routes — require elevated permissions
const requireAnalyst = requireRole('admin', 'analyst');
app.use('/api/v1/upload', requireAnalyst, uploadRoutes);
app.use('/api/v1/reports', requireAnalyst, reportRoutes);
app.use('/api/v1/ml', requireAnalyst, mlRoutes);

// Static frontend serving in production
if (process.env.NODE_ENV === 'production') {
  const frontendDistPath = path.join(__dirname, '../../dist');
  app.use(express.static(frontendDistPath));
  
  app.use((req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
