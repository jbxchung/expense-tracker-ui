import { useState, type FC } from 'react';
import { Link } from 'react-router-dom';

import { useAppContext } from 'contexts/app/AppContext';

import Button, { ButtonVariants } from 'components/Button/Button';
import Input from 'components/Input/Input';

import styles from './Auth.module.scss';

const SignupForm: FC = () => {
  const { signup } = useAppContext();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [formError, setFormError] = useState<string | null>(null);
  
  return (
    <div className={styles.authForm}>
      <Input placeholder="Name" onChange={(e) => setName(e.target.value)} />
      <Input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <Input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} validate={(newPassword) => {
        // todo - client-side validation for valid/invalid user feedback
        

        // only compare with password confirmation after it has already been set
        if (confirmPassword && confirmPassword !== newPassword) {
          return 'Passwords must match';
        }

        return null;
      }} />
      <Input placeholder="Confirm Password" type="password" onChange={(e) => setConfirmPassword(e.target.value)} validate={(passwordConfirmation) => {
        if (passwordConfirmation !== password) {
          return 'Passwords must match';
        }
        return null;
      }} />
      <Button
        variant={ButtonVariants.PRIMARY}
        onClick={() => signup({ name, email, password })}
        disabled={!!formError}
      >
       Sign Up
      </Button>
      <Link className={styles.authToggleLink} to="/login">
        <Button variant={ButtonVariants.ICON} title="login">
          Back to Login
        </Button>
      </Link>
    </div>
  );
};

export default SignupForm;
