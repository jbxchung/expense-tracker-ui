import { type FC, useState } from 'react';

import styles from './ImporterConfigurator.module.scss';
import { Tabs } from 'components/Tabs/Tabs';
import { Tab, type TabElement } from 'components/Tabs/Tab';

import ImportFieldEditor from './ImportFieldEditor';

import { DEFAULT_IMPORTER, type ImporterConfig } from 'types/importer';

interface ImportConfiguratorProps {
  importerId: string;
  availableFields: string[];
  isEditable: boolean;
  onChange?: (config: ImporterConfig) => void;
}

const ImporterConfigurator: FC<ImportConfiguratorProps> = ({
  importerId,
  availableFields,
  isEditable,
  onChange,
}) => {
  const [importerConfig, setImporterConfig] = useState<ImporterConfig>(DEFAULT_IMPORTER);

  
  const tabs: TabElement[] = Object.keys(importerConfig.mapping).map((fieldName) => {
    const fieldConfig = importerConfig.mapping[fieldName as keyof ImporterConfig['mapping']];
    return (
      <Tab key={fieldName} title={fieldConfig.title}>
        <ImportFieldEditor fieldConfig={fieldConfig} />
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

export default ImporterConfigurator;
