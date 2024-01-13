const uuid = require("uuid");
const { SignUpSchema, LogInSchema } = require("../../schemas/admin");
const AdminDB = require("../../model/admin");
const {
  encryptPassword,
  checkIfPasswordMatch,
  generateAuthToken,
} = require("../../util");

const registerAdmin = async (request, response, next) => {
  try {
    const { body } = request;
    const { error } = SignUpSchema.validate(body);
    if (error) throw new Error(error);

    const { password, email } = body;
    const existing_record = await AdminDB.findOne({ email });
    if (existing_record) throw new Error("record exist");
    if (password.length < 6) throw new Error("Password not strong enough");

    const uid = uuid.v4();
    const encryptedPassword = await encryptPassword(password);

    const created_record = new AdminDB({
      ...body,
      id: uid,
      password: encryptedPassword,
    });
    await created_record.save();
    if (!created_record) throw new Error("User creation failed");

    return response
      .status(201)
      .json({ status: "success", content: created_record });
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ status: "failed", msg: error.message });
  }
};

const login = async (request, response, next) => {
  try {
    const { email, password } = request.body;
    const { error } = LogInSchema.validate(request.body);
    if (error) throw new Error(error);

    const user_record = await AdminDB.findOne({ email }).exec();
    if (!user_record) throw new Error("User does not exist");

    const passwordIsCorrect = await checkIfPasswordMatch(
      password,
      user_record.password
    );
    if (passwordIsCorrect) {
      const user = { ...user_record };

      const authToken = await generateAuthToken({ ...user_record });
      return response.status(200).json({
        status: "success",
        content: { ...user._doc },
        token: authToken,
      });
    }
    return response
      .status(400)
      .json({ status: "failed", content: "Email or Password incorrect" });
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ status: "failed", msg: error.message });
  }
};

const getAdmins = async (request, response, next) => {
  try {
    const users = await AdminDB.find({}).exec();
    if (!users) throw new Error("User does not exist");
    return response.status(200).json({ status: "success", content: users });
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ status: "failed", msg: error.message });
  }
};

const getRFID = async (request, response, next) => {
  try {
    const body = request.body;
    console.log({ body });
    return response.status(200).json({ status: "success", content: body });
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ status: "failed", msg: error.message });
  }
};

const getHomepage = async (request, response, next) => {
  try {
    return response
      .status(200)
      .json({ status: "success", content: "Hello, World!" });
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ status: "failed", msg: error.message });
  }
};
module.exports = { registerAdmin, login, getAdmins, getRFID, getHomepage };
