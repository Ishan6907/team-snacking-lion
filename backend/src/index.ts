import express from 'express';
import cors from 'cors';
import path from 'path';

import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import predictionRoutes from './routes/predictions';
import sectorRoutes from './routes/sectors';
import alertRoutes from './routes/alerts';
import uploadRoutes from './routes/upload';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/predictions', predictionRoutes);
app.use('/api/v1/sectors', sectorRoutes);
app.use('/api/v1/alerts', alertRoutes);
app.use('/api/v1/upload', uploadRoutes);

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
