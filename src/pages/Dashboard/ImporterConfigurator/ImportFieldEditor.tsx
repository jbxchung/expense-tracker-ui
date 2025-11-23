import { type FC, useState } from 'react';

import { type FieldMapping, type ImporterConfig } from 'types/importer';

import styles from './ImporterConfigurator.module.scss';

interface ImporterFieldEditorProps {
  fieldConfig: FieldMapping<any>;
  onChange?: (config: ImporterConfig) => void;
}

const ImportFieldEditor: FC<ImporterFieldEditorProps> = ({
  fieldConfig,
  onChange,
}) => {
  
  return (
    <div>
      field editor for {fieldConfig.title}
      <pre>{JSON.stringify(fieldConfig, null, 4)}</pre>
    </div>
  );
};

export default ImportFieldEditor;
