import type { ApiResponse } from 'types/api-response';
import type { User, UserLoginDto } from 'types/user';
import { fetchApi, unwrapApiResponse } from 'utils/fetchUtils';

export const AUTH_API_PATH = '/auth';

export async function getSession(): Promise<User | null> {
  const response: ApiResponse<User> = await fetchApi(`${AUTH_API_PATH}/session`);
  if (!response.success) {
    return null;
  }

  return unwrapApiResponse<User>(response);
}

export async function loginUser(userLogin: UserLoginDto): Promise<User> {
  const response: ApiResponse<User> = await fetchApi(`${AUTH_API_PATH}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userLogin),
  });

  if (!response.success) {
    throw new Error(response.message);
  }

  return unwrapApiResponse<User>(response);
}

export async function logoutUser(): Promise<void> {
  await fetchApi(`${AUTH_API_PATH}/logout`, { method: 'POST' });
}
