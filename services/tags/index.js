const uuid = require("uuid");
const TagsDB = require("../../model/tags");
const jwt = require("jsonwebtoken");
const { TagsSchema } = require("../../schemas/tags");

const createTags = async (request, response, next) => {
  try {
    const { name } = request.body;
    const { error } = TagsSchema.validate(request.body);
    if (error) throw new Error(error.message);

    const tags_id = uuid.v4();
    const created = new TagsDB({
      id: tags_id,
      name,
    });
    await created.save();
    if (!created) throw new Error("Tags Creation Failed");
    return response.status(200).json({ status: "success", content: created });
  } catch (error) {
    console.log(error.message);
    return response.status(401).json({ status: "failed", msg: error.message });
  }
};

const updateTags = async (request, response, next) => {
  try {
    const { error } = TagsSchema.validate(request.body);
    if (error) throw new Error(error.message);
    const param = request.params.id;

    if (!param) throw new Error("Tags id missing from param");

    const existingTags = await TagsDB.findOne({ id: param }).exec();
    if (!existingTags) throw new Error("Tags does not exist.");

    const updated = await TagsDB.updateOne(
      { id: param },
      { $set: { ...request.body } }
    );
    if (!updated) throw new Error("Tags Update failed");
    return response.status(200).json({ status: "success", content: updated });
  } catch (error) {
    console.log(error.message);
    return response.status(400).json({ status: "failed", msg: error.message });
  }
};

const getTags = async (request, response, next) => {
  try {
    const { token } = request;
    // decode token and get id from token
    const verified_token = await jwt.verify(token, process.env.SECRET);

    const { id } = verified_token;

    const tags = await TagsDB.find({}).exec();

    if (!tags) throw new Error("Tags does not exist");
    return response.status(200).json({ status: "success", content: tags });
  } catch (error) {
    console.log(error.message);
    return response.status(401).json({ status: "failed", msg: error.message });
  }
};

const getTagsByID = async (request, response, next) => {
  try {
    const { id } = request.params;

    const tags_record = await TagsDB.findOne({ id }).exec();
    if (!tags_record) throw new Error("Tags does not exist");
    return response
      .status(200)
      .json({ status: "success", content: tags_record });
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ status: "failed", msg: error.message });
  }
};

module.exports = {
  createTags,
  getTags,
  getTagsByID,
  updateTags,
};
