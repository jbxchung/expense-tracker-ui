import { useState, useCallback } from 'react';
import { mutate } from 'swr';

import { AccountTypes, type Account } from 'types/account';
import { ACCOUNTS_API_PATH, updateAccount } from 'api/accounts';
import { useAppContext } from 'contexts/app/AppContext';

export function useUpdateAccount() {
  const { selectedUser } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = useCallback(async (account: Partial<Omit<Account, 'createdAt' | 'updatedAt'>> & { id: string }) => {
    setLoading(true);
    setError(null);

    try {
      const updatedAccount = await updateAccount(account);

      // enum fix
      updatedAccount.type = AccountTypes[updatedAccount.type as keyof typeof AccountTypes];

      // update SWR cache manually
      mutate(selectedUser ? `${selectedUser}_${ACCOUNTS_API_PATH}` : null, (accounts: Account[] = []) => accounts.map(a => (a.id === updatedAccount.id ? updatedAccount : a)), false);

      return updatedAccount;
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [selectedUser]);

  return { update, loading, error };
}
