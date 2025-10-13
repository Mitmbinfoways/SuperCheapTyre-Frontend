/**
 * Simple encryption/decryption utility for localStorage data
 * This helps prevent direct manipulation of cart data in localStorage
 */

// Simple encryption key (in a real application, this should be more secure)
const ENCRYPTION_KEY = 'supercheap_tyre_cart_encryption_key_2025';

/**
 * Simple XOR encryption function
 * @param {string} text - Text to encrypt
 * @returns {string} - Encrypted text
 */
const encrypt = (text) => {
  if (!text) return '';
  
  try {
    const textToChars = (text) => text.split('').map(c => c.charCodeAt(0));
    const byteHex = (n) => ('0' + Number(n).toString(16)).substr(-2);
    const applyKeyToChar = (code) => textToChars(ENCRYPTION_KEY).reduce((a, b) => a ^ b, code);
    
    return text.split('')
      .map(textToChars)
      .map(applyKeyToChar)
      .map(byteHex)
      .join('');
  } catch (error) {
    console.error('Encryption error:', error);
    return text; // Return original text if encryption fails
  }
};

/**
 * Simple XOR decryption function
 * @param {string} encoded - Encoded text to decrypt
 * @returns {string} - Decrypted text
 */
const decrypt = (encoded) => {
  if (!encoded) return '';
  
  try {
    const textToChars = (text) => text.split('').map(c => c.charCodeAt(0));
    const applyKeyToChar = (code) => textToChars(ENCRYPTION_KEY).reduce((a, b) => a ^ b, code);
    
    return encoded.match(/.{1,2}/g)
      .map(hex => parseInt(hex, 16))
      .map(applyKeyToChar)
      .map(charCode => String.fromCharCode(charCode))
      .join('');
  } catch (error) {
    console.error('Decryption error:', error);
    return ''; // Return empty string if decryption fails
  }
};

/**
 * Securely store data in localStorage with encryption
 * @param {string} key - localStorage key
 * @param {any} data - Data to store (will be JSON stringified)
 */
export const secureSetItem = (key, data) => {
  try {
    const jsonData = JSON.stringify(data);
    const encryptedData = encrypt(jsonData);
    localStorage.setItem(key, encryptedData);
  } catch (error) {
    console.error(`Error storing data for key ${key}:`, error);
  }
};

/**
 * Securely retrieve data from localStorage with decryption
 * @param {string} key - localStorage key
 * @param {any} defaultValue - Default value to return if key doesn't exist or decryption fails
 * @returns {any} - Decrypted data or defaultValue
 */
export const secureGetItem = (key, defaultValue = null) => {
  try {
    const encryptedData = localStorage.getItem(key);
    if (!encryptedData) return defaultValue;
    
    const decryptedData = decrypt(encryptedData);
    if (!decryptedData) return defaultValue;
    
    return JSON.parse(decryptedData);
  } catch (error) {
    console.error(`Error retrieving data for key ${key}:`, error);
    return defaultValue;
  }
};

/**
 * Remove data from localStorage
 * @param {string} key - localStorage key
 */
export const secureRemoveItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing data for key ${key}:`, error);
  }
};

export default {
  secureSetItem,
  secureGetItem,
  secureRemoveItem
};