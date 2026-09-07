import { Router } from 'express';
import { db } from '../data/db';

const router = Router();

router.get('/', (req, res) => {
  res.json(db.getSectors());
});

router.get('/:id', (req, res) => {
  const sectors = db.getSectors();
  const sector = sectors.find(s => s.id === req.params.id);
  if (sector) {
    res.json(sector);
  } else {
    res.status(404).json({ error: 'Sector not found' });
  }
});

export default router;
