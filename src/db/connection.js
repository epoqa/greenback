const mongoose = require("mongoose");
require("dotenv").config();
const uri = process.env.MONGODB_URI;
mongoose.connect(
  uri,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      console.log(`Error connecting to the database. ${err}`);
    } else {
      console.log("Successfully connected to the database");
    }
  }
);
