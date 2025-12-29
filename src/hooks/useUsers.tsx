// import { useEffect } from 'react';
import useSWR from 'swr';

import type { User } from 'types/user';
import { getUsers, USERS_API_PATH } from 'api/users';
// import { useLocalStorage } from 'hooks/useLocalStorage';

export const useUsers = () => {
  const { data: users, error, isLoading } = useSWR<User[], Error>(USERS_API_PATH, getUsers);

  // // persistent selected user id
  // const [selectedUserId, setSelectedUserId] = useLocalStorage<string | null>('', null);

  // // derive the selected user object
  // const selectedUser = users?.find(u => u.id === selectedUserId) ?? users?.[0];

  // // default - select first user
  // useEffect(() => {
  //   if (!selectedUserId && users && users.length > 0) {
  //     setSelectedUserId(users[0].id);
  //   }
  // }, [users, selectedUserId, setSelectedUserId]);

  // const selectUser = (user: User) => {
  //   setSelectedUserId(user.id);
  // };

  return {
    users: users || [],
    // selectedUser,
    // selectUser,
    isLoading,
    error,
  };
};