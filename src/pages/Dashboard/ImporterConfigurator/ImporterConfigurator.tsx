import { type FC, useRef, useState } from 'react';

import styles from './ImporterConfigurator.module.scss';
import { Tabs } from 'components/Tabs/Tabs';
import { Tab, type TabElement } from 'components/Tabs/Tab';

import ImportFieldEditor from './ImportFieldEditor';

import { DEFAULT_IMPORTER, type Importer } from 'types/importer';
import Input, { type InputHandle } from 'components/Input/Input';
import Button, { ButtonVariants } from 'components/Button/Button';

interface ImportConfiguratorProps {
  importer?: Importer;
  availableFields: string[];
  isEditable: boolean;
  onChange?: (config: Importer) => void;
}


// todo 2025.11.23 - make this similar to AccountForm and its variants
const ImporterConfigurator: FC<ImportConfiguratorProps> = ({
  importer = DEFAULT_IMPORTER,
  availableFields,
  isEditable,
  onChange,
}) => {
  const [editableImporter, setEditableImporter] = useState<Importer>(importer);

  const nameInputRef = useRef<InputHandle | null>(null);

  const handleSubmit = async () => {
    const nameValid = nameInputRef.current?.validate() ?? false;
    if (!nameValid) return;

    // await onSubmit({ name: name.trim(), type });
  };

  if (!importer) {
    importer = DEFAULT_IMPORTER;
  }

  const tabs: TabElement[] = Object.keys(importer.mapping).map((fieldName) => {
    const fieldConfig = importer.mapping[fieldName as keyof Importer['mapping']];
    return (
      <Tab key={fieldName} title={fieldConfig.title}>
        <ImportFieldEditor fieldConfig={fieldConfig} />
      </Tab>
    );
  });

  return (
    <div className={styles.importerConfiguratorForm}>
      <Input
        ref={nameInputRef}
        label="Importer Name"
        placeholder="Enter a name for this importer"
        value={importer.name}
        onChange={e => setEditableImporter({
          ...editableImporter,
          name: e.target.value
        })}
        validate={value => (value ? null : "Importer name is required")}
        required
      />
      <Input
        label="Importer Description"
        placeholder="Enter a brief description for this importer"
        value={importer.description}
        onChange={e => setEditableImporter({
          ...editableImporter,
          description: e.target.value
        })}
      />
      <Tabs defaultIndex={0}>
        {...tabs}
      </Tabs>
      
      <div className={styles.formButtonsContainer}>
        {/* <div className={styles.formButtonsLeft}>
        {onDelete && (
          <Button variant={ButtonVariants.DANGER} onClick={onDelete} disabled={submitting}>
            Delete
          </Button>
        )}
        </div>
        <div className={styles.formButtonsRight}>
          <Button variant={ButtonVariants.SECONDARY} onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
          <Button variant={ButtonVariants.PRIMARY} onClick={handleSubmit} disabled={submitting}>
            Save
          </Button>
        </div> */}
      </div>
    </div>
  );
};

export default ImporterConfigurator;
