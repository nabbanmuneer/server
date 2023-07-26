const employeeModel = require('../models/employeeModel')
const employerModel = require('../models/employerModel');
const jobModel = require("../models/jobModel")
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require('dotenv');
const jwt_decode = require("jwt-decode");
dotenv.config();

const adminLogin = async (req, res) => {
    try {
        const { loginId, adminPassword } = req.body;
        console.log(loginId, "sfdsd", process.env.LOGIN);
        if (loginId == process.env.LOGIN && adminPassword == process.env.PASSWORD) {
            console.log(process.env.LOGIN, process.env.PASSWORD);
            res.sendStatus(200);
        } else {
            res.sendStatus(401);
        }
    } catch (error) {
        res.sendStatus(404);
    }
}
exports.adminLogin = adminLogin;


const adminData = async (req, res) => {
    try {
        const employee = await employeeModel.find({});
        const employeeCount = await employeeModel.find({}).count();
        const employer = await employerModel.find({})
        const employerCount = await employerModel.find({}).count();
        const job = await jobModel.find({});
        const jobCount = await jobModel.find({}).count(); 
        res.status(201).json({ employee,employeeCount,employer,employerCount,job,jobCount })
    } catch (error) {
        res.sendStatus(404);
    }
}
exports.adminData = adminData;
