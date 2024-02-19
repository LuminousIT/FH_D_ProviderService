const {
  createProject,
  getProjects,
  getProjectsByID,
  updateProject,
} = require("../../services/project");

const router = require("express").Router();

router.route("/").get(getProjects);
router.route("/:id").get(getProjectsByID);
router.route("/").post(createProject);
router.route("/:id").patch(updateProject);

module.exports = router;
