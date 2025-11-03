import { useState, useCallback } from 'react';

import type { Account } from "../api/accounts";
import { ACCOUNTS_PATH, createAccount } from "../api/accounts";

import { mutate } from "swr";

export function useCreateAccount() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = useCallback(async (account: Omit<Account, "id">) => {
    setLoading(true);
    setError(null);
    try {
      const newAccount = await createAccount(account);

      // update SWR cache manually
      mutate(ACCOUNTS_PATH, (accounts: Account[] = []) => [...accounts, newAccount], false);

      return newAccount;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, loading, error };
};
