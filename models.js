"use strict";

// Import Mongoose
const mongoose = require("mongoose");

const lender = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.today
  }
});

const returner = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.today
  }
});

// Late Plate model
const LatePlate = mongoose.model("LatePlate", {
  number: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: "Available"
  },
  lenders: [lender],
  returners: [returner]
});

module.exports = {
  LatePlate
};
