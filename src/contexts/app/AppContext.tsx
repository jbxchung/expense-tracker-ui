import { createContext, useContext } from 'react';

import type { Account } from 'types/account';
import type { User } from 'types/user';

interface AppContextType {
  users: User[];
  usersLoading: boolean;
  usersError: Error | null;
  
  selectedUser: User | null;
  selectUser: (user: User) => void;

  accounts: Account[];
  accountsLoading: boolean;
  accountsError: Error | null;
}

export const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
}
