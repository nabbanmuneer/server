const express = require("express");
const router = express.Router();

const employerControllers = require('../controllers/employerControllers');

router.post('/register', employerControllers.employerRegister);

router.post('/otpverify',employerControllers.otpVerify);

router.post('/update',employerControllers.update);

router.post('/addJob',employerControllers.addJobForm);

router.post('/employeeProfile',employerControllers.employerProfile);

router.post('/jobData',employerControllers.jobData)

router.post('/editJob',employerControllers.editJob)

router.post('/jobData/delete',employerControllers.jobDelete)

module.exports = router;