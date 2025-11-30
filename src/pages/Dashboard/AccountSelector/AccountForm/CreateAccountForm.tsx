import type { FC } from 'react';

import { AccountTypes, type AccountType } from 'types/account';

import { useCreateAccount } from 'hooks/accounts/useCreateAccount';

import AccountForm from './AccountForm';
import { useAppContext } from 'contexts/app/AppContext';

interface CreateAccountFormProps {
  onSubmit: () => void;
  onCancel: () => void;
}

const CreateAccountForm: FC<CreateAccountFormProps> = ({ onSubmit, onCancel }: CreateAccountFormProps) => {
  const { selectedUser } = useAppContext();
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
