import { useRef, useState, type FC } from 'react';

import { readFirstLines } from 'utils/fileUtils';

import Button, { ButtonVariants } from 'components/Button/Button';
import { Dropdown } from 'components/Dropdown/Dropdown';

import ImporterConfigurator from 'pages/Dashboard/ImporterConfigurator/ImporterConfigurator';

import styles from './TransactionForm.module.scss';

const TransactionForm: FC = () => {
  const fileInput = useRef<HTMLInputElement>(null);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewLines, setPreviewLines] = useState<string[]>([]);

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
          options={[
            { label: 'Example Importer 0', value: 'example_importer_0_id' },
            { label: 'Example Importer 1', value: 'example_importer_1_id' },
            { label: 'Create New', value: 'CREATE_NEW'},
          ]}
        />
      </div>
      {selectedImporterId &&
        <ImporterConfigurator importerId={selectedImporterId} isEditable={selectedImporterId === 'CREATE_NEW'} />
      }
    </div>
  );
};

export default TransactionForm;