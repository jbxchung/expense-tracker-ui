import { useRef, useState } from "react";

import { AccountTypes, type AccountType } from 'api/accounts';

import { useCreateAccount } from 'hooks/useCreateAccount';
import { Dropdown } from 'components/Dropdown/Dropdown';
import Input, { InputHandle } from 'components/Input/Input';

import styles from './CreateAccountForm.module.scss';

interface CreateAccountFormProps {
  onSubmit: () => void;
  onCancel: () => void;
}

const CreateAccountForm = ({ onSubmit, onCancel }: CreateAccountFormProps) => {
  const { create: createAccount, loading: creating, error: createError } = useCreateAccount();

  const [newAccountName, setNewAccountName] = useState("");
  const [newAccountType, setNewAccountType] = useState<AccountType>(AccountTypes.CHECKING);

  const nameInputRef = useRef<InputHandle | null>(null);

  const handleSubmit = async () => {
    const nameValid = nameInputRef.current?.validate() ?? false;
    if (!nameValid) {
      console.log('todo - name validation failed, display error');
      return;
    }

    try {
      await createAccount({ name: newAccountName.trim(), type: newAccountType });
      setNewAccountName("");
      setNewAccountType(AccountTypes.CHECKING);
      onSubmit();
    } catch(e) {
      console.error('Error during create operation', e);
    }
  };

  return (<>
    <h3 className={styles.newAccountFormTitle}>Create New Account</h3>
    <div className={styles.newAccountForm}>
      <Input
        ref={nameInputRef}
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
        <button type="submit" className={`${styles.btn} ${styles.saveBtn}`} onClick={handleSubmit} disabled={creating}>
          Save
        </button>
      </div>
    </div>
  </>);
};

export default CreateAccountForm;
