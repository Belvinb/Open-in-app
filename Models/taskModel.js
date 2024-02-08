const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    due_date: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    subtasks: [{ type: Schema.Types.ObjectId }],
    deleted_at: {
      type: Date,
    },
    deleted:{
        type:Boolean,
        default:false
    }
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
