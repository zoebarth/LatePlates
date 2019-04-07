"use strict";

// Express setup
const fs = require("fs");
const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const logger = require("morgan");
const mongoose = require("mongoose");

// Initialize Express
const app = express();

// mongoose configuration

mongoose.connection.on("connected", _ =>
  console.log("Success: connected to MongoDb!")
);
mongoose.connection.on("error", _ => {
  console.log("Error connecting to MongoDb. Check MONGODB_URI in env.sh");
  process.exit(1);
});
mongoose.connect(process.env.MONGODB_URI);

// Handlabars setup
app.engine(".hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", ".hbs");

app.use(logger("dev"));

// Parse req.body contents
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Read static files in /public
app.use(express.static(path.join(__dirname, "public")));

// All routes are in routes.js
const routes = require("./routes");
app.use("/", routes);

console.log("Express started. Listening on port", process.env.PORT || 3000);
app.listen(process.env.PORT || 3000);
