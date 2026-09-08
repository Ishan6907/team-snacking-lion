import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const USERS_FILE = path.join(__dirname, '../../data.json');

// Mock in-memory store for now, preloaded with the default user
export const users = [
  {
    id: 'user-1',
    email: 'demo@paimana.com',
    name: 'Demo Analyst',
    role: 'analyst',
    passwordHash: bcrypt.hashSync('password123', 10),
  }
];

export const findUserByEmail = (email: string) => {
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
};

export const updatePassword = (userId: string, newPasswordHash: string) => {
  const user = users.find(u => u.id === userId);
  if (user) {
    user.passwordHash = newPasswordHash;
    return true;
  }
  return false;
};
