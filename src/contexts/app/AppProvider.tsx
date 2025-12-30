import type { ReactNode } from 'react';

import { useAccounts } from 'hooks/accounts/useAccounts';
import { useSession } from 'hooks/useSession';

import { AppContext } from './AppContext';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  // const { users, isLoading: usersLoading, error: usersError, selectedUser, selectUser } = useUsers();
  const { user, login, logout, signup, isLoading: userLoading, error: userError } = useSession();
  const { accounts, isLoading: accountsLoading, error: accountsError } = useAccounts(user);

  return (
    <AppContext.Provider
      value={{
        // users
        user,
        login,
        logout,
        signup,
        userLoading,
        userError,

        // accounts
        accounts,
        accountsLoading,
        accountsError: accountsError ?? null,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
