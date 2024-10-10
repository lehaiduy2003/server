//const { insertToken, updateToken } = require("../repositories/tokenRepository");
const { checkAccountByEmail } = require("../repositories/accountRepository");
const { insertUser } = require("../repositories/userRepository");

const { hashData, verifyData } = require("../utils/data");
const { generateTokens, refreshAccessToken } = require("../utils/tokens");

async function userSignUp(email, password) {
  const hashedPassword = hashData(password);
  const hashedEmail = hashData(email);
  try {
    const newUser = await insertUser(hashedEmail, hashedPassword);
    if (!newUser) {
      return null;
    }
    const { refreshToken, accessToken } = generateTokens(newUser);
    return { newUser, refreshToken, accessToken };
  } catch (error) {
    console.error("Error during sign up:");
    throw error;
  }
}
function getNewAccessToken(token) {
  return refreshAccessToken(token);
}

async function userSignIn(email, password) {
  try {
    const account = await checkAccountByEmail(email);

    if (!account) {
      return null; // User không tồn tại
    }

    const [passwordSalt, passwordHash] = account.password.split(":");
    const isPasswordValid = verifyData(password, passwordSalt, passwordHash);

    if (!isPasswordValid) {
      return null; // Mật khẩu không đúng
    }

    const { refreshToken, accessToken } = generateTokens(account);
    return { account, refreshToken, accessToken };
  } catch (error) {
    console.error("Error during sign in:");
    throw error;
  }
}

module.exports = {
  userSignUp,
  getNewAccessToken,
  userSignIn,
};
