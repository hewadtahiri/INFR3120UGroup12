const express = require("express");
const path = require("path");
const routes = require("./Routes/index");
const app = express();
let session = require('express-session');
let passport = require('passport');
let passportLocal = require('passport-local');
let passportGoogle = require('passport-google-oauth');
let localStrategy = passportLocal.Strategy;
let flash = require(connect-flash);


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "Views"));

app.use(express.static(path.join(__dirname, "Public")));
app.use(express.urlencoded({ extended: true }));
app.use("/", routes);

module.exports = app;