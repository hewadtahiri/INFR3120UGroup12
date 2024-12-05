const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
let passportGoogle = require("passport-google-oauth");

// Defines the schema for users.
const schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: "Username is required",
      trim: true,
    },
    password: {
      type: String,
      trim: true,
    },
    displayName: {
      type: String,
      trim: true,
      required: "Display name is required",
    },
    email: {
      type: String,
      trim: true,
      required: "Email is required",
    },
    created: {
      type: Date,
      default: Date.now,
    },
    update: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "credentials",
  }
);

schema.plugin(passportLocalMongoose);

// Creates and exports the User model based on the schema.
const User = mongoose.model("User", schema);

module.exports = User;