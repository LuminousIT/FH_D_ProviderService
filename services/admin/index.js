const uuid = require("uuid");
const { SignUpSchema, LogInSchema } = require("../../schemas/admin");
const AdminDB = require("../../model/admin");
const {
  encryptPassword,
  checkIfPasswordMatch,
  generateAuthToken,
  decryptJwtAuthToken,
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
    const res = await created_record.save();
    if (!created_record) throw new Error("User creation failed");

    const created = { ...created_record._doc };
    delete created["password"];

    return response.status(201).json({ status: "success", content: created });
  } catch (error) {
    console.log(error.message);
    return response.status(400).json({ status: "failed", msg: error.message });
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
      const {
        id,
        firstName,
        lastName,
        email,
        timeZone,
        role,
        activated,
        deactivationDate,
        active,
        language,
        companyOwner,
        created_on,
      } = user._doc;
      const tokenPayload = { id, email, firstName, lastName };

      const authToken = await generateAuthToken({ ...tokenPayload });

      return response.status(200).json({
        status: "success",
        content: {
          id,
          firstName,
          lastName,
          email,
          timeZone,
          role,
          activated,
          deactivationDate,
          active,
          language,
          companyOwner,
          created_on,
        },
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
    const { token } = request;
    const userInfo = await decryptJwtAuthToken(token);

    const users = await AdminDB.find({ id: userInfo.id }).exec();
    if (!users) throw new Error("User does not exist");
    delete users["password"];
    console.log("users", users);
    return response.status(200).json({ status: "success", content: users });
  } catch (error) {
    console.log(error.message);
    return response.status(401).json({ status: "failed", msg: error.message });
  }
};

const getUser = async (request, response, next) => {
  try {
    const { token } = request;
    const userInfo = await decryptJwtAuthToken(token);

    const users = await AdminDB.find({ id: userInfo.id }).exec();
    if (!users) throw new Error("User does not exist");
    return response.status(200).json({ status: "success", content: users });
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ status: "failed", msg: error.message });
  }
};

module.exports = { registerAdmin, login, getAdmins, getUser };
