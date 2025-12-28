import { User } from '../types';

const MOCK_DELAY = 1000;

export const login = async (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!email.includes('@') || password.length < 6) {
        reject(new Error('Invalid email or password too short (min 6 chars).'));
        return;
      }
      // Mock success
      resolve({
        email,
        name: email.split('@')[0],
      });
    }, MOCK_DELAY);
  });
};

export const logout = async (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 500);
  });
};