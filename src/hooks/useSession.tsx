import useSWR from 'swr';
import { useState } from 'react';
import type { User, UserLoginDto } from 'types/user';
import { getSession, loginUser, logoutUser, AUTH_API_PATH } from 'api/auth';

export function useSession() {
  const [loading, setLoading] = useState(false);

  // session
  const { data: user, error, mutate } = useSWR<User | null>(`${AUTH_API_PATH}/session`, getSession);

  // login
  const login = async (userLogin: UserLoginDto) => {
    setLoading(true);
    try {
      const loggedInUser = await loginUser(userLogin);
      mutate(loggedInUser, false);
      return loggedInUser;
    } finally {
      setLoading(false);
    }
  };

  // logout
  const logout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      mutate(null, false); // clear SWR cache
    } finally {
      setLoading(false);
    }
  };

  return {
    user: user || null,
    isLoading: !error && !user,
    error,
    login,
    logout,
    loading,
  };
}
