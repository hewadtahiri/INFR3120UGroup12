const express = require("express");
const router = express.Router();
const { reservations } = require("../app");

router.get("/", (req, res) => {
  res.render("Layout", { title: "Home", body: "Home", reservations });
});

module.exports = router;