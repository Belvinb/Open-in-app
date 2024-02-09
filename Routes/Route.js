const express = require("express");
const router = express.Router();
// import { jwtDecode } from "jwt-decode";
const { jwtDecode } = require("jwt-decode");
const controllers = require("../Controllers/Controller");
const cronControllers = require("../Controllers/CronJobController")

//decodes user_id from the jwt token
const decodeTokenMiddleware = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).json({ message: "UnAuthorized" });
  }
  const decoded = jwtDecode(token);
  req.user_id = decoded.user_id;

  next();
};
//create user
router.post("/createUser", controllers.createUser);
//create task
router.post("/createTask", decodeTokenMiddleware, controllers.createTask);
//create subtask
router.post("/createSubTask", decodeTokenMiddleware, controllers.createSubTask);
//soft delete task
router.patch("/deleteTask/:id",decodeTokenMiddleware,controllers.deleteTask)
//soft delete subtask
router.patch("/deleteSubTask/:id",decodeTokenMiddleware,controllers.deleteSubTask)
//get all user tasks
router.get("/getAllTasks",decodeTokenMiddleware,controllers.getAllTasks)
//get all user subtasks
router.get("/getAllSubTasks",decodeTokenMiddleware,controllers.getAllSubTask)

//update sub task
router.patch("/updateSubTask/:id",decodeTokenMiddleware,controllers.updateSubTask)

//update task status
router.patch("/updateTaskStatus/:id",decodeTokenMiddleware,controllers.updateTaskStatus)

//update task due_date
router.patch("/updateTaskDueDate/:id",decodeTokenMiddleware,controllers.updateTaskDueDate)


module.exports = router;
