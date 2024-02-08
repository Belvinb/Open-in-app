const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const userSchema = new Schema({
    phone_number:{
        type:Number,
        required:[true,"Phone number is required"],
        unique:true,
        // validate: {
        //     validator: function(value) {
        //         return value.toString().length >= 10;
        //     },
        //     message: "Phone number should be at least 10 digits"
        // }
        
    },
    priority:{
        type:Number,
        required:true,
        enum:[0,1,2]
        

    }

})

const User = mongoose.model("User",userSchema)

module.exports = User

