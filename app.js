const express = require("express");
const path = require("path");
// const { connectToDb, getDb } = require("./db");
const User = require("./models/User");
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
