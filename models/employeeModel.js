const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const employeeSchema = new Schema(
  {
    userName: {
      type: String,
      trim: true,
      require: true
    },

    phoneNo: {
      type: Number,
      trim: true,
      require: true
    },

    email: {
      type: String,
      trim: true,
      require: true
    },
    password: {
      type: String,
      trim: true,
    },
    position: {
      type: String
    },
    place: {
      type: String,
      trim: true,
    },
    qualification: {
      type: String,
      trim: true,
    },
    profilePic: {
      type: String,
      trim: true,
    },
    resume: {
      type: String,
      trim: true,
    },
  },{ timestamps: true }
);

const employee = mongoose.model("employee", employeeSchema);
module.exports = employee;