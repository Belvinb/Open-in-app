const { json } = require("express");
const User = require("../Models/userModel");
const Task = require("../Models/taskModel");
const SubTask = require("../Models/subTaskModel");

module.exports = {
  //creates new user
  createUser: async (req, res) => {
    try {
      const { phone_number, priority } = req.body;

      const user = await User.create({
        phone_number: phone_number,
        priority: priority,
      });

      res.status(201).json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  //creates new task
  createTask: async (req, res) => {
    try {
      const { title, description, due_date } = req.body;
      const user_id = req.user_id;
      const task = await Task.create({ title, description, due_date, user_id });
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json("Couldn't create new task");
    }
  },

  //creates new subtask
  createSubTask: async (req, res) => {
    try {
      const { task_id } = req.body;
      const user_id = req.user_id;
      const validUser = await Task.exists({ _id: task_id, user_id });
      if (!validUser) {
        res.status(401).json("Unauthorized");
        return;
      }
      const subTask = await SubTask.create({ task_id });
      res.status(201).json(subTask);
    } catch (error) {
      res.status(500).json("Couldn't create subtask");
    }
  },

  //soft delete task,based on task id
  deleteTask: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Task.updateOne(
        { _id: id },
        { $set: { deleted: true, deleted_at: Date.now() } }
      );
      res.status(200).json("Task deleted successfully ");
    } catch (error) {
      res.status(500).json("Unable to delete task");
    }
  },

  //soft delete subtask, based on subtask id
  deleteSubTask: async (req, res) => {
    try {
      const { id } = req.params;
      await SubTask.updateOne({_id:id},{$set:{deleted:true,deleted_at:Date.now()}})
      res.status(200).json("SubTask deleted successfully")
    } catch (error) {
      res.status(500).json("Unable to delete subtask")
    }
  },
};
