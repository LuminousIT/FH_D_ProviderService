const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const route_handler = require("./api/index");
const connectDB = require("./db/index");
require("dotenv").config();

const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(morgan("tiny"));
app.use(express.json());
app.use(compression());
app.use(helmet());

app.use("/", route_handler);

const PORT = process.env.PORT;

const startApp = async () => {
  try {
    const url = process.env.DB_URL;
    await connectDB(url);
    app.listen(PORT, () => {
      console.log(`server is listening on PORT ${PORT}`);
    });
  } catch (exception) {
    console.log(exception.message);
  }
};

startApp();
