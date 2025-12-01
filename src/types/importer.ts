export type OperationStep =
  | { op: "ifNotNull"; sourceField: string; transform?: "negate" | "absolute"; return: string; }
  | { op: "fallback"; value: any }
  | { op: "concat"; sourceFields: string[]; separator?: string }
  | { op: "dateParse"; sourceField: string; format?: string }
  | { op: "exactMatch"; sourceField: string; mapping: Record<string, any>; fallback?: any }
  | { op: "startsWith"; sourceField: string; mapping: Record<string, any>; fallback?: any }
  | { op: "regexMatch"; sourceField: string; pattern: string; mapping: Record<string, any>; fallback?: any }
;

export type FieldMapping<Name> = {
  title: Name,
  operations: OperationStep[];
}

/* corresponding backend schema:
  id          String   @id @default(uuid())
  name        String
  description String?
  fileExtensions String[]   // e.g., [".csv", ".pdf"]
  mapping     Json          // the pipeline JSON (field operations)

  userId      String?       // null for global importers
  user        User?    @relation(fields: [userId], references: [id])

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
*/
export interface Importer {
  id: string;
  name: string;
  description: string;
  type: 'CSV';      // maybe consider adding more options in the future, like PDF
  mapping: {
    amount: FieldMapping<'Amount'>;
    date: FieldMapping<'Date'>;
    category: FieldMapping<'Category'>;
    description: FieldMapping<'Description'>;
    originalDescription: FieldMapping<'Original Description'>;
  };
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// default empty importer configuration
export const DEFAULT_IMPORTER: Importer = {
  id: 'NEW_IMPORTER',
  name: 'New Importer',
  type: 'CSV',
  description: 'New Importer Description',
  mapping: {
    amount: {
      title: 'Amount',
      operations: [],
    },
    date: {
      title: 'Date',
      operations: [],
    },
    category: {
      title: 'Category',
      operations: []
    },
    description: {
      title: 'Description',
      operations: [],
    },
    originalDescription: {
      title: 'Original Description',
      operations: [],
    },
  }
};
