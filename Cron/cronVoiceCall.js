require("dotenv").config();
const Task = require("../Models/taskModel");
const User = require("../Models/userModel");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

async function cronCall() {
  try {
    const users = await Task.aggregate([
      {
        $match: { due_date: { $lt: new Date() } },
      },
      {
        $lookup : {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "due_users",
          },
      },
      {
        $unwind: "$due_users"
      },
      {
        $project: {
          _id: 0,
          "user_id": "$due_users._id",
          "phone_number": "$due_users.phone_number",
          "priority": "$due_users.priority"
        }
      },
      {
        $sort:{"priority":  1}
      }

    ]);

    console.log(users)

    async function makeCall(phoneNumber) {
      console.log(`calling to number ${phoneNumber}`)
      try {
          let call = await client.calls.create({
              url: "https://demo.twilio.com/welcome/voice/",
              to: phoneNumber,
              from: "+1 659 399 7624",
          });

          return new Promise((resolve, reject) => {
            let interval = setInterval(async () => {
                let updatedCall = await client.calls(call.sid).fetch()
                // console.log(updatedCall.status)
                if(updatedCall.status === "in-progress" || updatedCall.status === "completed"){
                  clearInterval(interval)
                  return
                }else if(updatedCall.status != "ringing"){

                  clearInterval(interval)
                  resolve()
                }
            }, 10000)
        })
     
      } catch (error) {
          console.log("Unable to make call to", phoneNumber, error);
          throw error; 
      }
  }
  

    for(const user of users){
      try {
        await makeCall(user.phone_number);
       
    } catch (error) {
      
        console.error("Error making call:", error);
    }

    }

  } catch (error) {
    console.log(error);
  }
}

module.exports = cronCall;
