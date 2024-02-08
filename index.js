const express = require("express");
const app = express();
const routes = require("./Routes/Route");
const connectDB = require("./utils/db");

connectDB();

app.use(express.json());

app.use("/", routes);

app.listen(3000, () => {
  console.log("Connected to backend");
});
