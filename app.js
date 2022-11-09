const express = require("express");
const app = express();
const path = require("path");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
require("dotenv").config();

// database
const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://Ayan-Bera1:Superman-Ayan@first-project.z3j271w.mongodb.net/Loginformdb");

// register schema
const registerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userid: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// register model
const Register = new mongoose.model("Registers", registerSchema);

// Allowing app to use body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
  app.use(express.static(__dirname + "/views"));
});
app.get("/read",(req,res)=>{
  Register.find()
      .then((result) => {
        res.send(result)
      })
      .catch((err) => {
        res.send(err);
      })
});


app.get("/contact", (req, res) => {
  res.send("contact details");
  app.use(express.static(__dirname + "/views"));
});
app.get("/register", (req, res) => {
  res.render("register");
  app.use(express.static(__dirname + "/views"));
});
app.get("/login", (req, res) => {
  res.render("login");
  app.use(express.static(__dirname + "/views"));
});

app.post("/register", async (req, res) => {
  Register.findOne({ userid: req.body.userid }, async (err, user) => {
    if (err) throw err;
    if (user)
      res.send(
        `<div>User already exists.try other email id.</div><br><a href="/login">login</a>`
      );
    else {
      let hashPassword = await bcrypt.hash(req.body.password, 10);
      const user = new Register({
        name: req.body.name,
        userid: req.body.userid,
        mobile: req.body.mobile,
        password: hashPassword,
      });
      user.save((err, res) => {
        if (err) throw err;
        console.log("1 document inserted");
      });

      res.redirect("/login");
      console.log(user);
    }
  });
});
app.post("/login", async (req, res) => {
  Register.findOne({ userid: req.body.userid }, async function (err, result) {
    if (result) {
      let submittedpwd = req.body.password;
      let storedpwd = result.password;
      if (await bcrypt.compare(submittedpwd, storedpwd)) {
        res.send(`<div><h1>welcome ${result.name}</h1></div>`);
        console.log(result);
      } else {
        res.send(
          `<div>Wrong password .try again!!</div><br><a href="/login">login</a>`
        );
      }
    } else {
      res.send(
        `<div>User does not exist .try again!!</div><br><a href="/register">register</a>`
      );
    }
  });
});

const port =process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`server is listening on port number http://localhost:${port}/`);
});
