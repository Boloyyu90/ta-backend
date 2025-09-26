import httpStatus from 'http-status';
import ApiError from './ApiError';

/**
 * Parse string ID dari route params menjadi number
 * Throw error jika format tidak valid
 *
 * @param {string} id - ID dari req.params (always string)
 * @param {string} fieldName - Nama field untuk error message
 * @returns {number} - Parsed ID
 *
 * @example
 * const userId = parseId(req.params.userId, 'user ID');
 * const examId = parseId(req.params.id, 'exam ID');
 */
export const parseId = (id: string, fieldName = 'ID'): number => {
  const parsed = parseInt(id, 10);

  if (isNaN(parsed) || parsed <= 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Invalid ${fieldName}`);
  }

  return parsed;
};

export default parseId;
