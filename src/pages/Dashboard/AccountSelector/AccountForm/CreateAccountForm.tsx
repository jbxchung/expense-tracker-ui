import type { FC } from 'react';

import { AccountTypes, type AccountType } from 'types/account';

import { useCreateAccount } from 'hooks/useCreateAccount';
import { useUsers } from 'hooks/useUsers';

import AccountForm from './AccountForm';

interface CreateAccountFormProps {
  onSubmit: () => void;
  onCancel: () => void;
}

const CreateAccountForm: FC<CreateAccountFormProps> = ({ onSubmit, onCancel }: CreateAccountFormProps) => {
  const { selectedUser } = useUsers();
  const { create: createAccount, loading, error: createError } = useCreateAccount();

  const handleCreate = async (data: { name: string; type: AccountType }) => {
    await createAccount({
      userId: selectedUser!.id,
      name: data.name,
      type: data.type,
    });
    onSubmit();
  };

  return (
    <AccountForm
      title="Create New Account"
      initialName=""
      initialType={AccountTypes.CHECKING}
      onSubmit={handleCreate}
      onCancel={onCancel}
      submitting={loading}
      errorMessage={createError?.message}
    />
  );
};

export default CreateAccountForm;
