const employeeModel = require('../models/employeeModel')
const jobModel = require("../models/jobModel")
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_SID } = process.env

const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

const employeeRegister = async (req, res) => {
    try {
        let { email, phoneNo } = (req.body);
        const userVerify = await employeeModel.findOne({ email: email, phoneNo: phoneNo });
        if (!userVerify) {
            await client.verify.v2
                .services(TWILIO_SERVICE_SID)
                .verifications.create({ to: `+91${phoneNo}`, channel: 'sms' });
            res.json({ status: true });
        } else {
            res.json({ status: false });
        }

    } catch (error) {
        res.json({ status: false });
    }
}
exports.employeeRegister = employeeRegister


const otpVerify = async (req, res) => {
    try {
        console.log("data", req.body);
        let { phoneNo, otp } = req.body
        mobile = Number(phoneNo);
        const verification_check = await client.verify.v2
            .services(TWILIO_SERVICE_SID)
            .verificationChecks.create({ to: `+91${mobile}`, code: otp });
        if (verification_check.status == "approved") {
            const position = "employee";
            let { userName, email, password } = req.body;
            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);
            const data = new employeeModel({ phoneNo: phoneNo, userName: userName, email: email, password: password, position: position });
            await data.save();
            return res.json({ status: true })
        }
    } catch (error) {
        res.json({ status: false })
    }
}
exports.otpVerify = otpVerify


const employeeUpdate = async (req, res) => {
    try {
        let { userName, place, qualification, resume, profilePic, id } = req.body;
        const data = await employeeModel.findByIdAndUpdate(id, {
            $set: {
                userName: userName,
                place: place,
                qualification: qualification,
                resume: resume,
                profilePic: profilePic

            }
        }, { new: true })
    } catch (error) {
        console.log(error);
    }
}
exports.employeeUpdate = employeeUpdate;


const bidPost = async (req, res) => {
    try {
        let { bidValue, userId, jobId,userName } = req.body;
        console.log(req.body);
        await jobModel.findByIdAndUpdate(jobId, {
            $push: {
                "bid": {
                    bidValue: bidValue,
                    userId: userId,
                    user:userName
                }
            }
        }, { new: true }).then(
            res.json({ status: true })
        )
    } catch (error) {
        res.json({ status: false });
    }
}
exports.bidPost = bidPost

const employeeProfile = async (req, res) => {
    try {
        let { id } = req.body;
        const user = await employeeModel.findById(id);

        const job = await jobModel.aggregate([{
            $unwind: "$bid"
        }, {
            "$match": {
                "bid.userId": user._id
            }
        }]);
        const data = { user, job };
        res.json({ data });
    } catch (error) {
        console.log(error);
    }
}
exports.employeeProfile = employeeProfile

const jobsData = async (req,res)=>{
    try{
        const data = await jobModel.find();
        res.send({data});
    }catch(error){
        console.log(error);
    }
}
exports.jobsData = jobsData