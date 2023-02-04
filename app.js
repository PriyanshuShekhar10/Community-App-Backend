const express = require("express");
const path = require("path");
// const { connectToDb, getDb } = require("./db");
const user = require("./models/User");
const Device = require("./models/Device");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

mongoose.connect(
  "mongodb+srv://Priyanshu1:communityapppassword@commapprs.cqsr22x.mongodb.net/test?retryWrites=true&w=majority"
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", "views");

app.get("/admin/add-user", (req, res, next) => {});

app.post("/admin/add-user", (req, res, next) => {
  async function run() {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
      imageUrl: req.body.imageUrl,
      github: req.body.github,
      linkedin: req.body.linkedin,
    });
    await user.save();
    console.log(user);
  }
  run();
});

app.post("/admin/add-device", (req, res, next) => {
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

app.get("/admin/add-device", (req, res, next) => {
  res.render(path.join(__dirname, "views/admin/add-device"));
});

app.get("/devices", (req, res, next) => {
  Device.find({}, function (err, devices) {
    res.json(devices);
  });
});

app.get("/checklist", async (req, res) => {
  const devices = await Device.find({});
  res.render(path.join(__dirname, "/views/checklist"), { devices });
});

app.post("/checklist", async (req, res) => {
  const deviceNames = Object.keys(req.body);
  const devices = await Device.find({});
  for (let device of devices) {
    device.present = deviceNames.includes(device.name);
    await device.save();
  }
  res.redirect("/devices");
});

app.listen(3000);
