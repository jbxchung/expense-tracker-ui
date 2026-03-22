import { useState, type FC } from 'react';

import type { Transaction } from 'types/transaction';

import Button, { ButtonVariants } from 'components/Button/Button';
import Card from 'components/Card/Card';
import Modal from 'components/Modal/Modal';
import { UploadIcon } from 'icons/UploadIcon';

import TransactionForm from './TransactionForm/TransactionForm';
import { LiveTransactionTable } from './TransactionTable/LiveTransactionTable';

import styles from './Transactions.module.scss';
import Spinner from 'components/Spinner/Spinner';

interface TransactionsProps {
  accountsLoading: boolean;
  isLoading: boolean;
  error: Error | null;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

const Transactions: FC<TransactionsProps> = ({
  accountsLoading,
  isLoading,
  error,
  transactions,
  setTransactions,
}) => {
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [manageBatch, setManageBatch] = useState(false);

  let loadingStatus = null;
  if (accountsLoading || isLoading) {
    loadingStatus = <Spinner />;
  }
  if (error) loadingStatus = `Error loading transactions: ${error.message}`;

  return (
    <Card title="Transactions">
      <div className={styles.transactionHeaderRow}>
        <Button
          variant={ButtonVariants.GHOST}
          title="Batch manage transactions"
          onClick={() => setManageBatch(!manageBatch)}
        >
          Manage
        </Button>
        <Button
          className={styles.importButton}
          title="Import Transactions"
          variant={ButtonVariants.GHOST}
          onClick={() => setImportModalOpen(true)}
        >
          <UploadIcon />
        </Button>
      </div>
      {loadingStatus ? (
        <div>{loadingStatus}</div>
      ) : (
        // TODO - pass manageBatch through to show selection checkboxes and delete buttons in the table
        <LiveTransactionTable data={transactions} setData={setTransactions} />
      )}
      <Modal
        title="Import Transactions"
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        closeOnOutsideClick={false}
        confirmOnClose
      >
        <TransactionForm onSuccess={() => setImportModalOpen(false)} />
      </Modal>
    </Card>
  );
};

export default Transactions;
