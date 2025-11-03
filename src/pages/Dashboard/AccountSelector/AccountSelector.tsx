import { useState, type FC } from 'react';

import type {  Account, AccountType } from 'api/accounts';
import { AccountTypes } from 'api/accounts';

import { useCreateAccount } from 'hooks/useCreateAccount';

import Card from 'components/Card/Card';
import Modal from 'components/Modal/Modal';

import styles from './AccountSelector.module.scss';

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
  const { create, loading: creating, error: createError } = useCreateAccount();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAccountName, setNewAccountName] = useState("");
  const [newAccountType, setNewAccountType] = useState<AccountType>(AccountTypes.CHECKING);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await create({ name: newAccountName, type: newAccountType });
      setNewAccountName("");
      setNewAccountType(AccountTypes.CHECKING);
      setIsModalOpen(false);
    } catch(e) {
      console.error('Error during create operation', e);
    }
  };

  return (
    <Card title="Accounts">
      {
        accounts.map(account => {
          const selected = selectedIds.includes(account.id);
          return (
            <div key={account.id} title={account.id} className={`${styles.accountListItem} ${selected ? styles.selected : ''}`} onClick={() => onToggle(account.id)}>
              <span className={styles.accountName}>
                {account.name}
              </span>
              <div className={styles.accountActions}>
                <span className="edit-icon">
                  Edit
                </span>
                <span className="delete-icon">
                  Delete
                </span>
              </div>
            </div>
          );
        })
      }
      <button onClick={() => setIsModalOpen(true)}>
        Add Account
      </button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h3>Create New Account</h3>
        <form onSubmit={handleCreate}>
          <input
            value={newAccountName}
            onChange={e => setNewAccountName(e.target.value)}
            placeholder="Account Name"
            required
            style={{ display: "block", width: "100%", marginBottom: "0.5rem" }}
          />
          <select
            value={newAccountType}
            onChange={e => setNewAccountType(e.target.value as AccountType)}
            style={{ display: "block", width: "100%", marginBottom: "0.5rem" }}
          >
            <option value="CHECKING">Checking</option>
            <option value="SAVINGS">Savings</option>
            <option value="BUSINESS">Business</option>
          </select>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button type="submit" disabled={creating}>
              {creating ? "Creating..." : "Create"}
            </button>
            <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
          </div>

          {createError && <p style={{ color: "red" }}>{createError.message}</p>}
        </form>
      </Modal>
    </Card>
  );
};

export default AccountSelector;