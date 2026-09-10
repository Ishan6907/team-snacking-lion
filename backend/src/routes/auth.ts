import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jwt-simple';
import { findUserByEmail, updatePassword, findUserById, createUser, User } from '../data/users';

const router = Router();
const SECRET = process.env.JWT_SECRET || 'paimana-super-secret-key-2026';

// Rate Limiting
const rateLimitMap = new Map<string, { count: number, resetTime: number }>();

const rateLimiter = (req: any, res: any, next: any) => {
  const ip = req.ip || req.connection?.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return next();
  }
  
  const record = rateLimitMap.get(ip)!;
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
    return next();
  }
  
  if (record.count >= 5) {
    return res.status(429).json({ error: 'Too many login attempts. Try again in 15 minutes.' });
  }
  
  record.count++;
  next();
};

export const requireRole = (...roles: string[]) => {
  return (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid token' });
    }
    
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.decode(token, SECRET);
      if (decoded.exp && Date.now() >= decoded.exp) {
        return res.status(401).json({ error: 'Token expired' });
      }
      if (!roles.includes(decoded.role)) {
        return res.status(403).json({ error: 'Forbidden: insufficient role permissions' });
      }
      req.user = decoded;
      next();
    } catch (e) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
};

router.post('/login', rateLimiter, (req, res) => {
  const { email, password } = req.body;
  
  const user = findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const isValid = bcrypt.compareSync(password, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const exp = Date.now() + 8 * 60 * 60 * 1000; // 8 hours
  const payload = { id: user.id, email: user.email, role: user.role, exp };
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

router.post('/register', requireRole('admin'), (req, res) => {
  const { email, password, name, role, agency, department } = req.body;
  
  if (findUserByEmail(email)) {
    return res.status(400).json({ error: 'Email already exists' });
  }
  
  const newUser: User = {
    id: `user-${Date.now()}`,
    email,
    name,
    role,
    passwordHash: bcrypt.hashSync(password, 10),
    agency,
    department
  };
  
  createUser(newUser);
  const { passwordHash, ...safeUser } = newUser;
  res.status(201).json({ success: true, user: safeUser });
});

router.get('/me', (req: any, res: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid token' });
  }
  
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.decode(token, SECRET);
    if (decoded.exp && Date.now() >= decoded.exp) {
      return res.status(401).json({ error: 'Token expired' });
    }
    const user = findUserById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { passwordHash, ...safeUser } = user;
    res.json({ user: safeUser });
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
