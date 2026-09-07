import { Router } from 'express';
import { db } from '../data/db';

const router = Router();

router.get('/portfolio-summary', (req, res) => {
  res.json(db.getPortfolioSummary());
});

router.get('/:projectId/trend', (req, res) => {
  res.json(db.getPredictionTrend(req.params.projectId));
});

router.get('/:projectId', (req, res) => {
  res.json(db.getPrediction(req.params.projectId));
});

export default router;
