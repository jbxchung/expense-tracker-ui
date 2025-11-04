import { useState } from "react";

import { AccountTypes, type AccountType } from 'api/accounts';

import { useCreateAccount } from 'hooks/useCreateAccount';
import { Dropdown } from 'components/Dropdown/Dropdown';
import Input from 'components/Input/Input';

import styles from './CreateAccountForm.module.scss';

interface CreateAccountFormProps {
  onSubmit: () => void;
  onCancel: () => void;
}

const CreateAccountForm = ({ onSubmit, onCancel }: CreateAccountFormProps) => {
  const { create: createAccount, loading: creating, error: createError } = useCreateAccount();

  const [newAccountName, setNewAccountName] = useState("");
  const [newAccountType, setNewAccountType] = useState<AccountType>(AccountTypes.CHECKING);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAccount({ name: newAccountName, type: newAccountType });
      setNewAccountName("");
      setNewAccountType(AccountTypes.CHECKING);
      onSubmit();
    } catch(e) {
      console.error('Error during create operation', e);
    }
  };

  return (<>
    <h3 className={styles.newAccountFormTitle}>Create New Account</h3>
    <form className={styles.newAccountForm} onSubmit={handleSubmit}>
      <Input
        label="Account Name"
        placeholder="Enter account name"
        value={newAccountName}
        onChange={e => setNewAccountName(e.target.value)}
        validate={(value) => value ? null : "Account name is required"}
        required
      />

      <Dropdown
        label="Account Type"
        options={[
          { label: AccountTypes.CHECKING, value: AccountTypes.CHECKING },
          { label: AccountTypes.SAVINGS, value: AccountTypes.SAVINGS },
          { label: AccountTypes.CREDIT_CARD, value: AccountTypes.CREDIT_CARD },
        ]}
        value={newAccountType}
        onChange={value => setNewAccountType(value)}
      />

      <div className={styles.formButtons}>
        <button type="button" className={`${styles.btn} ${styles.cancelBtn}`} onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className={`${styles.btn} ${styles.saveBtn}`}>
          Save
        </button>
      </div>
    </form>
  </>);
};

export default CreateAccountForm;
