const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://sjay21448:rDJjgKRvKjkuqode@futstal.aep4ite.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Connected to the database");
});

// username: sjay21448
// pwd: rDJjgKRvKjkuqode
// atlas: mongodb+srv://sjay21448:rDJjgKRvKjkuqode@futstal.aep4ite.mongodb.net/?retryWrites=true&w=majority
