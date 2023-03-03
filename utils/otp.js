const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const otpModel = require("../models/otpModel");
dotenv.config();

let transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: process.env.NODEMAILER_PORT,
  secure: true,
  service: "Gmail",

  auth: {
    user: process.env.NODEMAILER_AUTH_USER,
    pass: process.env.NODEMAILER_AUTH_PASS,
  },
});

const smsOtp = async (email) => {
  try {
    const otp = otpGenerator.generate(4, {
      digits: true, alphabets: false, upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false,
    });

    const mailOption = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "verification OTP code",
      html: `<p>Your verification code <b>${otp}</b> from Let's Hire. It will Expire within 5 mins</p>`,
    };
    transporter.sendMail(mailOption, (error, info) => {
      console.log("nodemailer");
      if (error) {
        return { status: false };
      }
    });
    const Otpdata = new otpModel({ email: email, otp: otp });
    const salt = await bcrypt.genSalt(10);
    Otpdata.otp = await bcrypt.hash(Otpdata.otp, salt);
    await Otpdata.save();
    return { status: true };
  } catch (error) {
    console.log("error in mail", error);
    return { status: false };
  }
};
exports.smsOtp = smsOtp;

const otpValidiation = async (email, otp) => {
  try {
    const otpData = await otpModel.findOne({ email: email });
    console.log("otp validation data", otpData)
    let validate = bcrypt.compare(otp, otpData.otp)
    if (validate) {
      return { status: true };
    }
  } catch (error) {
    return { status: false };
  }
};
exports.otpValidiation = otpValidiation;
