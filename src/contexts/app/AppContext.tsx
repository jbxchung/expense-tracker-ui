import { createContext, useContext } from 'react';

import type { Account } from 'types/account';
import type { User, UserLoginDto } from 'types/user';

interface AppContextType {
  user: User | null;
  login: (user: UserLoginDto) => void;
  logout: () => void;
  userLoading: boolean;
  userError: Error | null;

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
