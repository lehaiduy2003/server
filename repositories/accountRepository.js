const Accounts = require("../models/accounts");

async function checkAccountByEmail(email) {
  try {
    const account = await Accounts.findOne({ email: email });
    return account;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function insertAccount(email, password) {
  if (await checkAccountByEmail(email)) {
    console.log("User already exists");
    return null;
  }
  try {
    const account = await Accounts.create({ email: email, password: password });
    return account;
  } catch (error) {
    throw error;
  }
}

module.exports = { checkAccountByEmail, insertAccount };
