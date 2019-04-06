"use strict";

// Import Mongoose
const mongoose = require("mongoose");

const lender = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  checkedOut: {
    type: Boolean
  }
});

// Late Plate model
const LatePlate = mongoose.model("LatePlate", {
  number: {
    type: Number,
    required: true
  },
  checkedOut: {
    type: Boolean,
    default: false
  },
  lenders: [lender]
});

module.exports = {
  LatePlate
};
