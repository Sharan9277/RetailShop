const mongoose = require('mongoose')

const URL ='mongodb+srv://Ayan1234:Ayan1234@cluster0.w6nu5tw.mongodb.net/posts?retryWrites=true&w=majority'
// mongodb+srv://Ayan1234:Ayan1234@cluster0.w6nu5tw.mongodb.net/posts?retryWrites=true&w=majority

mongoose.connect(URL);

let connectionObj = mongoose.connection;

connectionObj.on("connected", () => {
  console.log("Mongo DB Connection Successfull");
});

connectionObj.on("error", () => {
  console.log("Mongo DB Connection Failed");
});