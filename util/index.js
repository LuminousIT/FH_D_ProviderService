const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
  encryptPassword: async (password) => {
    const rounds = 10;
    const salt = await bcrypt.genSaltSync(rounds);
    const encryptedPassword = await bcrypt.hash(password, salt);
    return encryptedPassword;
  },

  generateAuthToken: async (data) => {
    const SECRET = process.env.SECRET;
    const expiresIn = 21600000;
    const token = await jwt.sign({ ...data }, SECRET, { expiresIn });
    return token;
  },

  checkIfPasswordMatch: async (original_password, encrypted_password) => {
    return await bcrypt.compare(original_password, encrypted_password);
  },

  decryptJwtAuthToken: async (token) => {
    try {
      const verified_token = await jwt.verify(token, process.env.SECRET);
      return { ...verified_token };
    } catch (error) {
      console.log("error decryptJwtAuthToken", error.message);
      throw new Error(error);
    }
  },
};
