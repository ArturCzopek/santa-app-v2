import CryptoJS from 'crypto-js';

export const PasswordUtils = {
  hashPassword: (password: string): string => {
    return CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
  },

  comparePasswords: (
    inputPassword: string,
    storedHashedPassword: string,
  ): boolean => {
    const hashedInput = PasswordUtils.hashPassword(inputPassword);
    return hashedInput === storedHashedPassword;
  },
};
