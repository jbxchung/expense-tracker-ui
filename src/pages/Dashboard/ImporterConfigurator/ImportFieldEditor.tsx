import { type FC, useState } from 'react';

import { type FieldMapping, type Importer } from 'types/importer';

// import styles from './ImporterConfigurator.module.scss';

interface ImporterFieldEditorProps {
  fieldConfig: FieldMapping<any>;
  onChange?: (config: Importer) => void;
}

const ImportFieldEditor: FC<ImporterFieldEditorProps> = ({
  fieldConfig,
  // onChange,
}) => {
  return (
    <div>
      <pre>{JSON.stringify(fieldConfig, null, 4)}</pre>
    </div>
  );
};

export default ImportFieldEditor;
