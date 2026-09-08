import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jwt-simple';
import { findUserByEmail, updatePassword } from '../data/users';

const router = Router();
const SECRET = process.env.JWT_SECRET || 'paimana-super-secret-key-2026';

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const isValid = bcrypt.compareSync(password, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const payload = { id: user.id, email: user.email, role: user.role };
  const accessToken = jwt.encode(payload, SECRET);

  // Omit passwordHash from response
  const { passwordHash, ...safeUser } = user;
  res.json({ user: safeUser, accessToken });
});

router.post('/change-password', (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  
  const user = findUserByEmail(email);
  if (!user || !bcrypt.compareSync(oldPassword, user.passwordHash)) {
    return res.status(401).json({ error: 'Invalid current password' });
  }

  const newHash = bcrypt.hashSync(newPassword, 10);
  updatePassword(user.id, newHash);
  
  res.json({ success: true, message: 'Password updated successfully' });
});

export default router;
