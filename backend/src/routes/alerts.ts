import { Router } from 'express';
import { db } from '../data/db';

const router = Router();

router.get('/unread-count', (req, res) => {
  res.json({ count: db.getUnreadAlertCount() });
});

router.patch('/read-all', (req, res) => {
  db.markAllAlertsAsRead();
  res.json({ success: true });
});

router.patch('/:id/read', (req, res) => {
  db.markAlertAsRead(req.params.id);
  res.json({ success: true });
});

import { generateAlerts } from '../services/alertEngine';

router.post('/generate', (req, res) => {
  const result = generateAlerts();
  res.json(result);
});

router.get('/', (req, res) => {
  res.json(db.getAlerts(req.query));
});

export default router;
