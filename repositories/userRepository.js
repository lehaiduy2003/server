const { insertAccount, checkAccountByEmail } = require("./accountRepository");
const { generateRandomString } = require("../utils/data");
const UserProfiles = require("../models/userProfiles");

async function insertUser(email, password) {
  if (await checkAccountByEmail(email)) {
    console.log("User already exists");
    return null;
  }
  try {
    const account = await insertAccount(email, password);

    if (account) {
      const name = generateRandomString();
      const user = await UserProfiles.create({
        name: name,
        accountId: account._id,
      });
      return user;
    }
  } catch (error) {
    throw error;
  }
}

module.exports = { insertUser };
