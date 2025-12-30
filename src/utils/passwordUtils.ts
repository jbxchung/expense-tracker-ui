export interface PasswordValidationResult {
  length: boolean;
  number: boolean;
  uppercase: boolean;
  lowercase: boolean;
  isValid: boolean;
}

export function validatePassword(password: string): PasswordValidationResult {
  const length = password.length >= 8;
  const number = /\d/.test(password);
  const uppercase = /[A-Z]/.test(password);
  const lowercase = /[a-z]/.test(password);

  return {
    length,
    number,
    uppercase,
    lowercase,
    isValid: length && number && uppercase && lowercase,
  };
}

export function getPasswordErrors(
  validation: PasswordValidationResult
): string[] {
  const errors: string[] = [];

  if (!validation.length) {
    errors.push('At least 8 characters');
  }
  if (!validation.number) {
    errors.push('At least one number');
  }
  if (!validation.uppercase) {
    errors.push('At least one uppercase letter');
  }
  if (!validation.lowercase) {
    errors.push('At least one lowercase letter');
  }

  return errors;
}
