import { Router } from 'express';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/cuf', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Mock processing result
  setTimeout(() => {
    res.json({
      recordsProcessed: Math.floor(Math.random() * 500) + 100,
      recordsSkipped: Math.floor(Math.random() * 20),
      errors: [],
      predictionsTriggered: true,
    });
  }, 1500); // simulate delay
});

export default router;
