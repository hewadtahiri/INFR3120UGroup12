const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("Layout", { title: "Home", body: "Home" });
});

router.get("/Cars", (req, res) => {
  res.render("Layout", { title: "Cars", body: "Cars" });
});

router.get("/Reservations", (req, res) => {
  res.render("Layout", { title: "Reservations", body: "Reservations" });
});

router.get("/Login", (req, res) => {
  res.render("Layout", { title: "Login", body: "Login" });
});

module.exports = router;