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
// const inlab = require("./models/inlab");

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

//checklist

app.get("/checklist", checkAuthenticated, async (req, res) => {
  const devices = await Device.find({});
  res.render(path.join(__dirname, "/views/checklist"), { devices });
});

app.post("/checklist", checkAuthenticated, async (req, res, next) => {
  const deviceNames = Object.keys(req.body);
  const devices = await Device.find({});
  for (let device of devices) {
    device.present = deviceNames.includes(device.name);
    await device.save();
  }
  const user = await User.findOne({ email: req.user.email });

  user.inLab = true;
  await user.save();
  console.log({ message: "Lab entry recorded" });
  // await execute();
  res.redirect("/home");
});

//checklist for exit

app.get("/checklist-exit", checkAuthenticated, async (req, res) => {
  const devices = await Device.find({});
  res.render(path.join(__dirname, "/views/checklist-exit"), { devices });
});
app.post("/checklist-exit", checkAuthenticated, async (req, res, next) => {
  const deviceNames = Object.keys(req.body);
  const devices = await Device.find({});
  for (let device of devices) {
    device.present = deviceNames.includes(device.name);
    await device.save();
  }
  const user = await User.findOne({ email: req.user.email });

  user.inLab = false;
  await user.save();
  console.log({ message: "Lab exit recorded" });
  // await execute();
  res.redirect("/home");
});

//login page
app.get("/login", checkNotAuthenticated, (req, res, next) => {
  res.render(path.join(__dirname, "views", "login"));
});

app.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.delete("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

//register
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

//users
app.get("/users", checkAuthenticated, async (req, res, next) => {
  res.json(users);
});

//home

app.get("/home", checkAuthenticated, async (req, res, next) => {
  const currentUser = await User.findOne({ email: req.user.email });
  const key1 = await User.findOne({ hasKey1: true });
  const key2 = await User.findOne({ hasKey2: true });

  res.render(path.join(__dirname, "views", "home"), {
    users: users,
    key1: key1,
    key2: key2,
    currentUser: currentUser,
  });
});

app.post("/pass-key1", async (req, res, next) => {
  const newUser = await User.findOne({ email: req.body.a });

  const user = await User.findOne({ email: req.user.email });

  newUser.hasKey1 = true;
  await newUser.save();
  user.hasKey1 = false;
  await user.save();
  res.redirect("/home");
});

app.post("/pass-key2", async (req, res, next) => {
  const newUser = await User.findOne({ email: req.body.a });

  const user = await User.findOne({ email: req.user.email });

  newUser.hasKey2 = true;
  await newUser.save();
  user.hasKey2 = false;
  await user.save();
  res.redirect("/home");
});

app.get("/profile", (req, res, next) => {
  res.send(req.user);
});

//in lab feature

app.post(
  "/enter-the-lab",
  checkAuthenticated,
  isFirst,
  async (req, res, next) => {
    try {
      const user = await User.findOne({ email: req.user.email });
      if (!user) return res.status(404).send({ error: "User not found" });

      user.inLab = true;
      await user.save();

      res.send({ message: "Lab entry recorded" });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
);

app.post(
  "/exit-the-lab",
  checkAuthenticated,
  isLast,
  async (req, res, next) => {
    try {
      const user = await User.findOne({ email: req.user.email });
      if (!user) return res.status(404).send({ error: "User not found" });

      user.inLab = false;
      await user.save();

      res.send({ message: "Lab exit recorded" });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
);

app.get("/view-the-lab", checkAuthenticated, async (req, res, next) => {
  const activeUsers = await User.find({ inLab: true });

  res.render(path.join(__dirname, "views", "viewlab"), { users: activeUsers });
});

//controllers

async function isFirst(req, res, next) {
  const activeUsers = await User.find({ inLab: true });
  if (activeUsers.length === 0) {
    res.redirect("/checklist");
    // next();
  } else {
    return next();
  }
}

async function isLast(req, res, next) {
  const activeUsers = await User.find({ inLab: true });
  if (activeUsers.length === 1) {
    res.redirect("/checklist-exit");
  } else {
    return next();
  }
}

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/home");
  }
  next();
}

app.listen(3000);
