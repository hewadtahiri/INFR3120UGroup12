const express = require("express");
const app = express();
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

// Simulating a database with an array
let reservations = [];

// Display all reservations
app.get("/", (req, res) => {
  res.render("home", { reservations });
});

// Create new reservation
app.post("/reservations", (req, res) => {
  const newReservation = {
    id: Date.now(),
    customer_name: req.body.customer_name,
    car_model: req.body.car_model,
    reservation_date: req.body.reservation_date,
  };
  reservations.push(newReservation);
  res.redirect("/");  // Redirect to home to show updated list
});

// Edit reservation form
app.get("/reservations/edit/:id", (req, res) => {
  const reservationId = req.params.id;
  const reservation = reservations.find(r => r.id == reservationId); // Find the reservation by id

  if (reservation) {
    res.render("home", { reservations, reservation }); // Pass the reservation along with reservations array
  } else {
    res.redirect("/"); // If reservation is not found, redirect to home
  }
});

// Update reservation
app.post("/reservations/edit/:id", (req, res) => {
  const reservation = reservations.find((r) => r.id == req.params.id);
  if (reservation) {
    reservation.customer_name = req.body.customer_name;
    reservation.car_model = req.body.car_model;
    reservation.reservation_date = req.body.reservation_date;
  }
  res.redirect("/");  // Redirect to home to show updated list
});

// Delete reservation
app.get("/reservations/delete/:id", (req, res) => {
  reservations = reservations.filter((r) => r.id != req.params.id);
  res.redirect("/");  // Redirect to home to show updated list
});

module.exports = app;