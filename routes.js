"use strict";

// Routes, with inline controllers for each route.
const express = require("express");
const router = express.Router();
const LatePlate = require("./models").LatePlate;
const strftime = require("strftime");
const moment = require('moment-timezone');

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
        item.status = item.checkedOut? "Checked Out" : "Available";
        item.lenders.reverse();
        item.lastLender = item.lenders[0];
        if (item.lastLender != null) {
          item.lastLenderName = item.lastLender.name;
          item.lastLenderDate = item.lastLender.date;
        }
      });
      res.render('index', {items: array});
    });
});

//View a single late plate
router.get("/lateplate/:lateplateid", (req, res) => {
  LatePlate.findById(req.params.lateplateid, (err, lateplate) => {
    lateplate.lenders.forEach(item => {
      item.formattedDate = moment(item.date).format('MMMM Do, YYYY');
    });
    lateplate.lenders.reverse();
    const lastLender = lateplate.lenders[0];
    const lastLenderName = "";
    if (lateplate.lastLender != null) {
      lastLenderName = lastLender.name;
    }
    const status = lateplate.checkedOut? "Checked Out" : "Available";
    res.render('lateplate.hbs', {lateplate: lateplate, status: status, lastLender: lastLenderName});
  });
});

router.get("/checkout/:lateplateid", (req, res) => {
  LatePlate.findById(req.params.lateplateid, (err, lateplate) => {
    const status = lateplate.checkedOut? "Checked Out" : "Available";
    res.render('checkout.hbs', {lateplate: lateplate, status: status});
  });
});

//Check Out a Late Plate
router.post("/checkout/:lateplateid", (req, res) => {
LatePlate.findById(req.params.lateplateid, (err, lateplate) => {
    const lender = {
      name: req.body.name
    };
    lateplate.checkedOut = true;
    lateplate.lenders.push(lender);
    lateplate.save(err => {
      if (err) {
        res.locals.errors = err.errors;
        res.locals.project = project;
      }
    });
    lateplate.lenders.forEach(item => {
      item.formattedDate = moment(item.date).format('MMMM Do, YYYY');
    });
    const status = lateplate.checkedOut? "Checked Out" : "Available";
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
  const lateplate = LatePlate.findOne({'number': req.body.number});
  const returner = {
    name: req.body.name,
  };
  return res.render('checkedin.hbs', {returner: returner, lateplate: lateplate});
});

module.exports = router;
