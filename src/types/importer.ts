export type FieldMapping = {
  field: string;
  title: string;
  rules: FieldMappingRule[];
}

export type FieldMappingRule = {
  condition: FieldMappingRuleCondition;
  action: FieldMappingRuleAction;
};

export type FieldMappingRuleCondition = {
  column: string;
  type: FieldMappingRuleConditionType;
  exact?: string[];
  startsWith?: string[];
  includes?: string[];
  regex?: string;
}
export const FieldMappingRuleConditionTypes = {
  EXISTS: 'exists',
  MATCHES: 'matches',
  STARTS_WITH: 'startsWith',
  INCLUDES: 'includes',
  REGEX: 'regex',
} as const;
export type FieldMappingRuleConditionType = typeof FieldMappingRuleConditionTypes[keyof typeof FieldMappingRuleConditionTypes];
export const FieldMappingRuleConditionTypeLabels = {
  [FieldMappingRuleConditionTypes.EXISTS]: 'exists',
  [FieldMappingRuleConditionTypes.MATCHES]: 'exactly matches',
  [FieldMappingRuleConditionTypes.STARTS_WITH]: 'starts with',
  [FieldMappingRuleConditionTypes.INCLUDES]: 'includes',
  [FieldMappingRuleConditionTypes.REGEX]: 'matches regex',
};


export type FieldMappingRuleAction = {
  type: 'useColumn' | 'setValue';
  column?: string;
  value?: string;
  // transform?: 'uppercase' | 'lowercase' | 'trim';
}
export const FieldMappingRuleActionTypes = {
  USE_COLUMN: 'useColumn',
  SET_VALUE: 'setValue',
} as const;
export type FieldMappingRuleActionType = typeof FieldMappingRuleActionTypes[keyof typeof FieldMappingRuleActionTypes];
export const FieldMappingRuleActionTypeLabels = {
  [FieldMappingRuleActionTypes.USE_COLUMN]: 'use',
  [FieldMappingRuleActionTypes.SET_VALUE]: 'set value to',
};


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
    amount: FieldMapping;
    date: FieldMapping;
    category: FieldMapping;
    description: FieldMapping;
    originalDescription: FieldMapping;
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
      field: 'amount',
      title: 'Amount',
      rules: [],
    },
    date: {
      field: 'date',
      title: 'Date',
      rules: [],
    },
    category: {
      field: 'category',
      title: 'Category',
      rules: []
    },
    description: {
      field: 'description',
      title: 'Description',
      rules: [],
    },
    originalDescription: {
      field: 'originalDescription',
      title: 'Original Description',
      rules: [],
    },
  }
};
