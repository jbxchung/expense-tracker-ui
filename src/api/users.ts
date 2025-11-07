import { API_BASE_URL } from 'utils/hostUtils';

export interface User {
  id: string;
  name: string;
  email: string;
};

export const USERS_API_PATH = '/users';

export async function getUsers(): Promise<User[]> {
  const response = await fetch(`${API_BASE_URL}${USERS_API_PATH}`);
  if (!response.ok) {
    throw new Error('Failed to get users');
  }

  return response.json();
}
