// todo - share this DTO from the backend
export interface Account {
  id: string;
  name: string;
  type: AccountType;
};

export const AccountTypes = {
  CHECKING: 'CHECKING',
  SAVINGS: 'SAVINGS',
  CREDIT_CARD: 'CC'
} as const;
export type AccountType = typeof AccountTypes[keyof typeof AccountTypes];

// todo - actually get from api
const accounts: Account[] = [
  { id: 'account1', name: 'Example CC 1', type: AccountTypes.CREDIT_CARD },
  { id: 'account2', name: 'Example CC 2', type: AccountTypes.CREDIT_CARD},
  { id: 'account3', name: 'Example Checking', type: AccountTypes.CHECKING},
  { id: 'account4', name: 'Example Savings', type: AccountTypes.SAVINGS},
];
let tmpCount = 0;

export const ACCOUNTS_PATH = '/accounts';

export async function getAccounts(): Promise<Account[]> {
  return accounts;

  // const response = await fetch(ACCOUNTS_PATH);
  // if (!response.ok) {
  //   throw new Error('Failed to get accounts');
  // }

  // return response.json();
}

export async function createAccount(account: Omit<Account, 'id'>): Promise<Account> {
  const newAccount = { ...account, id: `non-persistent-account-${tmpCount++}` };
  accounts.push(newAccount);
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