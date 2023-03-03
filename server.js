const express=require("express");
const mongoose=require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path')
const corsOptions = require("./config/corsOption");
const employeeRoute = require('./routers/employeeRoute');
const employerRoute=require('./routers/employerRoute')
const credentials =require('./middlewares/credentials')
const homeRoute = require('./routers/homeRoute')
const cookieParser = require("cookie-parser");

const app=express();
dotenv.config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(credentials);
app.use(cors(corsOptions));
app.use(cookieParser());
app.use("/employee",employeeRoute);
app.use("/employer",employerRoute);
app.use("/home",homeRoute);
app.use(express.json());
app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/', require('./routers/roots'));
app.use('/auth', require('./routers/auth'));
app.use('/refresh', require('./routers/refresh'));
app.use('/logout', require('./routers/logout'));


app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});


mongoose.connect(process.env.CONNECTDB).then(()=>{
    mongoose.set('strictQuery', false);
    app.listen(process.env.PORT,()=>{
        
        console.log("listing port 3000")
    });
});
