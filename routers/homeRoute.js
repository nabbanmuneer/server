const express = require("express");
const router = express.Router();
const homeControllers = require('../controllers/homeControllers');


router.post('/get',homeControllers.dataGet);

router.post('/homeGet',homeControllers.homeData)

router.post('/filterJob',homeControllers.filterJob)

router.get('/search',homeControllers.searchData);

module.exports = router;