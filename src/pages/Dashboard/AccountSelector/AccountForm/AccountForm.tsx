import { useRef, useState } from "react";

import { AccountTypes, type AccountType } from 'types/account';
import type { User } from 'types/user';

import { useCreateAccount } from 'hooks/useCreateAccount';
import { useUsers } from 'hooks/useUsers';

import Button, { ButtonVariants } from 'components/Button/Button';
import { Dropdown } from 'components/Dropdown/Dropdown';
import Input, { type InputHandle } from 'components/Input/Input';

import styles from './AccountForm.module.scss';

interface AccountFormProps {
  title: string;
  initialName: string;
  initialType: AccountType;
  onSubmit: (data: { name: string; type: AccountType }) => Promise<void>;
  onCancel: () => void;
  onDelete?: () => void;
  submitting?: boolean;
}

const AccountForm = ({
  title,
  initialName,
  initialType,
  onSubmit,
  onCancel,
  onDelete,
  submitting = false,
}: AccountFormProps) => {
  const [name, setName] = useState(initialName);
  const [type, setType] = useState<AccountType>(initialType);
  const nameInputRef = useRef<InputHandle | null>(null);

  const handleSubmit = async () => {
    const nameValid = nameInputRef.current?.validate() ?? false;
    if (!nameValid) return;

    await onSubmit({ name: name.trim(), type });
  };

  return (
    <>
      <h3 className={styles.accountFormTitle}>{title}</h3>
      <div className={styles.accountForm}>
        <Input
          ref={nameInputRef}
          label="Account Name"
          placeholder="Enter account name"
          value={name}
          onChange={e => setName(e.target.value)}
          validate={value => (value ? null : "Account name is required")}
          required
        />

        <Dropdown
          label="Account Type"
          value={type}
          onChange={value => setType(value)}
          options={[
            { label: AccountTypes.CHECKING, value: AccountTypes.CHECKING },
            { label: AccountTypes.SAVINGS, value: AccountTypes.SAVINGS },
            { label: AccountTypes.CREDIT_CARD, value: AccountTypes.CREDIT_CARD },
          ]}
        />

        <div className={styles.formButtons}>
          <Button variant={ButtonVariants.SECONDARY} onClick={onCancel}>
            Cancel
          </Button>
          {onDelete && (
            <Button
              variant={ButtonVariants.DANGER}
              onClick={onDelete}
            >
              Delete
          </Button>
          )}
          <Button variant={ButtonVariants.PRIMARY} onClick={handleSubmit} disabled={submitting}>
            Save
          </Button>
        </div>
      </div>
    </>
  );
};

export default AccountForm;
