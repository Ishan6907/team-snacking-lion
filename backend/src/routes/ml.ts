import { Router } from 'express';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';

const router = Router();

function getBenchmarkResultsPath(): string {
  const possiblePaths = [
    path.resolve(__dirname, '../../../ml/benchmark_results.json'),
    path.resolve(__dirname, '../../ml/benchmark_results.json'),
    path.resolve(process.cwd(), 'ml/benchmark_results.json'),
    path.resolve(process.cwd(), '../ml/benchmark_results.json'),
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return path.resolve(process.cwd(), 'ml/benchmark_results.json');
}

function getTrainScriptPath(): string | null {
  const possiblePaths = [
    path.resolve(__dirname, '../../../ml/train_eval.py'),
    path.resolve(__dirname, '../../ml/train_eval.py'),
    path.resolve(process.cwd(), 'ml/train_eval.py'),
    path.resolve(process.cwd(), '../ml/train_eval.py'),
  ];
  return possiblePaths.find(p => fs.existsSync(p)) || null;
}

// GET /api/v1/ml/benchmarks - returns benchmark results
router.get('/benchmarks', (req, res) => {
  const resultsPath = getBenchmarkResultsPath();
  if (fs.existsSync(resultsPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
      return res.json(data);
    } catch (err: any) {
      console.error('Error reading benchmark JSON:', err);
    }
  }

  // Fallback: run train_eval.py if json is missing
  const scriptPath = getTrainScriptPath();
  if (!scriptPath) {
    return res.status(500).json({ error: 'ML benchmark training script not found.' });
  }

  exec(`python "${scriptPath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error('Failed to execute ML training script:', error, stderr);
      return res.status(500).json({ error: 'Failed to run ML benchmark', details: stderr });
    }
    if (fs.existsSync(resultsPath)) {
      const data = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
      return res.json(data);
    }
    return res.status(500).json({ error: 'Benchmark output file was not produced.' });
  });
});

// POST /api/v1/ml/train - triggers retrain and returns fresh metrics
router.post('/train', (req, res) => {
  const scriptPath = getTrainScriptPath();
  const resultsPath = getBenchmarkResultsPath();

  if (!scriptPath) {
    return res.status(500).json({ error: 'ML training script not found.' });
  }

  exec(`python "${scriptPath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error('Error retraining ML pipeline:', error, stderr);
      return res.status(500).json({ error: 'Training failed', details: stderr || error.message });
    }
    try {
      const data = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
      return res.json({ success: true, message: 'Retraining completed successfully.', results: data });
    } catch (readErr: any) {
      return res.status(500).json({ error: 'Failed to parse retrained results', details: readErr.message });
    }
  });
});

// POST /api/v1/ml/loss-curve - computes theoretical loss comparison for given parameters
router.post('/loss-curve', (req, res) => {
  const gamma = typeof req.body.gamma === 'number' ? req.body.gamma : 2.0;
  const alpha = typeof req.body.alpha === 'number' ? req.body.alpha : 0.75;
  const lambdaWeight = typeof req.body.lambdaWeight === 'number' ? req.body.lambdaWeight : 0.65;

  const ptVals: number[] = [];
  const ceVals: number[] = [];
  const focalVals: number[] = [];
  const hybridVals: number[] = [];

  for (let i = 1; i < 100; i++) {
    const pt = i / 100.0;
    const ce = -Math.log(pt);
    const focal = alpha * Math.pow(1.0 - pt, gamma) * ce;
    const hybrid = (1.0 - lambdaWeight) * ce + lambdaWeight * focal;

    ptVals.push(Math.round(pt * 100) / 100);
    ceVals.push(Math.round(ce * 1000) / 1000);
    focalVals.push(Math.round(focal * 1000) / 1000);
    hybridVals.push(Math.round(hybrid * 1000) / 1000);
  }

  res.json({
    pt: ptVals,
    ce: ceVals,
    focal: focalVals,
    hybrid: hybridVals,
    parameters: { gamma, alpha, lambdaWeight },
  });
});

function getMetrologyCorpusSummaryPath(): string {
  const possiblePaths = [
    path.resolve(__dirname, '../../../ml/metrology_corpus_summary.json'),
    path.resolve(__dirname, '../../ml/metrology_corpus_summary.json'),
    path.resolve(process.cwd(), 'ml/metrology_corpus_summary.json'),
    path.resolve(process.cwd(), '../ml/metrology_corpus_summary.json'),
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return path.resolve(process.cwd(), 'ml/metrology_corpus_summary.json');
}

function getDatasetCsvPath(): string {
  const possiblePaths = [
    path.resolve(__dirname, '../../../ml/infrastructure_metrology_dataset.csv'),
    path.resolve(__dirname, '../../ml/infrastructure_metrology_dataset.csv'),
    path.resolve(process.cwd(), 'ml/infrastructure_metrology_dataset.csv'),
    path.resolve(process.cwd(), '../ml/infrastructure_metrology_dataset.csv'),
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return path.resolve(process.cwd(), 'ml/infrastructure_metrology_dataset.csv');
}

// GET /api/v1/ml/metrology-corpus - returns statutory corpus index & metrology metadata
router.get('/metrology-corpus', (req, res) => {
  const summaryPath = getMetrologyCorpusSummaryPath();
  if (fs.existsSync(summaryPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
      return res.json(data);
    } catch (err: any) {
      console.error('Error reading metrology corpus summary:', err);
      return res.status(500).json({ error: 'Failed to read corpus summary' });
    }
  }
  return res.status(404).json({ error: 'Metrology corpus summary not found.' });
});

// GET /api/v1/ml/dataset - serves paginated records or triggers CSV download
router.get('/dataset', (req, res) => {
  const csvPath = getDatasetCsvPath();
  if (!fs.existsSync(csvPath)) {
    return res.status(404).json({ error: 'Dataset CSV not found.' });
  }

  if (req.query.download === 'true') {
    res.setHeader('Content-Disposition', 'attachment; filename="infrastructure_metrology_dataset.csv"');
    res.setHeader('Content-Type', 'text/csv');
    return fs.createReadStream(csvPath).pipe(res);
  }

  try {
    const rawContent = fs.readFileSync(csvPath, 'utf8');
    const lines = rawContent.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length === 0) {
      return res.json({ total: 0, items: [] });
    }

    function parseCsvLine(line: string): string[] {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    }

    const headers = parseCsvLine(lines[0]);
    const records = [];

    for (let i = 1; i < lines.length; i++) {
      const cols = parseCsvLine(lines[i]);
      const record: Record<string, any> = {};
      headers.forEach((h, idx) => {
        let val = cols[idx] ?? '';
        if (val.startsWith('"') && val.endsWith('"')) {
          val = val.slice(1, -1);
        }
        const numVal = Number(val);
        record[h] = isNaN(numVal) || val === '' ? val : numVal;
      });
      records.push(record);
    }

    const page = parseInt(req.query.page as string, 10) || 0;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 20;
    const start = page * pageSize;
    const items = records.slice(start, start + pageSize);

    return res.json({
      total: records.length,
      page,
      pageSize,
      totalPages: Math.ceil(records.length / pageSize),
      columns: headers,
      items,
    });
  } catch (err: any) {
    console.error('Error parsing dataset CSV:', err);
    return res.status(500).json({ error: 'Failed to parse dataset CSV', details: err.message });
  }
});

export default router;
