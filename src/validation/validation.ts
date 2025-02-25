export const validatePassword = (value: string): true | string => {
  if (value.length < 6) {
    return 'Password must be at least 6 characters';
  }
  if (!/(?=.*[A-Z])/.test(value)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/(?=.*[!@#$%^&*])/.test(value)) {
    return 'Password must contain at least one special character';
  }
  return true;
};
