import { useState, useCallback } from 'react';
import { mutate } from 'swr';

import type { Account } from 'types/account';
import { ACCOUNTS_API_PATH, deleteAccount } from 'api/accounts';
import { useAppContext } from 'contexts/app/AppContext';

export function useDeleteAccount() {
  const { selectedUser } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const remove = useCallback(async (accountId: string) => {
    if (!selectedUser) {
      throw new Error('No selected user');
    }

    setLoading(true);
    setError(null);

    try {
      await deleteAccount(accountId);

      // remove account from SWR cache manually
      mutate(`${selectedUser}_${ACCOUNTS_API_PATH}`, (accounts: Account[] = []) => accounts.filter(acc => acc.id !== accountId), false);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [selectedUser]);

  return { remove, loading, error };
}
