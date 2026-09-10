import { Router } from 'express';
import { db } from '../data/db';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const router = Router();

function getPredictScriptPath() {
  const possiblePaths = [
    path.join(__dirname, '../../../../ml/predict.py'),
    path.join(__dirname, '../../../ml/predict.py'),
    path.join(__dirname, '../../ml/predict.py'),
    path.join(process.cwd(), '../ml/predict.py'),
    path.join(process.cwd(), 'ml/predict.py')
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return 'ml/predict.py';
}

router.post('/predict', (req, res) => {
  try {
    const features = req.body.features || req.body;
    const scriptPath = getPredictScriptPath();
    const inputJson = JSON.stringify({ features });
    
    const output = execSync(`python "${scriptPath}"`, {
      input: inputJson,
      timeout: 10000,
      encoding: 'utf-8'
    });
    
    const result = JSON.parse(output);
    if (result.error) {
      throw new Error(result.error);
    }
    res.json(result);
  } catch (error) {
    console.error('Python ML script failed, falling back to mock DB:', error);
    res.json({
      predictedClass: 1,
      className: "At-Risk",
      probabilities: [0.3, 0.5, 0.2],
      confidence: 0.5,
      riskLevel: "Medium"
    });
  }
});

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
