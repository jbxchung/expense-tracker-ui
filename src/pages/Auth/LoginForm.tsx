import { useState, type FC } from 'react';
import { Link } from 'react-router-dom';

import { useAppContext } from 'contexts/app/AppContext';

import Button, { ButtonVariants } from 'components/Button/Button';
import Input from 'components/Input/Input';

import styles from './Auth.module.scss';

const LoginForm: FC = () => {
  const { login } = useAppContext();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  
  return (
    <div className={styles.authForm}>
      <Input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <Input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
      <Button
        variant={ButtonVariants.PRIMARY}
        onClick={() => login({ email, password })}
      >
      Login
      </Button>
      <Link className={styles.authToggleLink} to="/signup">
        <Button variant={ButtonVariants.ICON} title="Sign Up">
          Sign Up
        </Button>
      </Link>
    </div>
  );
};

export default LoginForm;
