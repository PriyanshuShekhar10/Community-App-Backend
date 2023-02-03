const express = require("express");
const path = require("path");
const { connectToDb, getDb } = require("./db");
const bodyParser = require("body-parser");

const app = express();
