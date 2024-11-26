const express = require("express");
const path = require("path");
const routes = require("./Routes/index");
const app = express();

// Creating Authentication Dependencies
let session = require('express-session');
let passport = require('passport');
let passportLocal = require('passport-local');
let passportGoogle = require('passport-google-oauth');
let localStrategy = passportLocal.Strategy;
let flash = require(connect-flash);

// Setting up Cookies
app.use(session({
    secret:"Cookie",
    saveUninitialized:false,
    resave:false
}))

// Initializing Dependencies
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// User Model Creation
let userModel = require('../Models/user');
let user = userModel.User;

// Encrypting and Decrypting user data
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "Views"));

app.use(express.static(path.join(__dirname, "Public")));
app.use(express.urlencoded({ extended: true }));
app.use("/", routes);

module.exports = app;