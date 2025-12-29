import { useState, useCallback } from 'react';
import { mutate } from 'swr';

import { AccountTypes, type Account } from 'types/account';
import { ACCOUNTS_API_PATH, createAccount } from 'api/accounts';

export function useCreateAccount() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = useCallback(async (account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);

    try {
      const newAccount = await createAccount(account);

      // enum fix
      newAccount.type = AccountTypes[newAccount.type as keyof typeof AccountTypes];
      
      // update SWR cache manually
      mutate(ACCOUNTS_API_PATH, (accounts: Account[] = []) => [...accounts, newAccount], false);

      return newAccount;
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, loading, error };
};
