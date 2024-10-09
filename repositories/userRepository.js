const Accounts = require("../models/accounts");

async function checkUser(email) {
  try {
    //const collection = await connectToCollection("users");
    const user = await Accounts.findOne({ email: email });
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function insertUser(email, password) {
  if (await checkUser(email)) {
    console.log("User already exists");
    return null;
  }
  try {
    const user = await Accounts.create({ email: email, password: password });
    if (user) {
      const userInfo = await Accounts.findOne({ email: email });
      return userInfo;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

module.exports = { insertUser, checkUser };
