import { Router } from 'express';
import { db } from '../data/db';

const router = Router();

router.get('/by-state', (req, res) => {
  res.json(db.getProjectsByState());
});

router.get('/:id', (req, res) => {
  const project = db.getProject(req.params.id);
  if (project) {
    res.json(project);
  } else {
    res.status(404).json({ error: 'Project not found' });
  }
});

router.get('/', (req, res) => {
  res.json(db.getProjectsList(req.query));
});

export default router;
