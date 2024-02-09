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
      required: [true,"Due date is required"],
      default: Date.now(),
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    priority:{
      type:Number,
      enum:[0,1,2,3]

    },
    status:{
      type:String,
      enum:["TODO","IN_PROGRESS","DONE"],
      default:"TODO"
    },
    // subtasks: [{ type: Schema.Types.ObjectId ,ref:"SubTask"}],
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
