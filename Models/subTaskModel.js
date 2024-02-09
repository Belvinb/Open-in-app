const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const subTaskSchema = new Schema({
    task_id:{
        type: Schema.Types.ObjectId,
        required:true,
       
    },
    status:{
        type:Number,
        enum:[0,1],
        default:0,
    },
    deleted_at:{
        type:Date
    },
    deleted:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

const SubTask = mongoose.model("SubTask",subTaskSchema)

module.exports = SubTask