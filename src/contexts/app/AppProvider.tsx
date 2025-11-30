import type { ReactNode } from 'react';

import { useAccounts } from 'hooks/accounts/useAccounts';
import { useUsers } from 'hooks/useUsers';

import { AppContext } from './AppContext';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const { users, isLoading: usersLoading, error: usersError, selectedUser, selectUser } = useUsers();
  const { accounts, isLoading: accountsLoading, error: accountsError } = useAccounts(selectedUser);

  return (
    <AppContext.Provider
      value={{
        // users
        users,
        usersLoading,
        usersError: usersError ?? null,
        
        selectedUser: selectedUser ?? null,
        selectUser,

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
