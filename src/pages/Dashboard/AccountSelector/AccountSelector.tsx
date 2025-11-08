import { useState, type FC } from 'react';

import type { Account } from 'types/account';

import Button, { ButtonVariants } from 'components/Button/Button';
import Card from 'components/Card/Card';
import Modal from 'components/Modal/Modal';

import CreateAccountForm from './CreateAccountForm/CreateAccountForm';

import styles from './AccountSelector.module.scss';

interface AccountSelectorProps {
  isLoading: boolean;
  error?: Error;
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
  const [isModalOpen, setIsModalOpen] = useState(false);

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
                <span className="edit-icon">
                  Edit
                </span>
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
        onClick={() => setIsModalOpen(true)}
      >
        + Add New
      </Button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <CreateAccountForm onSubmit={() => setIsModalOpen(false)} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </Card>
  );
};

export default AccountSelector;