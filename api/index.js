const router = require("express").Router();
// const { getHomepage } = require("../services/admin");
const admin_route_handler = require("./admin/index");
const schedule_route_handler = require("./schedule/index");

const setup_request = (request, response, next) => {
  request.headers["access-control-allow-origin"] = "*";
  request.headers["access-control-allow-headers"] = "*";
  console.log("request url ", request.url);

  if (request.method === "OPTIONS") {
    request.headers["access-control-allow-methods"] =
      "GET, POST, PUT, PATCH, DELETE";
    response.status(200).json();
  }

  next();
};

const check_request_for_token = (request, response, next) => {
  const { authorization } = request.headers;
  if (authorization && authorization.startsWith("Bearer ")) {
    const token = authorization.split(" ")[1];
    request.token = token;
  } else {
    request.token = null;
    throw new Error("You must be logged in to access this resource");
  }
  next();
};

router.use(setup_request);
router.use("/api/v1/users", admin_route_handler);
router.use("/api/v1/schedule", check_request_for_token, schedule_route_handler);

module.exports = router;
