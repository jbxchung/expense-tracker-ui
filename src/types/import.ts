export interface Import {
  id: string;
  fileName?: string;
  transactionCount: number;
  importerId?: string;
  importer?: { id: string; name: string };
  createdAt: Date;
}
