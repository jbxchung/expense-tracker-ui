import { useState, type FC } from 'react';

import type { Account } from 'types/account';

import Button, { ButtonVariants } from 'components/Button/Button';
import Card from 'components/Card/Card';
import Modal from 'components/Modal/Modal';

import CreateAccountForm from './AccountForm/CreateAccountForm';

import styles from './AccountSelector.module.scss';
import EditAccountForm from './AccountForm/EditAccountForm';

interface AccountSelectorProps {
  isLoading: boolean;
  error: Error | null;
  accounts: Account[];
  selectedIds: string[],
  onToggle: (id: string) => void;
}

const AccountSelector: FC<AccountSelectorProps> = ({
  isLoading,
  error,
  accounts,
  selectedIds,
  onToggle,
}) => {
  const [isNewAccountModalOpen, setIsNewAccountModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  if (isLoading) {
    return (
      <Card title="Loading accounts...">
        loading spinner placeholder
      </Card>
    );
  }
  if (error) {
    return (
      <Card title="Error loading accounts">
        {error.message}
      </Card>
    );
  }

  return (
    <Card title="Accounts">
      {accounts.length ? (
        accounts.map(account => {
          const selected = selectedIds.includes(account.id);
          return (
            <div key={account.id} title={account.id} className={`${styles.accountListItem} ${selected ? styles.selected : ''}`} onClick={() => onToggle(account.id)}>
              <span className={styles.accountName}>
                {account.name}
                <span className={styles.accountType}>
                  {account.type}
                </span>
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
        })
      ) : (
        <div>
          No accounts found. Please add a new account.
        </div>
      )}
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

export default AccountSelector;