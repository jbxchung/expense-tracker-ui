import type { ReactNode } from 'react';

import { useAccounts } from 'hooks/accounts/useAccounts';
import { useSession } from 'hooks/useSession';

import { AppContext } from './AppContext';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const { user, login, logout, signup, isLoading: userLoading, error: userError } = useSession();
  const { accounts, isLoading: accountsLoading, error: accountsError } = useAccounts();

  return (
    <AppContext.Provider
      value={{
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
