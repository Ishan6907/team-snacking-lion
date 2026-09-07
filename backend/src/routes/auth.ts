import { Router } from 'express';

const router = Router();

router.post('/login', (req, res) => {
  const { email } = req.body;
  // Simple mock login
  const user = {
    id: 'user-1',
    email: email || 'demo@paimana.com',
    name: 'Demo Analyst',
    role: 'analyst',
  };
  const accessToken = 'backend-demo-jwt-token';
  res.json({ user, accessToken });
});

export default router;
