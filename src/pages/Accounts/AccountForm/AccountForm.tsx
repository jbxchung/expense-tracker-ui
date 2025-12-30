import { useRef, useState } from "react";

import { AccountTypes, type AccountType } from 'types/account';

import Button, { ButtonVariants } from 'components/Button/Button';
import Dropdown from 'components/Dropdown/Dropdown';
import Input, { type InputHandle } from 'components/Input/Input';

import styles from './AccountForm.module.scss';

interface AccountFormProps {
  initialName: string;
  initialType: AccountType;
  onSubmit: (data: { name: string; type: AccountType }) => Promise<void>;
  onCancel: () => void;
  onDelete?: () => void;
  submitting?: boolean;
  errorMessage?: string;
}

const AccountForm = ({
  initialName,
  initialType,
  onSubmit,
  onCancel,
  onDelete,
  submitting = false,
  errorMessage,
}: AccountFormProps) => {
  const [name, setName] = useState(initialName);
  const [type, setType] = useState<AccountType>(initialType);
  const nameInputRef = useRef<InputHandle | null>(null);

  const handleSubmit = async () => {
    const nameValid = nameInputRef.current?.validate?.() ?? false;
    if (!nameValid) return;

    await onSubmit({ name: name.trim(), type });
  };

  return (
    <>
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
          onChange={value => setType(value as AccountType)}
          options={[
            { label: AccountTypes.CHECKING, value: AccountTypes.CHECKING },
            { label: AccountTypes.SAVINGS, value: AccountTypes.SAVINGS },
            { label: AccountTypes.CREDIT_CARD, value: AccountTypes.CREDIT_CARD },
          ]}
        />

        <div className={styles.formButtonsContainer}>
          <div className={styles.formButtonsLeft}>
          {onDelete && (
            <Button variant={ButtonVariants.DANGER} onClick={onDelete} disabled={submitting}>
              Delete
            </Button>
          )}
          </div>
          <div className={styles.formButtonsRight}>
            <Button variant={ButtonVariants.SECONDARY} onClick={onCancel} disabled={submitting}>
              Cancel
            </Button>
            <Button variant={ButtonVariants.PRIMARY} onClick={handleSubmit} disabled={submitting}>
              Save
            </Button>
          </div>
        </div>

        {errorMessage && <div className={styles.formError}>{errorMessage}</div>}
      </div>
    </>
  );
};

export default AccountForm;
