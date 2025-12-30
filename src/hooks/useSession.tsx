import useSWR from 'swr';
import { useCallback, useState } from 'react';
import type { User, UserLoginDto, UserSignupDto } from 'types/user';
import { getSession, loginUser, signupUser, logoutUser, AUTH_API_PATH } from 'api/auth';

export function useSession() {
  const [loading, setLoading] = useState(false);

  // session
  const { data: user, error, mutate } = useSWR<User | null>(`${AUTH_API_PATH}/session`, getSession);

  // login
  const login = useCallback(async (userLogin: UserLoginDto) => {
    setLoading(true);
    try {
      const loggedInUser = await loginUser(userLogin);
      mutate(loggedInUser, false);
      return loggedInUser;
    } finally {
      setLoading(false);
    }
  }, [mutate]);

  const signup = useCallback(async (data: UserSignupDto) => {
    setLoading(true);
    try {
      const newUser = await signupUser(data);
      mutate(newUser, false);
      return newUser;
    } finally {
      setLoading(false);
    }
  }, [mutate]);

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
    signup,
    logout,
    loading,
  };
}
