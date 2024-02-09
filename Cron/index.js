const cron = require("node-cron");
const cronUpdateTaskPriority = require("./updatePriority");
const cronCall = require("./cronVoiceCall");

cron.schedule("*/5 * * * * *", async () => {
  try {
    await cronUpdateTaskPriority();
  } catch (error) {
    console.log(error);
  }
});

const cron2 = cron.schedule("*/5 * * * * *", async () => {
  try {
    await cronCall();
  } catch (error) {
    console.log(error);
  }
});

// cronUpdateTaskPriority()
// cronCall()
