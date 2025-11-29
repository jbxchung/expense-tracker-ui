import { type FC, useRef, useState } from 'react';

import styles from './ImporterConfigurator.module.scss';
import Tabs, { type TabElement } from 'components/Tabs/Tabs';

import ImportFieldEditor from './ImportFieldEditor';

import { DEFAULT_IMPORTER, type Importer } from 'types/importer';
import Input, { type InputHandle } from 'components/Input/Input';
import Button, { ButtonVariants } from 'components/Button/Button';
import { useSaveImporter } from 'hooks/importers/useSaveImporter';

interface ImportConfiguratorProps {
  importer?: Importer;
  availableFields: string[];
  onChange?: (config: Importer) => void;
}


const ImporterConfigurator: FC<ImportConfiguratorProps> = ({
  importer = DEFAULT_IMPORTER,
  availableFields,
  onChange,
}) => {
  const [editableImporter, setEditableImporter] = useState<Importer>(importer);
  const { save: saveImporter, loading: saving, error } = useSaveImporter();

  const nameInputRef = useRef<InputHandle | null>(null);

  const handleSubmit = async () => {
    const nameValid = nameInputRef.current?.validate() ?? false;
    if (!nameValid) return;

    console.log('saving importer:', editableImporter);
    await saveImporter(editableImporter);
    // todo - notify parent of change so it can be selected
    // await onSubmit({ name: name.trim(), type });
  };

  if (!importer) {
    importer = DEFAULT_IMPORTER;
  }

  const tabs: TabElement[] = Object.keys(importer.mapping).map((fieldName) => {
    const fieldConfig = importer.mapping[fieldName as keyof Importer['mapping']];
    return (
      <Tabs.Tab key={fieldName} title={fieldConfig.title}>
        <ImportFieldEditor fieldConfig={fieldConfig} />
      </Tabs.Tab>
    );
  });

  return (
    <div className={styles.importerConfiguratorForm}>
      <Input
        ref={nameInputRef}
        label="Importer Name"
        placeholder="Enter a name for this importer"
        value={editableImporter.name}
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
        value={editableImporter.description}
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
        </div> */}
        <div className={styles.formButtonsRight}>
          {/* <Button variant={ButtonVariants.SECONDARY} onClick={onCancel} disabled={submitting}>
            Cancel
          </Button> */}
          <Button variant={ButtonVariants.PRIMARY} onClick={handleSubmit} disabled={saving}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImporterConfigurator;
