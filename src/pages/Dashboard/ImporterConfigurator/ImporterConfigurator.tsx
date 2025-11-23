import { type FC, useState } from 'react';

import styles from './ImporterConfigurator.module.scss';
import { Tabs } from 'components/Tabs/Tabs';
import { Tab, type TabElement } from 'components/Tabs/Tab';
import { stagedTransactionKeys, stagedTransactionTemplate, type StagedTransaction } from 'types/transaction';

// 2025.11.21 TODO - rethink UI for CSV importer configuration

export type PreprocessStep =
  | { type: "trim" }
  | { type: "removeEmptyRows" };

export type PostprocessStep =
  | { type: "normalizeAmount" }
  | { type: "inferCategory" };

export interface ImporterConfig {
  type: "csv";
  adapter: {
    delimiter: string;
    hasHeader: boolean;
  };
  preprocess: PreprocessStep[];
  mapping: {
    date: string | null;
    amount: {
      credit: string | null;
      debit: string | null;
    };
    merchant: string | null;
    notes: string | null;
  };
  postprocess: PostprocessStep[];
}

const DEFAULT_IMPORTER: ImporterConfig = {
  type: "csv",
  adapter: {
    delimiter: ",",
    hasHeader: true,
  },
  preprocess: [
    { type: "trim" },
    { type: "removeEmptyRows" },
  ],
  mapping: {
    date: "Date",
    amount: {
      credit: "AmountIn",
      debit: "AmountOut",
    },
    merchant: "Description",
    notes: null,
  },
  postprocess: [
    { type: "normalizeAmount" },
    { type: "inferCategory" },
  ],
};

interface Props {
  importerId: string;
  isEditable: boolean;
  onChange?: (config: ImporterConfig) => void;
}

export const ImporterConfigurer: FC<Props> = ({
  importerId,
  isEditable,
  onChange,
}) => {
  const [config, setConfig] = useState<ImporterConfig>(DEFAULT_IMPORTER);

  
  const tabs: TabElement[] = Object.keys(stagedTransactionTemplate).map((transactionObjectKey) => {
    const field = stagedTransactionTemplate[transactionObjectKey as keyof StagedTransaction];
    return (
      <Tab key={transactionObjectKey} title={field.title}>
        Config for {transactionObjectKey}
      </Tab>
    );
  });

  return (
    <div>
      <h3>Importer Config ({importerId})</h3>
      <Tabs defaultIndex={0}>
        {...tabs}
      </Tabs>
    </div>
  );
};

export default ImporterConfigurer;
