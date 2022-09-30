const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const PORT = 4000;
const DB_NAME = "tutorial";

// routes
var testAPIRouter = require("./routes/testAPI");
var UserRouter = require("./routes/Users");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connection to MongoDB
mongoose.connect(
  "mongodb+srv://canteenportal:canteenportal@cluster0.sei4q.mongodb.net/" +
    DB_NAME,
  { useNewUrlParser: true }
);
const connection = mongoose.connection;
connection.once("open", function () {
  console.log("MongoDB database connection established successfully !");
});

// setup API endpoints
app.use("/api/testAPI", testAPIRouter);
app.use("/api/user", UserRouter);

app.listen(PORT, function () {
  console.log("Server is running on Port: " + PORT);
});
