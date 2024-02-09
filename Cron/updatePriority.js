const { json } = require("express");
const Task = require("../Models/taskModel");

const calculatePriority = require("../utils/calculatePriority");


//function to update the task priority
async function cronUpdateTaskPriority (){
    const tasks = await Task.find({ $and: [
        { status: { $ne: "DONE" } }, // Status is not "DONE"
        { deleted: { $ne: true } } // deleted is not true
      ]})
    //   let due_date
    // console.log(tasks)
      for(const task of tasks){
        const due_date = task.due_date
        const id = task._id

        priority = calculatePriority(due_date)
        if (priority !== -1) {
            await Task.findByIdAndUpdate(id, { priority: priority });
        }
    }
    console.log("task priority updated")

}


module.exports = cronUpdateTaskPriority
