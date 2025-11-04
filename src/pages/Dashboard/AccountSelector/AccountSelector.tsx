import { useState, type FC } from 'react';

import type {  Account, AccountType } from 'api/accounts';
import { AccountTypes } from 'api/accounts';

import { useCreateAccount } from 'hooks/useCreateAccount';

import Card from 'components/Card/Card';
import Modal from 'components/Modal/Modal';

import styles from './AccountSelector.module.scss';
import CreateAccountForm from './CreateAccountForm/CreateAccountForm';

interface AccountSelectorProps {
  accounts: Account[];
  selectedIds: string[],
  onToggle: (id: string) => void;
}

const AccountSelector: FC<AccountSelectorProps> = ({
  accounts,
  selectedIds,
  onToggle,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Card title="Accounts">
      {
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
      }
      <button className={`${styles.accountListItem} ${styles.addNewButton}`} onClick={() => setIsModalOpen(true)}>
        + Add New
      </button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <CreateAccountForm onSubmit={() => setIsModalOpen(false)} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </Card>
  );
};

export default AccountSelector;