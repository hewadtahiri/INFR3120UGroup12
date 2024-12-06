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

// Set view engine and paths
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../frontend/Views"));

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, "../frontend/Public")));

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));

// Use the routes for the app
app.use("/", routes);

// Start server on the defined port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
