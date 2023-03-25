const employeeModel = require('../models/employeeModel')
const employerModel = require('../models/employerModel');
const jobModel = require("../models/jobModel")
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require('dotenv');
const jwt_decode = require("jwt-decode");
dotenv.config();

const dataGet = async (req, res) => {
    try {
        const token = req.headers.token
        const decoded = jwt_decode(token);
        let userData = decoded.UserInfo;
        if (userData.role == 'employee') {
            let data = await employeeModel.findOne({ email: userData.email });
            res.json({ data });
        } else if (userData.role === "employer") {
            let data = await employerModel.findOne({ email: userData.email });
            res.json({ data });
        }
    } catch (error) {
        res.sendStatus(404);
    }
}
exports.dataGet = dataGet;

const homeData = async (req, res) => {
    try {
        const data1 = await jobModel.aggregate([{
            $match: {
                jobType: "full Time"
            }
        }, {
            $group: {
                _id: "$Category",
            }
        }])
        const data2 = await jobModel.aggregate([{
            $match: {
                jobType: "part Time"
            }
        }, {
            $group: {
                _id: "$Category",
            }
        }])
        res.json({ data1, data2 });
    } catch (error) {
        res.json({ status: false })
    }

}
exports.homeData = homeData

const filterJob = async (req, res) => {
    try {
        let { role, id } = req.body;
        if (role == "Category") {
            const data = await jobModel.find({ Category: id });
            res.json({ data: data })
        }
    } catch (error) {
        res.sendStatus(404);
    }
}
exports.filterJob = filterJob

const searchData = async (req, res) => {
    try {
        const employeeData = await employeeModel.find();
        const employerData = await employerModel.find();
        const jobData = await jobModel.find();
        let result = { employeeData, employerData, jobData }
        const data = {...result}
        res.send({ data })
    } catch (error) {
        res.sendStatus(404);
    }
}
exports.searchData = searchData ;