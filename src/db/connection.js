const mongoose = require('mongoose');

const uri =
  'mongodb+srv://GreenDiaryAdmin:GreenEpoqa@greendiary.9qqda.mongodb.net/GreenDatabase?retryWrites=true&w=majority';

mongoose.connect(
  uri,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      console.log(`Error connecting to the database. ${err}`);
    } else {
      console.log('Successfully connected to the database');
    }
  }
);