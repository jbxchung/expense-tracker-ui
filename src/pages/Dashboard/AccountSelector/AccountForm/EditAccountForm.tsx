import type { FC } from 'react';

import type { AccountType } from 'types/account';

import { useUpdateAccount } from 'hooks/useUpdateAccount';

import AccountForm from './AccountForm';
import { useDeleteAccount } from 'hooks/useDeleteAccount';

interface EditAccountFormProps {
  account: { id: string; name: string; type: AccountType };
  onSubmit: () => void;
  onCancel: () => void;
}

const EditAccountForm: FC<EditAccountFormProps> = ({ account, onSubmit, onCancel }: EditAccountFormProps) => {
  const { update: updateAccount, loading: updatingAccount, error: updateError } = useUpdateAccount();
  const { remove: deleteAccount, loading: deletingAccount, error: deleteError } = useDeleteAccount();

  const handleUpdate = async (data: { name: string; type: AccountType }) => {
    await updateAccount({
      id: account.id,
      name: data.name,
      type: data.type,
    });
    onSubmit();
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete account "${account.name}"? This cannot be undone.`
    );
    if (!confirmed) return;

    await deleteAccount(account.id);
    onSubmit();
  }

  return (
    <AccountForm
      initialName={account.name}
      initialType={account.type}
      submitting={updatingAccount || deletingAccount}
      onSubmit={handleUpdate}
      onCancel={onCancel}
      onDelete={handleDelete}
      errorMessage={updateError?.message || deleteError?.message}
    />
  );
};

export default EditAccountForm;
