import { validatePassword } from '@/validation/validation';

describe('validatePassword', () => {
  it('should return an error if the password is less than 6 characters', () => {
    const result = validatePassword('abc');
    expect(result).toBe('Password must be at least 6 characters');
  });

  it('should return an error if there is no uppercase letter', () => {
    const result = validatePassword('abcdef');
    expect(result).toBe('Password must contain at least one uppercase letter');
  });

  it('should return an error if there is no special character', () => {
    const result = validatePassword('Abcdef');
    expect(result).toBe('Password must contain at least one special character');
  });

  it('should return true if the password meets all requirements', () => {
    const validPassword = 'Abcdef!';
    const result = validatePassword(validPassword);
    expect(result).toBe(true);
  });
});
