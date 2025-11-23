import type { Category } from "./category";

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
export interface ImporterConfig {
  id: string;
  name: string;
  description: string;
  type: 'csv';      // maybe consider adding more options in the future, like PDF
  delimiter: string;
  mapping: {
    amount: FieldMapping<'Amount'>;
    date: FieldMapping<'Date'>;
    category: FieldMapping<'Category'>;
    description: FieldMapping<'Description'>;
    originalDescription: FieldMapping<'Original Description'>;
  };
}

// todo - make this empty; for testing it's set to parse the test csv file
export const DEFAULT_IMPORTER: ImporterConfig = {
  id: '',
  name: 'New Importer',
  type: 'csv',
  description: 'New Importer Description',
  delimiter: ',',
  mapping: {
    amount: {
      title: 'Amount',
      operations: [
        { op: "ifNotNull", sourceField: "Credit", return: "Credit" },
        { op: "ifNotNull", sourceField: "Debit", transform: "negate", return: "Debit" },
        { op: "fallback", value: 0 }
      ],
    },
    date: {
      title: 'Date',
      operations: [
        { op: "dateParse", sourceField: "Date", format: "MM/DD/YYYY" },
        { op: "fallback", value: new Date() }
      ],
    },
    category: {
      title: 'Category',
      operations: [
        { op: "fallback", value: "Uncategorized" }
      ]
    },
    description: {
      title: 'Description',
      operations: [
        { op: "fallback", value: "" }
      ],
    },
    originalDescription: {
      title: 'Original Description',
      operations: [
        { op: "ifNotNull", sourceField: "Description", return: "Description" },
        { op: "fallback", value: "" }
      ],
    },
  }
};
