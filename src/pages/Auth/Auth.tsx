import type { FC } from 'react';

import Card from 'components/Card/Card';

import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

import styles from './Auth.module.scss';

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
