import { Router } from 'express';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';

const router = Router();

router.get('/summary', async (req, res) => {
  try {
    // Find generate_pdf.py
    const possiblePaths = [
      path.resolve(__dirname, '../../../generate_pdf.py'),
      path.resolve(__dirname, '../../generate_pdf.py'),
      path.resolve(process.cwd(), 'generate_pdf.py'),
      path.resolve(process.cwd(), '../generate_pdf.py'),
    ];

    const scriptPath = possiblePaths.find(p => fs.existsSync(p));
    if (!scriptPath) {
      return res.status(500).json({ error: 'Report generation script not found.' });
    }

    const tempPdfName = `paimana_summary_${Date.now()}_${Math.random().toString(36).substring(7)}.pdf`;
    const tempPdfPath = path.join(os.tmpdir(), tempPdfName);

    const scriptDir = path.dirname(scriptPath);
    const command = `python "${scriptPath}" "${tempPdfPath}"`;

    exec(command, { cwd: scriptDir }, (error, stdout, stderr) => {
      if (error) {
        console.error('Error generating PDF:', error, stderr);
        return res.status(500).json({ error: 'Failed to generate PDF report', details: stderr || error.message });
      }

      if (!fs.existsSync(tempPdfPath)) {
        return res.status(500).json({ error: 'PDF file was not created by generator script.' });
      }

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="paimana_executive_delay_summary.pdf"');

      const fileStream = fs.createReadStream(tempPdfPath);
      fileStream.pipe(res);

      fileStream.on('close', () => {
        fs.unlink(tempPdfPath, (err) => {
          if (err) console.error('Failed to cleanup temp PDF:', err);
        });
      });
    });
  } catch (err: any) {
    console.error('Report route error:', err);
    res.status(500).json({ error: err.message || 'Internal server error generating report' });
  }
});

export default router;
