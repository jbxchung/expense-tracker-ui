import { type FC, useRef, useState } from 'react';

import { DEFAULT_IMPORTER, type FieldMapping, type Importer } from 'types/importer';
import { useSaveImporter } from 'hooks/importers/useSaveImporter';
import { getHeadersFromCSV } from 'utils/fileUtils';

import Button, { ButtonVariants } from 'components/Button/Button';
import Input, { type InputHandle } from 'components/Input/Input';
import Tabs, { type TabElement } from 'components/Tabs/Tabs';

import ImportFieldEditor from './ImportFieldEditor';

import styles from './ImporterConfigurator.module.scss';
import InlineEdit from 'components/InlineEdit/InlineEdit';


interface ImportConfiguratorProps {
  importer?: Importer;
  onSave?: (config: Importer) => void;
}

const ImporterConfigurator: FC<ImportConfiguratorProps> = ({
  importer = DEFAULT_IMPORTER,
  onSave,
}) => {
  const fileInput = useRef<HTMLInputElement>(null);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const [editableImporter, setEditableImporter] = useState<Importer>(importer);
  const { save: saveImporter, loading: saving } = useSaveImporter();

  const nameInputRef = useRef<InputHandle | null>(null);

  // util for updating importer state
  const updateImporter = (updater: (prev: Importer) => Importer) => {
    setEditableImporter(prev => updater(prev));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      setUploadedFile(null);
      return;
    }

    const file = files[0];
    setUploadedFile(file);

    const availableFields = await getHeadersFromCSV(file, ',');
    updateImporter(prev => ({
      ...prev,
      sourceFields: availableFields,
    }));
  }

  const handleSubmit = async () => {
    const nameValid = nameInputRef.current?.validate?.() ?? false;
    if (!nameValid) return;

    console.log('saving importer:', editableImporter);
    await saveImporter(editableImporter);
    
    if (onSave) {
      onSave(editableImporter);
    }
  };

  const handleFieldChanged = (newFieldMapping: FieldMapping) => {
    updateImporter(prev => ({
      ...prev,
      mapping: {
        ...prev.mapping,
        [newFieldMapping.field]: newFieldMapping,
      }
    }));
  }

  const tabs: TabElement[] = Object.keys(editableImporter.mapping).map((fieldName) => {
    const fieldConfig = editableImporter.mapping[fieldName as keyof Importer['mapping']];
    return (
      <Tabs.Tab key={fieldName} title={fieldConfig.title}>
        <ImportFieldEditor fieldConfig={fieldConfig} onChange={handleFieldChanged} availableSourceFields={editableImporter.sourceFields} />
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
        onChange={e => updateImporter(prev => ({ ...prev, name: e.target.value }))}
        validate={value => (value ? null : "Importer name is required")}
        required
      />
      <Input
        label="Importer Description"
        placeholder="Enter a brief description for this importer"
        value={editableImporter.description}
        onChange={e => updateImporter(prev => ({ ...prev, description: e.target.value }))}
      />
      <div className={styles.sourceFieldsContainer}>
        <h4>Available Source Fields:</h4>
        <div className={styles.uploadFile}>
          <input type="file" onChange={handleFileUpload} ref={fileInput}/>
          <Button variant={ButtonVariants.PRIMARY} onClick={() => fileInput.current?.click()}>Import from file</Button>
          <span>{uploadedFile?.name}</span>
        </div>
        <div className={styles.sourceFieldsList}>
          {editableImporter.sourceFields.map((field, index) => (
            <div key={index} className={styles.sourceFieldItem}>
              <InlineEdit value={field} onSave={(newValue) => {
                // update source field
                updateImporter(prev => ({
                  ...prev,
                  sourceFields: prev.sourceFields.map((f, i) => i === index ? newValue : f),
                }));
              }} />
              <span
                className={styles.removeFieldButton}
                onClick={() => {
                  // remove source field
                  updateImporter(prev => ({
                    ...prev,
                    sourceFields: prev.sourceFields.filter((_, i) => i !== index),
                  }));
                }}
              >
                &times; 
              </span>
            </div>
          ))}
            <Button
              className={styles.addNewFieldButton}
              variant={ButtonVariants.GHOST}
              onClick={() => {
                // add new source field
                updateImporter(prev => ({
                  ...prev,
                  sourceFields: [...prev.sourceFields, 'New Field'],
                }));
              }}
            >
              + Add New
            </Button>
        </div>
      </div>
      {editableImporter.sourceFields.length > 0 && (
        <Tabs defaultIndex={0}>
          {...tabs}
        </Tabs>
      )}
      
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
