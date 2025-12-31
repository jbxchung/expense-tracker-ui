import useSWR from 'swr';

import type { User } from 'types/user';
import { getUsers, USERS_API_PATH } from 'api/users';

export const useUsers = () => {
  const { data: users, error, isLoading } = useSWR<User[], Error>(USERS_API_PATH, getUsers);

  return {
    users: users || [],
    isLoading,
    error,
  };
};