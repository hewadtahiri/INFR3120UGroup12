const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const routes = require("./Routes/index");
const app = express();
const config = require("./config");

// Connects to MongoDB cluster.
mongoose.connect(config.uri)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error(`MongoDB Connection Error: ${err}`));

// Imports the Credentials model.
const Credentials = require("./Models/Credentials.js");

// Creates authentication dependencies.
let session = require("express-session");
let passport = require("passport");
let passportLocal = require("passport-local");
let passportGoogle = require("passport-google-oauth");
passport.use(Credentials.createStrategy());
let localStrategy = passportLocal.Strategy;
let flash = require("connect-flash");

// Sets up cookies.
app.use(session({
    secret: "Cookie",
    saveUninitialized: false,
    resave: false
}));

// Initializes dependencies.
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Encrypts and decrypts user data.
passport.serializeUser(Credentials.serializeUser());
passport.deserializeUser(Credentials.deserializeUser());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "Views"));

app.use(express.static(path.join(__dirname, "Public")));
app.use(express.urlencoded({ extended: true }));

// Redirect users to the home page if they're not logged in
app.use((req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/'); // Redirect to home page if not authenticated
  }
  next(); // Continue if the user is authenticated
});

// Apply the routes
app.use("/", routes);

// Handle the home page and login routes
app.get("/", (req, res) => {
  res.render("home", { user: req.user });
});

app.get("/login", (req, res) => {
  res.render("login");
});

// Any other routes here will be protected by authentication
app.get("/protected", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/"); // Redirect to home if not authenticated
  }
  res.render("protectedPage", { user: req.user });
});

module.exports = app;