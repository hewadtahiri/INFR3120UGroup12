// server.js
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true })); // To parse form data

let reservations = [];

// Home route
app.get("/", (req, res) => {
  res.render("Home", { reservations });
});

// Create reservation
app.post("/reservations", (req, res) => {
  const newReservation = {
    id: Date.now(), // Unique ID 
    customer_name: req.body.customer_name,
    car_model: req.body.car_model,
    reservation_date: req.body.reservation_date,
  };
  reservations.push(newReservation);
  res.redirect("/");
});

// Edit reservation page
app.get("/reservations/edit/:id", (req, res) => {
  const reservation = reservations.find(r => r.id == req.params.id);
  res.render("Edit", { reservation });
});

// Update reservation
app.post("/reservations/edit/:id", (req, res) => {
  const reservation = reservations.find(r => r.id == req.params.id);
  if (reservation) {
    reservation.customer_name = req.body.customer_name;
    reservation.car_model = req.body.car_model;
    reservation.reservation_date = req.body.reservation_date;
  }
  res.redirect("/");
});

// Delete reservation
app.get("/reservations/delete/:id", (req, res) => {
  reservations = reservations.filter(r => r.id != req.params.id);
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
