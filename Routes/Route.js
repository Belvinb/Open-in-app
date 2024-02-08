const express = require("express");
const router = express.Router();
// import { jwtDecode } from "jwt-decode";
const { jwtDecode } = require("jwt-decode");
const controllers = require("../Controllers/Controller");

const decodeTokenMiddleware = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).json({ message: "UnAuthorized" });
  }
  const decoded = jwtDecode(token);
  req.user_id = decoded.user_id;

  next();
};

router.post("/createUser", controllers.createUser);

router.post("/createTask", decodeTokenMiddleware, controllers.createTask);

router.post("/createSubTask", decodeTokenMiddleware, controllers.createSubTask);

router.patch("/deleteTask/:id",decodeTokenMiddleware,controllers.deleteTask)

router.patch("/deleteSubTask/:id",decodeTokenMiddleware,controllers.deleteSubTask)

module.exports = router;
