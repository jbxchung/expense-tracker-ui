import { useRef, useState, type FC } from 'react';

import { useImporters } from 'hooks/importers/useImporters';
import { useExecuteImporter } from 'hooks/importers/useExecuteImporter';
import { getHeadersFromCSV, readFirstLines } from 'utils/fileUtils';

import Button, { ButtonVariants } from 'components/Button/Button';
import { Dropdown, type DropdownOption } from 'components/Dropdown/Dropdown';

import ImporterConfigurator from 'pages/Dashboard/ImporterConfigurator/ImporterConfigurator';

import styles from './TransactionForm.module.scss';
import Accordion from 'components/Accordion/Accordion';
import Modal from 'components/Modal/Modal';
import { DEFAULT_IMPORTER } from 'types/importer';

const TransactionForm: FC = () => {
  const fileInput = useRef<HTMLInputElement>(null);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewLines, setPreviewLines] = useState<string[]>([]);
  const [availableFields, setAvailableFields] = useState<string[]>([]);

  const { importers, isLoading, error } = useImporters();
  const { execute: executeImporter, result: importerExecutionResult, loading: importerExecutionLoading, error: importerExecutionError } = useExecuteImporter();
  const [selectedImporterId, setSelectedImporterId] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleFileUpload = async (e: any) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      setUploadedFile(null);
      return;
    }

    const file = files[0];
    setUploadedFile(file);
    console.log("Selected file:", file);

    const preview = await readFirstLines(file, 4);
    setPreviewLines(preview);

    const availableFields = await getHeadersFromCSV(file, ',');
    console.log('available fields:', availableFields);
    setAvailableFields(availableFields);
  }

  const importerSelectionChanged = (importerId: string) => {
    setSelectedImporterId(importerId);
    if (importerId === DEFAULT_IMPORTER.id) {
      setIsEditing(true);
    }
  };

  return (
    <div className={styles.transactionForm}>
      <div className={styles.uploadFile}>
        <input type="file" onChange={handleFileUpload} ref={fileInput}/>
        <Button variant={ButtonVariants.PRIMARY} onClick={() => fileInput.current?.click()}>Upload File</Button>
        <span>{uploadedFile?.name}</span>
      </div>
      {!!previewLines.length && (
        <div className={styles.filePreview}>
          <h4>File Preview:</h4>
          <pre>
            {previewLines.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
            <div>...</div>
          </pre>
        </div>
      )}
      <div className={styles.importerSelector}>
        <Dropdown
          label="Importer"
          value={selectedImporterId}
          onChange={importerSelectionChanged}
          buttonStyleVariant={ButtonVariants.GHOST}
          options={[
            ...importers.map((importer) => ({
              label: importer.name,
              value: importer.id,
            })),
            { label: 'Create New', value: DEFAULT_IMPORTER.id},
          ]}
        />
        <Button
          className={styles.editImporterButton}
          variant={ButtonVariants.SECONDARY}
          disabled={!selectedImporterId}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Hide' : 'Show' } Editor
        </Button>
      </div>
      {isEditing && 
      <div className={styles.importerEditor}>
        <ImporterConfigurator importer={importers.find(i => i.id === selectedImporterId)} availableFields={availableFields} />
      </div>
      }
      <Button
        variant={ButtonVariants.PRIMARY}
        disabled={!selectedImporterId || !uploadedFile}
        onClick={() => executeImporter(selectedImporterId, uploadedFile!)}
      >
        Run Importer
      </Button>
    </div>
  );
};

export default TransactionForm;