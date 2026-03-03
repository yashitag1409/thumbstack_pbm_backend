// require("dotenv").config();
require("dotenv").config();
// database connection
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL, {});

mongoose.connection.on("connected", () => {
  console.log(`DATABASE CONNECTED SUCCESSFULLY ✅`);
  console.log("Connected to DB:", mongoose.connection.name);
});

mongoose.connection.on("error", (err) => {
  console.log(`DATABASE failed to connect ❌`, err);
});

mongoose.set("strictQuery", false);
