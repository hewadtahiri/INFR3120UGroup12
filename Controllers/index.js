const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("Layout", { title: "Home", body: "Home" });
});

module.exports = router;