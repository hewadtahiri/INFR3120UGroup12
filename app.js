const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const routes = require("./Routes/index");
const app = express();
const config = require("./config");

// Connect to MongoDB cluster.
mongoose.connect(config.uri)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error(`MongoDB Connection Error: ${err}`));

// Imports the Credentials model.
const Credentials = require("./Models/Credentials.js");

// Creates authentication dependencies.
let session = require("express-session");
let passport = require("passport");
let passportLocal = require("passport-local");
passport.use(Credentials.createStrategy());
let flash = require("connect-flash");

// Session configuration
app.use(session({
  secret: "Cookie",               // Session secret key
  resave: false,                  // Don't save unmodified sessions
  saveUninitialized: false,       // Don't save new sessions if unmodified
  cookie: { secure: false }       // Make sure the cookie works in development (set to true in production with HTTPS)
}));

// Initialize passport.js
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Serialize and deserialize user data
passport.serializeUser(Credentials.serializeUser());
passport.deserializeUser(Credentials.deserializeUser());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "Views"));

app.use(express.static(path.join(__dirname, "Public")));
app.use(express.urlencoded({ extended: true }));

// Middleware to ensure user is authenticated before accessing protected routes
// NOTE: This should only be used for routes that require authentication
app.use("/protected", (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login"); // Redirect to login if not authenticated
  }
  next(); // Proceed to the next middleware or route
});

// Routes
app.use("/", routes);

// Home Route
app.get("/", (req, res) => {
  res.render("home", { user: req.user });
});

// Login Route
app.get("/login", (req, res) => {
  res.render("login");
});

// Protected Route
app.get("/protected", (req, res) => {
  res.render("protectedPage", { user: req.user });
});

module.exports = app;
