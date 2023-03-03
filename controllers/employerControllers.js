const { smsOtp, otpValidiation } = require("../utils/otp");
const employeeModel = require("../models/employeeModel");
const employerModel = require("../models/employerModel");
const jobModel = require("../models/jobModel.js")
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require('dotenv');
const jwt_decode = require("jwt-decode");
const mongoose = require('mongoose');

const employerRegister = async (req, res) => {
    try {
        let { email } = req.body;
        let employerVerify = employerModel.findOne({ email: email });
        let employeeVerify = employeeModel.findOne({ email: email });
        if (employeeVerify && employerVerify) {
            const response = await smsOtp(email);
            console.log("status in email", response.status);
            if (response.status == true) {
                res.json({ status: true })
            } else {
                res.json({ status: false })
            }
        } else {
            console.log("Error");
        }
    } catch (error) {
        res.json({ status: false });
    }
};
exports.employerRegister = employerRegister;

const otpVerify = async (req, res) => {
    try {
        let { userName, email, password, phoneNo, otp } = req.body;
        let position = 'employer';
        const response = await otpValidiation(email, otp);
        if (response.status === true) {
            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);
            const data = new employerModel({ userName: userName, phoneNo: phoneNo, email: email, password: password, position: position });
            await data.save()
            res.json({ status: true })
        } else {
            res.json({ status: false })
        }
    } catch (error) {
        res.json({ status: false })
    }
}
exports.otpVerify = otpVerify


const update = async (req, res) => {
    try {
        let { userName, id, place, details, logoUrl } = req.body;
        const data = await employerModel.findByIdAndUpdate(id, {
            $set: {
                userName: userName,
                place: place,
                details: details,
                logoUrl: logoUrl
            }
        })
        res.json({ data })
    } catch (error) {
        console.log(error);
    }
}
exports.update = update


const addJobForm = async (req, res) => {
    try {
        const status = "Pending";
        const { jobTitle, Category, jobType, workPlacetype, amount, salaryType, decrption, duration, id } = req.body;
        const jobdata = new jobModel({
            jobTitle: jobTitle,
            Category: Category,
            jobType: jobType,
            workPlacetype: workPlacetype,
            amount: amount,
            salaryType: salaryType,
            decrption: decrption,
            duration: duration,
            id: id,
            status: status,
        });
        await jobdata.save().then(() => {
            res.status(200).json({jobdata})
        })
    } catch (error) {
        console.log(error);
        res.sendStatus(400)
    }
}
exports.addJobForm = addJobForm

const employerProfile = async (req, res) => {
    try {
        const token = req.headers.token
        const decoded = jwt_decode(token);
        let userData = decoded.UserInfo;
        let data = await employerModel.aggregate([
            {
                $match: {
                    email: userData.email
                }
            }, {
                $lookup: {
                    from: 'jobs',
                    localField: '_id',
                    foreignField: 'id',
                    as: 'job'
                }
            }
        ]);
        console.log("data", data[0].email);
        res.json({ data });
    } catch (error) {
        console.log(error);
    }
}
exports.employerProfile = employerProfile


const jobData = async (req, res) => {
    try {
        let { id, userId } = req.body;
        id = mongoose.Types.ObjectId(id)
        userId = mongoose.Types.ObjectId(userId)
        const jobsData = await jobModel.findById(id);

        const job = await jobModel.aggregate([{
            $unwind: "$bid"
        },
        {
            "$match": {
                "_id": id
            }
        }]);
        res.json({ jobsData, job })
    } catch (error) {
        // res.json({status : false })
        console.log(error);
    }
}
exports.jobData = jobData

const editJob = async (req, res) => {
    try {
        let { jobTitle,
            Category,
            jobType,
            workPlacetype,
            amount,
            salaryType,
            decrption,
            duration, id } = req.body
        const jobUpdate = await jobModel.findByIdAndUpdate(id, {
            $set: {
                jobTitle: jobTitle,
                Category: Category,
                jobType: jobType,
                workPlacetype: workPlacetype,
                amount: amount,
                salaryType: salaryType,
                decrption: decrption,
                duration: duration,
            }
        }).then(res.json({ status: true }))

    } catch (error) {
        console.log(error);
    }
}
exports.editJob = editJob;

const jobDelete = async(req,res)=> {
    try{

        let { id } = req.body;
        console.log("id",req.body);
        const data = await jobModel.findByIdAndDelete(id);
        res.send({statue:true})
    }catch(error){
        console.log(error);
    }

}
exports.jobDelete = jobDelete;