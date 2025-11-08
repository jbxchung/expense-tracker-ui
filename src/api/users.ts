import type { ApiResponse } from 'types/api-response';
import type { User } from 'types/user';
import { fetchApi, unwrapApiResponse } from 'utils/fetchUtils';

export const USERS_API_PATH = '/users';

export async function getUsers(): Promise<User[]> {
  const response: ApiResponse<User[]> = await fetchApi(USERS_API_PATH);

  return unwrapApiResponse<User[]>(response);
}
