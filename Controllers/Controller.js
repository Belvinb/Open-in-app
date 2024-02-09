const { json } = require("express");
const User = require("../Models/userModel");
const Task = require("../Models/taskModel");
const SubTask = require("../Models/subTaskModel");
const calculatePriority = require("../utils/calculatePriority");
const { ObjectId } = require("mongoose").Types;

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
      const priority = calculatePriority(due_date);
      if (priority == -1) {
        return res
          .status(400)
          .json("Due date cannot be lesser than current date");
      }

      const task = await Task.create({
        title,
        description,
        due_date,
        user_id,
        priority,
      });
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
      await SubTask.updateOne(
        { _id: id },
        { $set: { deleted: true, deleted_at: Date.now() } }
      );
      res.status(200).json("SubTask deleted successfully");
    } catch (error) {
      res.status(500).json("Unable to delete subtask");
    }
  },

  //get all user tasks
  getAllTasks: async (req, res) => {
    try {
      const user_id = req.user_id;
      const { pageNumber = 1, pageSize = 10, priority, due_date } = req.query;
      const searchQuery = {
        user_id: new ObjectId(user_id),
      };

      if (due_date) {
        searchQuery.due_date = due_date;
      }

      if (priority) {
        searchQuery.priority = priority;
      }

      const skip = (pageNumber - 1) * pageSize;
      const tasks = await Task.find(searchQuery)
        .skip(skip)
        .limit(pageSize)
        .sort({ createdAt: -1 });
      res.status(200).json(tasks);
    } catch (error) {}
  },

  //get all user subtask
  getAllSubTask: async (req, res) => {
    try {
      const user_id = req.user_id;
      const { taskId } = req.query;

      const matchQuery = {
        user_id: new ObjectId(user_id),
      };
      if (taskId) {
        matchQuery._id = new ObjectId(taskId);
      }

      const subtasks = await Task.aggregate([
        {
          $match: matchQuery,
        },
        {
          $lookup: {
            from: "subtasks",
            localField: "_id",
            foreignField: "task_id",
            as: "allsub",
          },
        },
        {
          $unwind: "$allsub",
        },
      ]);

      const result = subtasks.map((task) => task.allsub);
      res.json(result);
    } catch (error) {
      console.log(error);
    }
  },
  //update subtask
  updateSubTask: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updatedSubTask = await SubTask.findByIdAndUpdate(
        id,
        { status: status },
        { new: true }
      );
      if (updatedSubTask) {
        const taskId = updatedSubTask.task_id;
        const subTasks = await SubTask.find({ task_id: taskId });
        const allCompleted = subTasks.every((sub) => sub.status === 1);
        const atleastOneCompleted = subTasks.some((sub) => sub.status === 1);
        let status = "";
        if (allCompleted) {
          status = "DONE";
        } else if (atleastOneCompleted) {
          status = "IN_PROGRESS";
        } else {
          status = "TODO";
        }

        await Task.findByIdAndUpdate(taskId, { status: status });
        res.json("SubTask updated succesfully");
      }
    } catch (error) {
      console.log(error);
    }
  },

  //updateTask status
  updateTaskStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (status != "TODO" && status != "DONE") {
        return res.status(400).json("Unable to update task status");
      }

      const task = await Task.findByIdAndUpdate(id, { status: status });

      if (!task) {
        return res.json("Task status update failed");
      }
      let subTaskStatus;
      if (status === "TODO") {
        subTaskStatus = 0;
      } else if (status === "DONE") {
        subTaskStatus = 1;
      }

      await SubTask.updateMany(
        { task_id: id },
        { $set: { status: subTaskStatus } }
      );

      res.status(200).json("Task status updated successfully");
    } catch (error) {
      console.log(error);
    }
  },

  //update task due date
  updateTaskDueDate: async (req, res) => {
    try {
      const { id } = req.params;
      const { due_date } = req.body;
      const priority = calculatePriority(due_date);
      if (priority == -1) {
        return res
          .status(400)
          .json("Due date cannot be lesser than current date");
      }

      const updatedTask = await Task.findByIdAndUpdate(id, {
        due_date: due_date,
        priority: priority,
      });
      res.status(200).json("Task due date updated successfully");
    } catch (error) {
      console.log(error);
    }
  },
};
