"use strict";

// Routes, with inline controllers for each route.
const express = require("express");
const router = express.Router();
const LatePlate = require("./models").LatePlate;
const strftime = require("strftime");

// Randomly generates a new lateplate
router.get("/create-test-lateplate", (req, res) => {
  const test = new LatePlate({
    number: Math.floor(Math.random() * 100)
  });
  test.save(err => {
    if (err) {
      return res.status(500).json(err);
    }
    return res.send("Success: created a LatePlate object in MongoDb");
  });
});

// View all late plates
router.get("/", (req, res) => {
  const sortObject = {number : 1};
  LatePlate.find().sort(sortObject).exec((err, array) => {
      res.render('index', {items: array});
    });
});

//View a single late plate
router.get("/lateplate/:lateplateid", (req, res) => {
  LatePlate.findById(req.params.lateplateid, (err, lateplate) => {
    res.render('lateplate.hbs', {lateplate: lateplate});
  });
});


module.exports = router;
