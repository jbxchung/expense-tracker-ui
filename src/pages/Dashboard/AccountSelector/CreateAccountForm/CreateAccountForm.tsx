import { useRef, useState } from "react";

import { AccountTypes, type AccountType } from 'types/account';
import type { User } from 'types/user';

import { useCreateAccount } from 'hooks/useCreateAccount';
import { useUsers } from 'hooks/useUsers';

import Button, { ButtonVariants } from 'components/Button/Button';
import { Dropdown } from 'components/Dropdown/Dropdown';
import Input, { type InputHandle } from 'components/Input/Input';

import styles from './CreateAccountForm.module.scss';

interface CreateAccountFormProps {
  onSubmit: () => void;
  onCancel: () => void;
}

const CreateAccountForm = ({ onSubmit, onCancel }: CreateAccountFormProps) => {
  const { selectedUser } = useUsers();
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
      await createAccount({ userId: (selectedUser as User).id, name: newAccountName.trim(), type: newAccountType });
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
        <Button variant={ButtonVariants.SECONDARY} onClick={onCancel}>
          Cancel
        </Button>
        <Button variant={ButtonVariants.PRIMARY} onClick={handleSubmit} disabled={creating}>
          Save
        </Button>
      </div>
    </div>
  </>);
};

export default CreateAccountForm;
