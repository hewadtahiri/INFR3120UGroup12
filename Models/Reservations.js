const mongoose = require("mongoose");

// Defines the schema for reservations.
const schema = new mongoose.Schema(
  {
    id: {
      type: Number,
      default: Date.now,
    },
    customer_name: {
      type: String,
      required: true,
    },
    car_model: {
      type: String,
      required: true,
    },
    reservation_date: {
      type: Date,
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    collection: "reservations",
    db: "project",
  }
);

// Creates and exports the Reservations model based on the schema.
const Reservations = mongoose.model("Reservations", schema);

module.exports = Reservations;