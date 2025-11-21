import { useCallback, useMemo, useRef, useState, type FC } from 'react';

import styles from './TransactionForm.module.scss';
import Button, { ButtonVariants } from 'components/Button/Button';


const TransactionForm: FC = () => {
  const fileInput = useRef<HTMLInputElement>(null);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileUpload = (e: any) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      setUploadedFile(null);
      return;
    }

    const file = files[0];
    setUploadedFile(file);
    console.log("Selected file:", file);
  }

  return (
    <div>
      <div className={styles.uploadFile}>
        <input type="file" onChange={handleFileUpload} ref={fileInput}/>
        <Button variant={ButtonVariants.PRIMARY} onClick={() => fileInput.current?.click()}>Upload File</Button>
        <span>{uploadedFile?.name}</span>
      </div>
    </div>
  );
};

export default TransactionForm;