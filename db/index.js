const mongoose = require("mongoose");

const connectDB = async (url) => {
  console.log({ url });
  const response = await mongoose.connect(url, {
    useNewUrlParser: true,
    serverSelectionTimeoutMS: 10000,
  });
  return response;
};

module.exports = connectDB;
