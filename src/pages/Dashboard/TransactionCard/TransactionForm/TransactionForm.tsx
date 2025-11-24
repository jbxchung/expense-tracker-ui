import { useRef, useState, type FC } from 'react';

import { useImporters } from 'hooks/useImporters';
import { getHeadersFromCSV, readFirstLines } from 'utils/fileUtils';

import Button, { ButtonVariants } from 'components/Button/Button';
import { Dropdown } from 'components/Dropdown/Dropdown';

import ImporterConfigurator from 'pages/Dashboard/ImporterConfigurator/ImporterConfigurator';

import styles from './TransactionForm.module.scss';
import Accordion from 'components/Accordion/Accordion';

const TransactionForm: FC = () => {
  const fileInput = useRef<HTMLInputElement>(null);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewLines, setPreviewLines] = useState<string[]>([]);
  const [availableFields, setAvailableFields] = useState<string[]>([]);

  const { importers, isLoading, error } = useImporters();
  const [selectedImporterId, setSelectedImporterId] = useState<string>('');

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
      <div>
        <Dropdown
          label="Importer"
          value={selectedImporterId}
          onChange={setSelectedImporterId}
          buttonStyleVariant={ButtonVariants.GHOST}
          options={[
            ...importers.map((importer) => ({
              label: importer.name,
              value: importer.id,
            })),
            { label: 'Create New', value: 'CREATE_NEW'},
          ]}
        />
      </div>
      {!!selectedImporterId &&
      <Accordion title={`Importer Configuration: ${selectedImporterId}`} defaultOpen={true}>
        <ImporterConfigurator importer={importers.find(i => i.id === selectedImporterId)} availableFields={availableFields} isEditable={selectedImporterId === 'CREATE_NEW'} />
      </Accordion>
      }
    </div>
  );
};

export default TransactionForm;