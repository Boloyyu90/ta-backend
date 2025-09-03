/**
 * Create an object composed of the picked object properties
 * @param {Record<string, any>} obj
 * @param {string[]} keys
 * @returns {Object}
 */
const pick = (obj: Record<string, any>, keys: string[]): Record<string, any> => {
  return keys.reduce((finalObj: Record<string, any>, key) => {
    if (obj && Object.prototype.hasOwnProperty.call(obj, key)) {
      finalObj[key] = obj[key];
    }
    return finalObj;
  }, {});
};

export default pick;
