const crypto = require("crypto");

function hashData(data) {
  const salt = crypto.randomBytes(16).toString("hex");

  const hash = crypto
    .pbkdf2Sync(data, salt, 1000, 64, "sha512")
    .toString("hex");

  return `${salt}:${hash}`;
}

function generateRandomString() {
  return crypto.randomBytes(8).toString("hex");
}

/**
 * TODO: Implement the decodeData function
 * Decodes the data
 * @param {string | number } encodedData - The encoded data
 * @returns
 */
function decodeData(encodedData) {
  return decodedData;
}
/**
 * TODO: Implement the encodeData function
 * Encodes the data
 * @param {string | number } data - The original data
 * @returns
 */
function encodeData(data) {
  return encodedData;
}

/**
 * Verifies the data against the hash
 * @param {string} data - data to verify (input by the user) e.g. password, email, etc...
 * @param {string} salt - salt of the data (from the database)
 * @param {string} hash - hash of the data (from the database)
 * @returns {boolean} - true if the data is correct, false otherwise
 */
function verifyData(data, salt, hash) {
  const hashToVerify = crypto
    .pbkdf2Sync(data, salt, 1000, 64, "sha512")
    .toString("hex");
  return hashToVerify === hash;
}

module.exports = {
  hashData,
  verifyData,
  generateRandomString,
  decodeData,
  encodeData,
};
