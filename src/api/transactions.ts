import type { ApiResponse } from 'types/api-response';
import type { StagedTransaction, Transaction } from 'types/transaction';
import { mergeDateRange } from 'utils/dateUtils';
import { fetchApi, unwrapApiResponse } from 'utils/fetchUtils';

export const TRANSACTIONS_API_PATH = '/transactions';

interface AccountTransactionCacheEntry {
  transactions: Transaction[];
  minDate?: Date;
  maxDate?: Date;
}
const accountTransactionCache = new Map<string, AccountTransactionCacheEntry>();

export async function fetchTransactions(accountIds: string[], from?: Date, to?: Date, skipCache = false): Promise<Transaction[]> {
  // determine which accounts need fetching
  const accountsToFetch = skipCache
    ? accountIds                        // get all if skipCache is true
    : accountIds.filter(accountId => {  // otherwise only get those not in cache or out of date range
      const cacheEntry = accountTransactionCache.get(accountId);
      return (!cacheEntry
        || (from && (!cacheEntry.minDate || from < cacheEntry.minDate))
        || (to && (!cacheEntry.maxDate || to > cacheEntry.maxDate))
      );
    })

  // fetch from backend if needed
  if (accountsToFetch.length > 0) {
    const queryParams = new URLSearchParams();
    accountsToFetch.forEach(accountId => {
      queryParams.append('accountId', encodeURIComponent(accountId));
    });
    if (from) queryParams.append('from', from.getTime().toString());
    if (to) queryParams.append('to', to.getTime().toString());

    const response: ApiResponse<Transaction[]> = await fetchApi(`${TRANSACTIONS_API_PATH}?${queryParams.toString()}`);
    const fetchedTransactions = await unwrapApiResponse(response);

    // update cache for fetched accounts
    for (const accountId of accountsToFetch) {
      const existingCacheEntry = accountTransactionCache.get(accountId);
      const newTransactions = fetchedTransactions.filter(tx => tx.accountId === accountId);

      const newDateRange = mergeDateRange(
        { minDate: existingCacheEntry?.minDate, maxDate: existingCacheEntry?.maxDate },
        { minDate: from, maxDate: to }
      );

      accountTransactionCache.set(accountId, {
        transactions: existingCacheEntry
          ? [...existingCacheEntry.transactions, ...newTransactions].filter((tx, idx, arr) => arr.findIndex(t => t.id === tx.id) === idx)
          : newTransactions,
          ...newDateRange,
      });
    }
  }

  return accountIds.flatMap(accountId => (
    (accountTransactionCache.get(accountId)?.transactions ?? []).filter(tx =>
      (!from || new Date(tx.date) >= from) && (!to || new Date(tx.date) <= to)
    )
  ));
}


export async function saveTransactions(accountId: string, transactions: StagedTransaction[]) {
  const normalized = transactions.map(tx => ({
    ...tx,
    date:  tx.date ? new Date(tx.date).toISOString() : tx.date, // convert to timestamp if it's a Date object
  }));

  const response: ApiResponse<{ count: number }> = await fetchApi(`${TRANSACTIONS_API_PATH}/batch/${accountId}`, {
    method: 'POST',
    body: JSON.stringify(normalized),
  });

  const result = await unwrapApiResponse<{ count: number }>(response);

  // invalidate cache for this account so next fetch gets fresh data
  accountTransactionCache.delete(accountId);

  return result;
}

export async function updateTransaction(transaction: Partial<Omit<Transaction, 'createdAt' | 'updatedAt'>> & { id: string }): Promise<Transaction> {
  const response: ApiResponse<Transaction> = await fetchApi(`${TRANSACTIONS_API_PATH}/${transaction.id}`, {
    method: 'PATCH',
    body: JSON.stringify(transaction),
  });

  const updatedTransaction = await unwrapApiResponse<Transaction>(response);

  // update cache entry in place
  const cacheEntry = accountTransactionCache.get(updatedTransaction.accountId);
  if (cacheEntry) {
    accountTransactionCache.set(updatedTransaction.accountId, {
      ...cacheEntry,
      transactions: cacheEntry.transactions.map(tx => tx.id === updatedTransaction.id ? updatedTransaction : tx),
    });
  }

  return updatedTransaction;
}
