const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const employerSchema = new Schema(
  {
    userName: {
      type: String,
      trim: true,
      require: true
    },

    phoneNo: {
      type: Number,
      require: true
    },

    email: {
      type: String,
      trim: true,
      require: true
    },
    password: {
      type: String,
      trim: true
    },
    position: {
      type: String,
      trim: true,
      require: true
    },
    logoUrl: {
      type: String,
      trim: true,
    },
    place: {
      type: String,
      trim: true,
    },
    details:{
      type: String
    }
  },
  { timestamps: true }
);

const employer = mongoose.model("employer", employerSchema);
module.exports = employer;