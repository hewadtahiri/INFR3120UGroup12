const express = require("express");
const path = require("path");
const routes = require("./Controllers/index");
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "Views"));

app.use(express.static(path.join(__dirname, "Public")));
app.use("/", routes);

module.exports = app;