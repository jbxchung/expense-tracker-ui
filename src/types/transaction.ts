export type Transaction = {
  id: string;
  amount: number;
  date: Date;
  accountId: string;
  categoryId?: string;
  description?: string;
  originalDescription?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type StagedTransaction = Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>;
