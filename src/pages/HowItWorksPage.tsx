import { Box, Card, CardContent, Typography, Grid, Paper, Divider, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const featureData = [
  { name: 'expenditure_ratio', importance: 19.81 },
  { name: 'progress_diff', importance: 16.28 },
  { name: 'land_acq_delay_months', importance: 3.84 },
  { name: 'physical_progress', importance: 3.6 },
  { name: 'geo_difficulty', importance: 3.31 },
  { name: 'planned_progress', importance: 3.23 },
  { name: 'monsoon_flood_risk', importance: 3.23 },
  { name: 'weighbridge_calibration_gap_days', importance: 3.23 },
  { name: 'utility_shifting_progress', importance: 3.15 },
  { name: 'contractor_liquidity', importance: 3.02 },
  { name: 'metrology_compliance_burden', importance: 2.97 },
  { name: 'gatc_test_centre_lead_days', importance: 2.96 },
  { name: 'sanctioned_cost_cr', importance: 2.86 },
  { name: 'packaged_commodities_audit_risk', importance: 2.7 },
].sort((a, b) => b.importance - a.importance);

export default function HowItWorksPage() {
  return (
    <Box sx={{ color: '#0f172a', pb: 4 }}>
      <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.25rem', mb: 2 }}>
        Model Explainability & Benchmark Results
      </Typography>
      <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.78rem', display: 'block', mb: 4 }}>
        Source: ml/benchmark_results.json, ml/train_eval.py
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', mb: 4 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, p: 2, borderBottom: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}>
              Scope of Study
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ '& th': { color: '#0b2545', fontWeight: 600, bgcolor: '#f1f5f9' } }}>
                  <TableCell width="5%">#</TableCell>
                  <TableCell width="25%">Area</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow><TableCell>1</TableCell><TableCell>Prediction Target</TableCell><TableCell>Land acquisition delay in days for central sector infrastructure projects under RFCTLARR Act 2013</TableCell></TableRow>
                <TableRow><TableCell>2</TableCell><TableCell>Geographic Coverage</TableCell><TableCell>36 States & Union Territories, district-level granularity, 1,428+ project packages</TableCell></TableRow>
                <TableRow><TableCell>3</TableCell><TableCell>Statutory Framework</TableCell><TableCell>RFCTLARR Act 2013 (as amended 2015): Section 4→11→15→19→23→24 pipeline tracking</TableCell></TableRow>
                <TableRow><TableCell>4</TableCell><TableCell>Data Sources</TableCell><TableCell>MoSPI OCMS, NHAI PMIS, MoRTH iRAMS, DLC/CALA records, Legal Metrology regulatory corpus (148 MB, 91 PDFs)</TableCell></TableRow>
                <TableRow><TableCell>5</TableCell><TableCell>Risk Classes</TableCell><TableCell>On-Track (≤30 days), At-Risk (31-180 days), Severe-Delayed (&gt;180 days) — calibrated threshold τ=0.6</TableCell></TableRow>
                <TableRow><TableCell>6</TableCell><TableCell>Model Architecture</TableCell><TableCell>Dual-engine: PyTorch Deep Residual MLP (128-64-32) + Calibrated Random Forest (160 estimators), ensemble blending 60:40</TableCell></TableRow>
                <TableRow><TableCell>7</TableCell><TableCell>Explainability</TableCell><TableCell>SHAP-style feature importances, per-prediction waterfall charts, 21 input features including 5 Legal Metrology + 6 Land Acquisition</TableCell></TableRow>
                <TableRow><TableCell>8</TableCell><TableCell>Key Innovation</TableCell><TableCell>Stratified Temporal Purged Split (0% leakage vs 98.6% in naive split) + Hybrid CE-Focal Loss for minority class recall</TableCell></TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, p: 2, borderBottom: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}>
              Technology Stack
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ '& th': { color: '#0b2545', fontWeight: 600, bgcolor: '#f1f5f9' } }}>
                  <TableCell width="20%">Layer</TableCell>
                  <TableCell width="25%">Technology</TableCell>
                  <TableCell>Purpose</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow><TableCell>Frontend</TableCell><TableCell>React 18, TypeScript, Vite, MUI v5</TableCell><TableCell>Responsive dashboard UI</TableCell></TableRow>
                <TableRow><TableCell>Visualization</TableCell><TableCell>Recharts, react-simple-maps, Three.js</TableCell><TableCell>Charts, India heatmap, 3D orbital engine</TableCell></TableRow>
                <TableRow><TableCell>Backend</TableCell><TableCell>Node.js, Express, TypeScript</TableCell><TableCell>REST API, auth, file upload</TableCell></TableRow>
                <TableRow><TableCell>ML Training</TableCell><TableCell>Python, PyTorch, scikit-learn</TableCell><TableCell>Deep MLP + Random Forest ensemble</TableCell></TableRow>
                <TableRow><TableCell>ML Inference</TableCell><TableCell>Python (joblib), child_process bridge</TableCell><TableCell>Real-time prediction serving</TableCell></TableRow>
                <TableRow><TableCell>Data</TableCell><TableCell>CSV/JSON (1,428 projects), Legal Metrology corpus</TableCell><TableCell>Training dataset + regulatory features</TableCell></TableRow>
                <TableRow><TableCell>Auth</TableCell><TableCell>JWT (jwt-simple), bcrypt, rate limiting</TableCell><TableCell>Multi-user RBAC (Admin/Analyst/Viewer)</TableCell></TableRow>
                <TableRow><TableCell>GIS</TableCell><TableCell>react-simple-maps, SVG cadastral canvas</TableCell><TableCell>State heatmap + parcel-level land visualization</TableCell></TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ border: '1px solid #e2e8f0', height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, fontSize: '0.85rem' }}>
                Feature Importance (Top 14)
              </Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={featureData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Bar dataKey="importance" fill="#0b2545" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
              <Typography variant="caption" sx={{ color: '#64748b', mt: 1, display: 'block', fontSize: '0.78rem' }}>
                Note: Features also include one-hot encoded sector and region.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Stack spacing={3} sx={{ height: '100%' }}>
            <Card elevation={0} sx={{ border: '1px solid #e2e8f0' }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, fontSize: '0.85rem' }}>
                  Classification Thresholds
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.78rem', mb: 1 }}>
                  - <strong>On-Track (Class 0):</strong> Predicted delay ≤ 30 days
                  <br />
                  - <strong>At-Risk (Class 1):</strong> 31-180 days predicted delay
                  <br />
                  - <strong>Severe-Delayed (Class 2):</strong> &gt; 180 days predicted delay
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" sx={{ fontSize: '0.78rem' }}>
                  Thresholds are calibrated via Precision-Recall threshold sweep on the validation set. Optimal threshold for Severe-Delayed class is τ = 0.6 (Val F1: 0.939).<br/>
                  <em>Rationale: Cost-sensitive optimization — missing a catastrophic delay (False Negative) is penalized much more heavily than a false alarm.</em>
                </Typography>
              </CardContent>
            </Card>

            <Card elevation={0} sx={{ border: '1px solid #e2e8f0' }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, fontSize: '0.85rem' }}>
                  Train/Test Split Timeline
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.78rem', fontFamily: 'monospace' }}>
                  Method: Stratified Temporal Purged Split (90-day embargo)<br/>
                  [ 2017-01-19 ] ---- Training (929 packages) ---- [ 2019-06-22 ]<br/>
                  ... Validation (~279 pkgs) ...<br/>
                  [ 2020-12-31 ] ------ Test (220 packages) ------ [ 2024-09-01 ]<br/>
                </Typography>
                <Typography variant="caption" sx={{ color: '#10b981', display: 'block', mt: 1, fontWeight: 700 }}>
                  0% look-ahead leakage verified by audit. (Naive random split comparison showed 98.6% leakage)
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <Card elevation={0} sx={{ border: '1px solid #e2e8f0' }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, fontSize: '0.85rem' }}>
                Performance Metrics (Config D Proposed)
              </Typography>
              <Box sx={{ display: 'flex', gap: 4, mb: 2 }}>
                <Typography variant="body2" sx={{ fontSize: '0.78rem', fontFamily: 'monospace' }}>Accuracy: 91.82%</Typography>
                <Typography variant="body2" sx={{ fontSize: '0.78rem', fontFamily: 'monospace' }}>Macro F1: 91.94%</Typography>
                <Typography variant="body2" sx={{ fontSize: '0.78rem', fontFamily: 'monospace' }}>Severe Recall: 92.31%</Typography>
              </Box>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f8fafc', overflowX: 'auto' }}>
                <table style={{ minWidth: 400, borderCollapse: 'collapse', fontSize: '0.78rem', fontFamily: 'monospace' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '4px' }}>Class</th>
                      <th style={{ textAlign: 'left', padding: '4px' }}>Precision</th>
                      <th style={{ textAlign: 'left', padding: '4px' }}>Recall</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: '4px' }}>On-Track</td>
                      <td style={{ padding: '4px' }}>0.963</td>
                      <td style={{ padding: '4px' }}>0.853</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '4px' }}>At-Risk</td>
                      <td style={{ padding: '4px' }}>0.865</td>
                      <td style={{ padding: '4px' }}>0.957</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '4px' }}>Severe-Delayed</td>
                      <td style={{ padding: '4px' }}>0.968</td>
                      <td style={{ padding: '4px' }}>0.923</td>
                    </tr>
                  </tbody>
                </table>
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ border: '1px solid #e2e8f0', height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, fontSize: '0.85rem' }}>
                Why does the model perform differently?
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.78rem', color: '#15803d', mb: 1 }}>
                <strong>Performs Better On:</strong><br/>
                - Projects with complete expenditure data<br/>
                - Multi-year history<br/>
                - Clear statutory milestones
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.78rem', color: '#b91c1c' }}>
                <strong>Performs Worse On:</strong><br/>
                - Newly initiated projects (&lt; 6 months old)<br/>
                - Projects in states with sparse historical data (NE states, smaller UTs)<br/>
                - Projects with missing contractor financial data
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ border: '1px solid #e2e8f0', height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, fontSize: '0.85rem' }}>
                How to Add New Data
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.78rem', mb: 1 }}>
                Upload via CUF (Central Upload Format) at <a href="/upload" style={{ color: '#0284c7' }}>/upload</a>
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.78rem' }}>
                <strong>Required Fields:</strong> Project name, sector, state, sanctioned cost, physical progress, planned progress, start date, contractor, expenditure.
                <br/><br/>
                Data is validated against schema, then the model can be retrained via:<br/>
                <code style={{ backgroundColor: '#e2e8f0', padding: '2px 4px', borderRadius: '4px' }}>python ml/train_eval.py</code>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
