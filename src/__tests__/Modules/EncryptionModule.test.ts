import { encrypt, decrypt } from '@/modules/encryptionModule';
import '@testing-library/jest-dom';

describe('Encryption utility functions error handling', () => {
  it('should log error and return the original string when encryption (btoa) fails', () => {
    const originalBtoa = window.btoa;
    window.btoa = jest.fn(() => {
      throw new Error('Test encryption error');
    });

    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const input = 'mySecretPassword';
    const result = encrypt(input);

    expect(consoleSpy).toHaveBeenCalledWith(
      'Encryption failed',
      expect.any(Error)
    );
    expect(result).toBe(input);

    window.btoa = originalBtoa;
    consoleSpy.mockRestore();
  });

  it('should log error and return the original string when decryption (atob) fails', () => {
    const originalAtob = window.atob;
    window.atob = jest.fn(() => {
      throw new Error('Test decryption error');
    });

    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const input = 'mySecretPassword';
    const result = decrypt(input);

    expect(consoleSpy).toHaveBeenCalledWith(
      'Decryption failed',
      expect.any(Error)
    );
    expect(result).toBe(input);

    window.atob = originalAtob;
    consoleSpy.mockRestore();
  });
});
