import { useEffect, useRef, useState, type FC } from 'react';
import { Link } from 'react-router-dom';

import { useAppContext } from 'contexts/app/AppContext';

import Button, { ButtonVariants } from 'components/Button/Button';
import Input, { type InputHandle } from 'components/Input/Input';

import styles from './Auth.module.scss';
import { getPasswordErrors, validateEmail, validatePassword } from 'utils/loginUtils';

const SignupForm: FC = () => {
  const { signup } = useAppContext();
  
  const confirmInputRef = useRef<InputHandle | null>(null);

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [nameValid, setNameValid] = useState<boolean>(false);
  const [emailValid, setEmailValid] = useState<boolean>(false);
  const [passwordValid, setPasswordValid] = useState<boolean>(false);
  const [confirmValid, setConfirmValid] = useState<boolean>(false);

  const isFormValid = nameValid && emailValid && passwordValid && confirmValid;

  // on password change, need to make sure we revalidate the confirm password field too
  useEffect(() => {
    confirmInputRef.current?.validate?.();
  }, [password]);
  
  return (
    <div className={styles.authForm}>
      <Input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        validate={(n) => (n.trim() ? null : 'Name is required')}
        onValidityChange={setNameValid}
      />
      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        validate={validateEmail}
        onValidityChange={setEmailValid}
      />
      <Input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        validate={(p) => {
          const passwordValidation = validatePassword(p);
          return getPasswordErrors(passwordValidation);
        }}
        onValidityChange={setPasswordValid}
      />
      <Input
        ref={confirmInputRef}
        placeholder="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        validate={(c) => (c === password ? null : 'Passwords must match')}
        onValidityChange={setConfirmValid}
      />
      <Button
        variant={ButtonVariants.PRIMARY}
        onClick={() => signup({ name, email, password })}
        disabled={!isFormValid}
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
