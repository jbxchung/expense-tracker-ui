import { type FC, useState } from 'react';

import styles from './ImporterConfigurator.module.scss';

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

  const update = <K extends keyof ImporterConfig>(
    key: K,
    value: ImporterConfig[K]
  ) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    onChange?.(newConfig);
  };

  const updateMapping = (field: keyof ImporterConfig["mapping"], value: any) => {
    const newConfig = {
      ...config,
      mapping: {
        ...config.mapping,
        [field]: value,
      },
    };
    setConfig(newConfig);
    onChange?.(newConfig);
  };

  const updateAmountMapping = (
    field: keyof ImporterConfig["mapping"]["amount"],
    value: string | null
  ) => {
    const newConfig = {
      ...config,
      mapping: {
        ...config.mapping,
        amount: {
          ...config.mapping.amount,
          [field]: value,
        },
      },
    };
    setConfig(newConfig);
    onChange?.(newConfig);
  };

  const updateAdapter = (key: keyof ImporterConfig["adapter"], value: any) => {
    update("adapter", { ...config.adapter, [key]: value });
  };

  const addPreprocess = (type: PreprocessStep["type"]) => {
    update("preprocess", [...config.preprocess, { type }]);
  };

  const removePreprocess = (index: number) => {
    update(
      "preprocess",
      config.preprocess.filter((_, i) => i !== index)
    );
  };

  const addPostprocess = (type: PostprocessStep["type"]) => {
    update("postprocess", [...config.postprocess, { type }]);
  };

  const removePostprocess = (index: number) => {
    update(
      "postprocess",
      config.postprocess.filter((_, i) => i !== index)
    );
  };

  return (
    <div>
      <h3>Importer Config ({importerId})</h3>

      {/* ---------------- Adapter ---------------- */}
      <section>
        <h4>CSV Adapter</h4>
        <div>
          <label>Delimiter</label>
          <input
            disabled={!isEditable}
            value={config.adapter.delimiter}
            onChange={(e) => updateAdapter("delimiter", e.target.value)}
          />
        </div>

        <div>
          <label>Has Header Row</label>
          <input
            disabled={!isEditable}
            type="checkbox"
            checked={config.adapter.hasHeader}
            onChange={(e) => updateAdapter("hasHeader", e.target.checked)}
          />
        </div>
      </section>

      {/* ---------------- Preprocess Steps ---------------- */}
      <section>
        <h4>Preprocess Steps</h4>
        {config.preprocess.map((step, i) => (
          <div key={i}>
            <span>{step.type}</span>
            {isEditable && (
              <button onClick={() => removePreprocess(i)}>Remove</button>
            )}
          </div>
        ))}

        {isEditable && (
          <select onChange={(e) => addPreprocess(e.target.value as any)}>
            <option value="">Add step…</option>
            <option value="trim">trim</option>
            <option value="removeEmptyRows">removeEmptyRows</option>
          </select>
        )}
      </section>

      {/* ---------------- Column Mapping ---------------- */}
      <section>
        <h4>Column Mapping</h4>

        <div>
          <label>Date</label>
          <input
            disabled={!isEditable}
            value={config.mapping.date ?? ""}
            onChange={(e) => updateMapping("date", e.target.value || null)}
          />
        </div>

        <div>
          <label>Amount (credit)</label>
          <input
            disabled={!isEditable}
            value={config.mapping.amount.credit ?? ""}
            onChange={(e) => updateAmountMapping("credit", e.target.value || null)}
          />
        </div>

        <div>
          <label>Amount (debit)</label>
          <input
            disabled={!isEditable}
            value={config.mapping.amount.debit ?? ""}
            onChange={(e) => updateAmountMapping("debit", e.target.value || null)}
          />
        </div>

        <div>
          <label>Merchant</label>
          <input
            disabled={!isEditable}
            value={config.mapping.merchant ?? ""}
            onChange={(e) => updateMapping("merchant", e.target.value || null)}
          />
        </div>

        <div>
          <label>Notes</label>
          <input
            disabled={!isEditable}
            value={config.mapping.notes ?? ""}
            onChange={(e) => updateMapping("notes", e.target.value || null)}
          />
        </div>
      </section>

      {/* ---------------- Postprocess Steps ---------------- */}
      <section>
        <h4>Postprocess Steps</h4>
        {config.postprocess.map((step, i) => (
          <div key={i}>
            <span>{step.type}</span>
            {isEditable && (
              <button onClick={() => removePostprocess(i)}>Remove</button>
            )}
          </div>
        ))}

        {isEditable && (
          <select onChange={(e) => addPostprocess(e.target.value as any)}>
            <option value="">Add step…</option>
            <option value="normalizeAmount">normalizeAmount</option>
            <option value="inferCategory">inferCategory</option>
          </select>
        )}
      </section>
    </div>
  );
};

export default ImporterConfigurer;
