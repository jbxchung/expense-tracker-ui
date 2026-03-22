import type { Import } from "./import";

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  userId: string;
  imports: Import[];
  createdAt: string;
  updatedAt: string;
};

// use like an enum
export const AccountTypes = {
  CHECKING: 'Checking',
  SAVINGS: 'Savings',
  CREDIT_CARD: 'Credit Card'
} as const;
export type AccountTypeKey = keyof typeof AccountTypes;
export type AccountType = typeof AccountTypes[AccountTypeKey];
// generate reverse mapping
export const AccountTypeValueToKey: Record<AccountType, AccountTypeKey> = Object.entries(
  AccountTypes
).reduce((acc, [key, value]) => {
  acc[value as AccountType] = key as AccountTypeKey;
  return acc;
}, {} as Record<AccountType, AccountTypeKey>);
