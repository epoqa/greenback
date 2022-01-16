import mongoose, { ConnectOptions } from "mongoose";
require("dotenv").config();
const uri: any = process.env.MONGODB_URI;
mongoose.connect(
  `${uri}`, { useNewUrlParser: true, useUnifiedTopology: true } as ConnectOptions,
  (err: any) => {
    if (err) {
      console.log(`Error connecting to the database. ${err}`);
    } else {
      console.log("Successfully connected to the database");
    }
  }
);
