const express = require("express");
const router = express.Router();

// Simulates the database using an array.
let reservations = [];

// Displays landing page and active reservations.
router.get("/", (req, res) => {
  res.render("Layout", { title: "Home", body: "Home", reservations, editReservation: null });
});

// Creates a new reservation.
router.post("/reservations", (req, res) => {
  const newReservation = {
    id: Date.now(),
    customer_name: req.body.customer_name,
    car_model: req.body.car_model,
    reservation_date: req.body.reservation_date,
  };
  reservations.push(newReservation);
});

// Edits an existing reservation.
router.get("/reservations/edit/:id", (req, res) => {
  const reservationId = req.params.id;
  const reservation = reservations.find(r => r.id == reservationId);

  if (reservation) {
    res.render("Layout", {
      title: "Home",
      body: "Home",
      reservations,
      editReservation: reservation,
    });
  } else {
    res.redirect("/");
  }
});

// Updates an existing reservation.
router.post("/reservations/edit/:id", (req, res) => {
  const reservation = reservations.find(r => r.id == req.params.id);
  if (reservation) {
    reservation.customer_name = req.body.customer_name;
    reservation.car_model = req.body.car_model;
    reservation.reservation_date = req.body.reservation_date;
  }
});

// Deletes an existing reservation.
router.get("/reservations/delete/:id", (req, res) => {
  reservations = reservations.filter(r => r.id != req.params.id);
});

module.exports = router;