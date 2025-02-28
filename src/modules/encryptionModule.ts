export const encrypt = (str: string): string => {
  try {
    return btoa(str);
  } catch (e) {
    console.error('Encryption failed', e);
    return str;
  }
};

export const decrypt = (str: string): string => {
  try {
    return atob(str);
  } catch (e) {
    console.error('Decryption failed', e);
    return str;
  }
};
