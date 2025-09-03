import bcrypt from 'bcryptjs';
import crypto from 'crypto';

/**
 * Encrypt password
 * @param {string} password
 * @returns {Promise<string>}
 */
export const encryptPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(8);
  return bcrypt.hash(password, salt);
};

/**
 * Check password match
 * @param {string} password
 * @param {string} hashedPassword
 * @returns {Promise<boolean>}
 */
export const isPasswordMatch = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};


export const sha256 = (input: string): string => {
  return crypto.createHash('sha256').update(input).digest('hex');
};