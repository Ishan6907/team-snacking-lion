import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'analyst' | 'viewer';
  passwordHash: string;
  agency?: string;
  department?: string;
}

export const users: User[] = [
  {
    id: 'user-1',
    email: 'admin@paimana.gov.in',
    name: 'Admin User',
    role: 'admin',
    passwordHash: bcrypt.hashSync('Admin@2026!', 10),
    agency: 'PAIMANA',
    department: 'Central'
  },
  {
    id: 'user-2',
    email: 'collector@gov.in',
    name: 'District Collector',
    role: 'analyst',
    passwordHash: bcrypt.hashSync('Collector@2026!', 10),
    agency: 'State Govt',
    department: 'Revenue'
  },
  {
    id: 'user-3',
    email: 'director@nhai.gov.in',
    name: 'NHAI Director',
    role: 'analyst',
    passwordHash: bcrypt.hashSync('Nhai@2026!', 10),
    agency: 'NHAI',
    department: 'Roads'
  },
  {
    id: 'user-4',
    email: 'auditor@cag.gov.in',
    name: 'CAG Auditor',
    role: 'viewer',
    passwordHash: bcrypt.hashSync('Auditor@2026!', 10),
    agency: 'CAG',
    department: 'Audit'
  },
  {
    id: 'user-5',
    email: 'demo@paimana.com',
    name: 'Demo Analyst',
    role: 'analyst',
    passwordHash: bcrypt.hashSync('password123', 10),
    agency: 'Demo',
    department: 'Demo'
  }
];

export const findUserByEmail = (email: string) => {
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
};

export const findUserById = (id: string) => {
  return users.find(u => u.id === id);
};

export const createUser = (user: User) => {
  users.push(user);
  return user;
};

export const updatePassword = (userId: string, newPasswordHash: string) => {
  const user = findUserById(userId);
  if (user) {
    user.passwordHash = newPasswordHash;
    return true;
  }
  return false;
};

export const getAllUsers = () => {
  return users;
};

export const deleteUser = (userId: string) => {
  const index = users.findIndex(u => u.id === userId);
  if (index !== -1) {
    users.splice(index, 1);
    return true;
  }
  return false;
};
