import { useState, type FC } from 'react';
import { Link } from 'react-router-dom';

import { useAppContext } from 'contexts/app/AppContext';

import Button, { ButtonVariants } from 'components/Button/Button';
import Input from 'components/Input/Input';

import styles from './Auth.module.scss';
import { getPasswordErrors, validatePassword } from 'utils/passwordUtils';

const SignupForm: FC = () => {
  const { signup } = useAppContext();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  // to help determine whether validation messages should be shown
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const markTouched = (field: keyof typeof touched) => setTouched(t => ({ ...t, [field]: true }));

  // simple field validation
  const validateName = (name: string) => name.trim().length ? null : 'Name is required';
  const validateEmail = (email: string) => email.trim().length ? null : 'Email is required';
  const validateConfirmPassword = (password: string, confirm: string) => password === confirm ? null : 'Passwords must match';

  // set error messages
  const nameError = validateName(name);
  const emailError = validateEmail(email);
  const passwordValidation = validatePassword(password);
  const passwordError = getPasswordErrors(passwordValidation).join('\n');

  const confirmPasswordError =
    confirmPassword.length
      ? validateConfirmPassword(password, confirmPassword)
      : null;
  // only show show error messages if field is touched
  const showNameError = touched.name ? nameError : null;
  const showEmailError = touched.email ? emailError : null;
  const showPasswordError = touched.password ? passwordError : null;
  const showConfirmError = touched.confirmPassword ? confirmPasswordError : null;
  
  // flag to determine if form is valid
  const isFormValid =
    !nameError &&
    !emailError &&
    !passwordError &&
    !confirmPasswordError;

  return (
    <div className={styles.authForm}>
      <Input
        label="Name"
        placeholder="John Doe"
        onChange={(e) => setName(e.target.value)}
        onBlur={() => markTouched('name')}
        validate={() => showNameError}
      />
      <Input
        label="Email"
        placeholder="test@example.com"
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => markTouched('email')}
        validate={() => showEmailError}
      />
      <Input
        label="Password"
        placeholder="********"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        onBlur={() => markTouched('password')}
        validate={() => showPasswordError}
      />
      <Input
        label="Confirm Password"
        placeholder="Confirm Password"
        type="password"
        onChange={(e) => setConfirmPassword(e.target.value)}
        onBlur={() => markTouched('confirmPassword')}
        validate={() => showConfirmError}
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
