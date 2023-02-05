if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
// const { connectToDb, getDb } = require("./db");
const User = require("./models/User");
const Device = require("./models/Device");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");

const app = express();

const initializePassport = require("./passport-config");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", "views");
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

mongoose.connect(
  "mongodb+srv://Priyanshu1:communityapppassword@commapprs.cqsr22x.mongodb.net/test?retryWrites=true&w=majority"
);

let users = [];

async function run() {
  users = await User.find({});
}
run();

initializePassport(
  passport,
  (email) => users.find((user) => user.email === email),
  (id) => users.find((user) => user.id === id)
);

app.post("/admin/add-device", checkAuthenticated, (req, res, next) => {
  async function run() {
    const device = new Device({
      name: req.body.name,
      imageUrl: req.body.imageUrl,
      desk: req.body.desk,
      description: req.body.description,
      //   present: req.body.present,
    });
    await device.save();
    console.log(device);
  }
  run();
  res.redirect("/devices");
});

app.get("/admin/add-device", checkAuthenticated, (req, res, next) => {
  res.render(path.join(__dirname, "views/admin/add-device"));
});

app.get("/devices", checkAuthenticated, async (req, res, next) => {
  const devices = await Device.find({});
  res.json(devices);
});

app.get("/checklist", checkAuthenticated, async (req, res) => {
  const devices = await Device.find({});
  res.render(path.join(__dirname, "/views/checklist"), { devices });
});

app.post("/checklist", checkAuthenticated, async (req, res) => {
  const deviceNames = Object.keys(req.body);
  const devices = await Device.find({});
  for (let device of devices) {
    device.present = deviceNames.includes(device.name);
    await device.save();
  }
  res.redirect("/devices");
});

app.get("/login", checkNotAuthenticated, (req, res, next) => {
  res.render(path.join(__dirname, "views", "login"));
});

app.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/checklist",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.get("/admin/register", checkAuthenticated, (req, res, next) => {
  res.render(path.join(__dirname, "views", "admin", "register"));
});

app.post("/admin/register", checkAuthenticated, async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    await user.save();
    await run();
    res.redirect("/users");
  } catch {}
});

app.get("/users", checkAuthenticated, async (req, res, next) => {
  res.json(users);
});

app.delete("/logout", (req, res, next) => {
  req.logOut();
  res.redirect("/login");
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/checklist");
  }
  next();
}

app.listen(3000);
