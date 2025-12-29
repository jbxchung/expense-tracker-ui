import type { ApiResponse } from 'types/api-response';
import { type Account, type AccountTypeKey, AccountTypes, AccountTypeValueToKey } from 'types/account';
import type { User } from 'types/user';
import { fetchApi, unwrapApiResponse } from 'utils/fetchUtils';

export const ACCOUNTS_API_PATH = '/accounts';

export async function getAccounts(user: User | null): Promise<Account[]> {
  const response: ApiResponse<Account[]> = await fetchApi(`${ACCOUNTS_API_PATH}/?userId=${user?.id}`);
  
  // map backend AccountType to frontend for display
  const accounts: Account[] = (await unwrapApiResponse<Account[]>(response)).map(account => ({
    ...account,
    type: AccountTypes[account.type as AccountTypeKey],
  }));

  return accounts;
}

export async function createAccount(account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>): Promise<Account> {
  const response: ApiResponse<Account> = await fetchApi(ACCOUNTS_API_PATH, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...account,
      type: AccountTypeValueToKey[account.type],
    }),
  });

  return unwrapApiResponse<Account>(response);
}

export async function updateAccount(account: Partial<Omit<Account, 'createdAt' | 'updatedAt'>> & { id: string }): Promise<Account> {
  const response: ApiResponse<Account> = await fetchApi(`${ACCOUNTS_API_PATH}/${account.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...account,
      type: account.type
        ? AccountTypeValueToKey[account.type]
        : undefined,
    }),
  });

  return unwrapApiResponse<Account>(response);
}

export async function deleteAccount(accountId: string): Promise<Account> {
  const response: ApiResponse<Account> = await fetchApi(`${ACCOUNTS_API_PATH}/${accountId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
  });

  return unwrapApiResponse<Account>(response);
}