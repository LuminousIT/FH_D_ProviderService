const mongoose = require("mongoose");

const connectDB = (url) => {
  console.log({ url });
  return mongoose.connect(url, { useNewUrlParser: true });
};

module.exports = connectDB;
