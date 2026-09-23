import CryptoJS from 'crypto-js';

export const PasswordUtils = {
  hashPassword: (password: string): string => {
    return CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
  },
};
