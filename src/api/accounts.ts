// todo - share this DTO from the backend
export interface Account {
  id: string;
  name: string;
  type: AccountType;
};

export const AccountTypes = {
  CHECKING: 'Checking',
  SAVINGS: 'Savings',
  CREDIT_CARD: 'Credit Card'
} as const;
export type AccountType = typeof AccountTypes[keyof typeof AccountTypes];

// todo - actually get from api
let accounts: Account[] = [
  { id: 'account1', name: 'Example CC 1', type: AccountTypes.CREDIT_CARD },
  { id: 'account2', name: 'Example CC 2', type: AccountTypes.CREDIT_CARD},
  { id: 'account3', name: 'Example Checking', type: AccountTypes.CHECKING},
  { id: 'account4', name: 'Example Savings', type: AccountTypes.SAVINGS},
];
let tmpCount = 0;


export const ACCOUNTS_PATH = '/accounts';

export async function getAccounts(): Promise<Account[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return accounts;

  // const response = await fetch(ACCOUNTS_PATH);
  // if (!response.ok) {
  //   throw new Error('Failed to get accounts');
  // }

  // return response.json();
}

export async function createAccount(account: Omit<Account, 'id'>): Promise<Account> {
  const newAccount = { ...account, id: `non-persistent-account-${tmpCount++}` };
  const newAccounts = [...accounts, newAccount];
  accounts = newAccounts;
  await new Promise(resolve => setTimeout(resolve, 500));
  return newAccount;

  // const response = await fetch(ACCOUNTS_PATH, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify(account),
  // });

  // if (!response.ok) throw new Error('Failed to create account');
  // return response.json();
}

export async function deleteAccount(accountId: string): Promise<Account> {
  const targetIndex = accounts.findIndex(acc => acc.id === accountId);
  const deletedAccount = accounts.splice(targetIndex, 1);
  return deletedAccount[0];
  // const response = await fetch(`${ACCOUNTS_PATH}/${accountId}`, {
  //   method: 'DELETE',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  // });

  // if (!response.ok) throw new Error('Failed to delete account');
  // return response.json();
}