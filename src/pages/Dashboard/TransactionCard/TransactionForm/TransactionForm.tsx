import { useEffect, useRef, useState, type FC } from 'react';

import { DEFAULT_IMPORTER } from 'types/importer';
import type { StagedTransaction } from 'types/transaction';

import { useImporters } from 'hooks/importers/useImporters';
import { useExecuteImporter } from 'hooks/importers/useExecuteImporter';
import { getHeadersFromCSV, readFirstLines } from 'utils/fileUtils';

import Button, { ButtonVariants } from 'components/Button/Button';
import { Dropdown } from 'components/Dropdown/Dropdown';

import ImporterConfigurator from 'pages/Dashboard/ImporterConfigurator/ImporterConfigurator';
import { StagedTransactionTable } from 'pages/Dashboard/TransactionCard/StagedTransactionTable/StagedTransactionTable';

import styles from './TransactionForm.module.scss';

const TransactionForm: FC = () => {
  const fileInput = useRef<HTMLInputElement>(null);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewLines, setPreviewLines] = useState<string[]>([]);
  const [availableFields, setAvailableFields] = useState<string[]>([]);

  const { importers, isLoading, error } = useImporters();
  const { execute: executeImporter, result: importerExecutionResult, loading: importerExecutionLoading, error: importerExecutionError } = useExecuteImporter();
  const [selectedImporterId, setSelectedImporterId] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [stagedTransactions, setStagedTransactions] = useState<StagedTransaction[]>(importerExecutionResult ?? []);

  // reset staged transactions on importer execution
  useEffect(() => {
    if (importerExecutionResult) {
      setStagedTransactions(importerExecutionResult);
    }
  }, [importerExecutionResult]);

  const handleFileUpload = async (e: any) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      setUploadedFile(null);
      return;
    }

    const file = files[0];
    setUploadedFile(file);

    const preview = await readFirstLines(file, 4);
    setPreviewLines(preview);

    const availableFields = await getHeadersFromCSV(file, ',');
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
        {importerExecutionResult && 'Re-'}Import
      </Button>
      {importerExecutionLoading && <div>Executing Importer...</div>}
      {importerExecutionError && <div>Error executing importer: {importerExecutionError.message}</div>}
      {importerExecutionResult && (<>
        <div className={styles.importedTransactionsPreview}>
          <StagedTransactionTable data={stagedTransactions} setData={setStagedTransactions}></StagedTransactionTable>
        </div>
        <Button
          variant={ButtonVariants.PRIMARY}
          disabled={!importerExecutionResult}
          onClick={() => {
            alert('todo: save transactions');
            console.log('todo: save transactions', stagedTransactions);
          }}
        >
          Finalize & Save
        </Button>
      </>)}
    </div>
  );
};

export default TransactionForm;