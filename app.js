require("dotenv").config({ path: `${__dirname}/.env` });
const express = require("express");
const mongoose = require("mongoose");

mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useNewUrlParser", true);
// MongoDB Atlas url goes here
mongoose.connect(process.env.MONGO_URL);
mongoose.connection.on("error", err =>
  console.log("This is the mongoose error:\n" + err)
);

const app = express();
// necessary Express middleware
app.use(require("cors")());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Mongoose User model
require("./User");
// require all routes so that the server can use them
app.use(require("./router"));

app.listen(8000, () => console.log("Server running on http://localhost:8000/"));
