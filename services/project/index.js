const uuid = require("uuid");
const ProjectDB = require("../../model/project");
const TagsDB = require("../../model/tags");
const ActivityDB = require("../../model/activity");
const jwt = require("jsonwebtoken");
const { decryptJwtAuthToken } = require("../../util");
const { ProjectSchema } = require("../../schemas/project");

const createProject = async (request, response, next) => {
  try {
    const { token } = request;
    const { name, color, tags, activities, userID } = request.body;
    const { error } = ProjectSchema.validate(request.body);
    if (error) throw new Error(error.message);

    const userInfo = await decryptJwtAuthToken(token);

    // check if user exist
    if (userID) {
      const user = await AdminDB.findOne({ id: userID }).exec();
      if (!user) throw new Error("User does not exist.");
    }

    const { id: verifiedUserId } = userInfo;

    const project_id = uuid.v4();
    const created = new ProjectDB({
      id: project_id,
      name,
      color,
      tags,
      activities,
      userID: verifiedUserId,
    });
    await created.save();
    if (!created) throw new Error("Project Creation Failed");
    return response.status(200).json({ status: "success", content: created });
  } catch (error) {
    console.log(error.message);
    return response.status(401).json({ status: "failed", msg: error.message });
  }
};

const updateProject = async (request, response, next) => {
  try {
    const { error } = ProjectSchema.validate(request.body);
    if (error) throw new Error(error.message);
    const param = request.params.id;

    if (!param) throw new Error("Project id missing from param");

    const existingProject = await ProjectDB.findOne({ id: param }).exec();
    if (!existingProject) throw new Error("Project does not exist.");

    const updated = await ProjectDB.updateOne(
      { id: param },
      { $set: { ...request.body } }
    );
    if (!updated) throw new Error("Project Update failed");
    return response.status(200).json({ status: "success", content: updated });
  } catch (error) {
    console.log(error.message);
    return response.status(400).json({ status: "failed", msg: error.message });
  }
};

const getProjects = async (request, response, next) => {
  try {
    const { token } = request;
    // decode token and get id from token
    const verified_token = await jwt.verify(token, process.env.SECRET);

    const { id } = verified_token;

    const projects = await ProjectDB.find({ userID: id }).exec();

    if (!projects) throw new Error("Project does not exist");
    return response.status(200).json({ status: "success", content: projects });
  } catch (error) {
    console.log(error.message);
    return response.status(401).json({ status: "failed", msg: error.message });
  }
};

const getProjectsByID = async (request, response, next) => {
  try {
    const { id } = request.params;

    const project_record = await ProjectDB.findOne({ id }).exec();
    if (!project_record) throw new Error("Project does not exist");
    return response
      .status(200)
      .json({ status: "success", content: project_record });
  } catch (error) {
    console.log(error.message);
    return response.status(400).json({ status: "failed", msg: error.message });
  }
};

module.exports = {
  createProject,
  updateProject,
  getProjects,
  getProjectsByID,
};
