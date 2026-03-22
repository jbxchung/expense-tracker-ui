import { useState, type FC } from 'react';

import { type Account, AccountTypes } from 'types/account';
import { useAppContext } from 'contexts/app/AppContext';

import Button, { ButtonVariants } from 'components/Button/Button';
import Card from 'components/Card/Card';
import Modal from 'components/Modal/Modal';

import CreateAccountForm from './AccountForm/CreateAccountForm';
import EditAccountForm from './AccountForm/EditAccountForm';

import styles from './Accounts.module.scss';

const Accounts: FC = () => {
  const { accounts, accountsLoading, accountsError } = useAppContext();
  const [isNewAccountModalOpen, setIsNewAccountModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  if (accountsLoading) {
    return (
      <Card title="Loading accounts...">
        loading spinner placeholder
      </Card>
    );
  }
  if (accountsError) {
    return (
      <Card title="Error loading accounts">
        {accountsError.message}
      </Card>
    );
  }
  if (accounts.length === 0) {
    return (
      <div>
        No accounts found. Please add a new account.
      </div>
    );
  }

  // group accounts by type and display in alphabetical order
  const checkingAccounts = accounts.filter(a => a.type === AccountTypes.CHECKING).sort((a, b) => a.name.localeCompare(b.name));
  const creditCardAccounts = accounts.filter(a => a.type === AccountTypes.CREDIT_CARD).sort((a, b) => a.name.localeCompare(b.name));
  const savingsAccounts = accounts.filter(a => a.type === AccountTypes.SAVINGS).sort((a, b) => a.name.localeCompare(b.name));

  const renderAccount = (account: Account) => (
    <div key={account.id} title={account.id} className={styles.accountListItem}>
      <span className={styles.accountName}>
        {account.name}
        {account.imports?.length > 0 && (
          <span className={styles.lastUpdated}>
            Last updated with {account.imports[0].transactionCount} transactions from '{account.imports[0].fileName || 'Unknown File'}' on {new Date(account.imports[0].createdAt).toLocaleDateString()}
          </span>
        )}
      </span>
      <div className={styles.accountActions}>
        <Button variant={ButtonVariants.GHOST} onClick={(e) => {
          e.stopPropagation();
          setEditingAccount(account);
        }}>
          Edit
        </Button>
      </div>
    </div>
  );

  return (
    <Card title="Accounts">
      {checkingAccounts.length ? (
        <>
          <h3>Checking</h3>
          {checkingAccounts.map(renderAccount)}
        </>
      ) : null}
      {creditCardAccounts.length ? (
        <>
          <h3>Credit Cards</h3>
          {creditCardAccounts.map(renderAccount)}
        </>
      ) : null}
      {savingsAccounts.length ? (
        <>
          <h3>Savings</h3>
          {savingsAccounts.map(renderAccount)}
        </>
      ) : null}
      <hr />
      <Button
        variant={ButtonVariants.PRIMARY}
        className={styles.accountListItem}
        onClick={() => setIsNewAccountModalOpen(true)}
      >
        + Add New
      </Button>
      <Modal
        title="Create New Account"
        isOpen={isNewAccountModalOpen}
        onClose={() => setIsNewAccountModalOpen(false)}
      >
        <CreateAccountForm onSubmit={() => setIsNewAccountModalOpen(false)} onCancel={() => setIsNewAccountModalOpen(false)} />
      </Modal>
      <Modal
        title="Edit Account"
        isOpen={!!editingAccount}
        onClose={() => setEditingAccount(null)}
      >
        {editingAccount && (
          <EditAccountForm
            account={editingAccount}
            onSubmit={() => setEditingAccount(null)}
            onCancel={() => setEditingAccount(null)}
          />
        )}
      </Modal>
    </Card>
  );
};

export default Accounts;
