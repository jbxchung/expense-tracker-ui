import { useState, type FC } from 'react';

import type { Account } from 'types/account';
import { useAppContext } from 'contexts/app/AppContext';

import Button, { ButtonVariants } from 'components/Button/Button';
import Card from 'components/Card/Card';
import Input from 'components/Input/Input';

import LoginForm from './LoginForm';

import styles from './Auth.module.scss';
import SignupForm from './SignupForm';

// enum
export const AuthModes = {
  LOGIN: 'Login',
  SIGNUP: 'Sign Up',
} as const;
export type AuthMode = typeof AuthModes[keyof typeof AuthModes];

export interface AuthProps {
  mode: AuthMode;
}

const Auth: FC<AuthProps> = ({ mode }) => {
  return (
    <div className={styles.authPageWrapper}>
      <Card title={mode}>
        {mode === AuthModes.LOGIN
          ? <LoginForm />
          : <SignupForm />
        }
      </Card>
    </div>
  );
};

export default Auth;
