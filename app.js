const express = require("express");
const path = require("path");
const routes = require("./Controllers/index");
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "Views"));

app.use(express.static(path.join(__dirname, "Public")));
app.use("/", routes);

// Parses URL-encoded form data.
app.use(express.urlencoded({ extended: true }));

let reservations = [];

// Renders Home view with reservations data.
app.get("/", (req, res) => {
  res.render("Home", { reservations });
});

// Adds new reservation and redirects to home.
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

// Renders Edit view for a reservation by ID.
app.get("/reservations/edit/:id", (req, res) => {
  const reservation = reservations.find(r => r.id == req.params.id);
  res.render("Edit", { reservation });
});

// Updates a reservation by ID and redirects to home.
app.post("/reservations/edit/:id", (req, res) => {
  const reservation = reservations.find(r => r.id == req.params.id);
  if (reservation) {
    reservation.customer_name = req.body.customer_name;
    reservation.car_model = req.body.car_model;
    reservation.reservation_date = req.body.reservation_date;
  }
  res.redirect("/");
});

// Deletes a reservation by ID and redirects to home.
app.get("/reservations/delete/:id", (req, res) => {
  reservations = reservations.filter(r => r.id != req.params.id);
  res.redirect("/");
});

module.exports = { app, reservations };