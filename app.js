//jshint esversion:6

//express server
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();
const PORT = process.env.PORT || 3000;
require("dotenv").config();
//body parser
app.use(bodyParser.urlencoded({ extended: true }));
const connectDB = async () => {
  await mongoose.connect(
    "mongodb://127.0.0.1:27017/secretsDB",
    {
      useNewUrlParser: true,
    },
    (err) => {
      if (err) console.log(err);
      else console.log("connected to mongoDB");
    }
  );
};
connectDB();
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

var secret = process.env.SECRET_KEY;
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

const User = mongoose.model("User", userSchema);

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/register", (req, res) => {
  res.render("register");
});
app.post("/register", function (req, res) {
  const user = new User({
    email: req.body.username,
    password: req.body.password,
  });
  user.save(function (err) {
    if (err) console.log(err);
    else {
      console.log("User added successfully");
      res.render("secrets");
    }
  });
});

app.post("/login", (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  User.findOne({ email: email, password: password }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        res.render("secrets");
      }
    }
  });
});
app.listen(PORT, function () {
  console.log("server started on port " + PORT);
});
