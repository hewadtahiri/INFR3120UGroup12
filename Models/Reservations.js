const mongoose = require("mongoose");

// Defines the schema for reservations.
const schema = new mongoose.Schema(
  {
    customer_name: {
      type: String,
      required: "Customer name is required",
      trim: true,
    },
    car_model: {
      type: String,
      required: "Car model is required",
      trim: true,
    },
    reservation_date: {
      type: Date,
      required: "Reservation date is required",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Credentials",
      required: "User ID is required",
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
    collection: "reservations",
  }
);

// Creates and exports the Reservations model based on the schema.
const Reservations = mongoose.model("Reservations", schema);

module.exports = Reservations;