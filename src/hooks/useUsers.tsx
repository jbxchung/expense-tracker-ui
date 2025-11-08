import { useEffect } from 'react';
import useSWR from 'swr';

import { getUsers, USERS_API_PATH } from 'api/users';
import { useLocalStorage } from 'hooks/useLocalStorage';

export interface User {
  id: string;
  name: string;
  email?: string;
}

export const useUsers = () => {
  const { data: users, error, isLoading, isValidating } = useSWR<User[]>(USERS_API_PATH, getUsers);

  // persistent selected user id
  const [selectedUserId, setSelectedUserId] = useLocalStorage<string | null>('', null);

  // derive the selected user object
  const selectedUser = users?.find(u => u.id === selectedUserId) ?? users?.[0] ?? null;

  // default - select first user
  useEffect(() => {
    if (users && users.length > 0 && !selectedUserId) {
      setSelectedUserId(users[0].id);
    }
  }, [users, selectedUserId, setSelectedUserId]);

  const selectUser = (user: User) => {
    setSelectedUserId(user.id);
  };

  return {
    users: users || [],
    selectedUser,
    selectUser,
    loading: isLoading,
    error,
    isValidating,
  };
};