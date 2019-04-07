"use strict";

// Routes, with inline controllers for each route.
const express = require("express");
const router = express.Router();
const LatePlate = require("./models").LatePlate;
const strftime = require("strftime");
const moment = require('moment-timezone');
const bodyParser = require("body-parser");

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
      array.forEach(item => {
        item.lenders.forEach(lender => {
          lender.formattedDate = moment(lender.date).format('dddd MMMM Do, YYYY');
        })
        item.returners.forEach(returner => {
          returner.formattedDate = moment(returner.date).format('dddd MMMM Do, YYYY');
        })
      })
      res.render('index', {items: array});
    });
});

//View a single late plate
router.get("/lateplate/:lateplateid", (req, res) => {
  LatePlate.findById(req.params.lateplateid, (err, lateplate) => {
    lateplate.lenders.forEach(item => {
      item.formattedDate = moment(item.date).format('dddd MMMM Do, YYYY');
    });
    lateplate.returners.forEach(item => {
      item.formattedDate = moment(item.date).format('dddd MMMM Do, YYYY');
    });
    res.render('lateplate.hbs', {lateplate: lateplate});
  });
});

router.get("/checkout/:lateplateid", (req, res) => {
  LatePlate.findById(req.params.lateplateid, (err, lateplate) => {
    res.render('checkout.hbs', {lateplate: lateplate});
  });
});

//Check Out a Late Plate
router.post("/checkout/:lateplateid", (req, res) => {
LatePlate.findById(req.params.lateplateid, (err, lateplate) => {
    const lender = {
      name: req.body.name,
      date: Date.now()
    };
    lateplate.status= "Checked Out";
    lateplate.lastLender = lender;
    lateplate.lenders.unshift(lender);
    lateplate.save(err => {
      if (err) {
        res.locals.errors = err.errors;
      }
    });
    res.render('checkedout.hbs', {lateplate: lateplate, lender: lender});
  });
});

//Check in a late plate
router.get("/checkin", (req, res) => {
  const sortObject = {number : 1};
  LatePlate.find().sort(sortObject).exec((err, array) => {
      res.render('checkin.hbs', {items: array});
    });
});

router.post("/checkin", (req, res) => {
  const returner = {
    name: req.body.name,
    date: Date.now()
  };
  LatePlate.findById(req.body.id, (err, lateplate) => {
    lateplate.status = "Available";
    lateplate.returners.unshift(returner);
    lateplate.lastReturner = returner;
    lateplate.save(err => {
      if (err) {
        res.locals.errors = err.errors;
      }
    });
    return res.render('checkedin.hbs', {returner: returner, lateplate: lateplate});
  });
});

module.exports = router;
