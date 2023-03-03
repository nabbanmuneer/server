const employeeModel = require('../models/employeeModel');
const employerModel = require('../models/employerModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
  const cookies = req.cookies;
  console.log(cookies,"handle login");
  const { email, password } = req.body;
  console.log("auth", req.body);
  if (!email || !password) {
    return res.status(400).json({ 'message': 'Username and password are required.' });
  }
  let foundUser = '';

  const employee = await employeeModel.findOne({ email: email }).exec();
  const employer = await employerModel.findOne({ email: email }).exec();
  console.log("data emple", employee , "data emlor",employer);
  if(employee){
    foundUser = employee;
  }else if(employer){
    foundUser = employer;
  }
  if (!foundUser) return res.sendStatus(401); //Unauthorized 
  // evaluate password 
  const match = bcrypt.compare(password, foundUser.password);
  if (match) {
    // const roles = Object.values(foundUser.roles).filter(Boolean);
    // create JWTs
    let userName = foundUser.userName;
    let position = foundUser.position;

    const accessToken = jwt.sign(
      {
        "UserInfo": {
          "userName": foundUser.userName,
          "role": foundUser.position,
          "email": foundUser.email,
        }
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '5d' }
    );
    const newRefreshToken = jwt.sign({ id: foundUser.id }, "abcd1234", {
      expiresIn: "6d",
    });


    // Changed to let keyword
    let newRefreshTokenArray = !cookies?.jwt
      ? foundUser.refreshToken
      : foundUser.refreshToken.filter((rt) => rt !== cookies.jwt);

    if (cookies?.jwt) {

      /* 
      Scenario added here: 
          1) employeeModel logs in but never uses RT and does not logout 
          2) RT is stolen
          3) If 1 & 2, reuse detection is needed to clear all RTs when userName logs in
      */
      const refreshToken = cookies.jwt;
      const foundToken = await employeeModel.findOne({ refreshToken }).exec();

      // Detected refresh token reuse!
      if (!foundToken) {
        // clear out ALL previous refresh tokens
        newRefreshTokenArray = [];
      }
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
    }

    // Saving refreshToken with current userName
    foundUser.refreshToken = [newRefreshTokenArray, newRefreshToken];
    const result = await foundUser.save();

    // Creates Secure Cookie with refresh token
    res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    // Send authorization roles and access token to userName
    console.log("last",accessToken, foundUser);
    res.json({ accessToken, foundUser });

  } else {
    res.sendStatus(401);
  }
};

const refreshToken = async (req, res) => {
  console.log("hello");
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

  const foundUser = await User.findOne({ refreshToken }).exec();

  // Detected refresh token reuse!
  if (!foundUser) {
    jwt.verify(refreshToken, "abcd1234", async (err, decoded) => {
      if (err) return res.sendStatus(403);
      const hackedUser = await User.findOne({
        id: decoded.id,
      }).exec();
      hackedUser.refreshToken = [];
      const result = await hackedUser.save();
    });
    return res.sendStatus(403); //Forbidden
  }

  const newRefreshTokenArray = foundUser.refreshToken.filter(
    (rt) => rt !== refreshToken
  );

  jwt.verify(refreshToken, "abcd1234", async (err, decoded) => {
    if (err) {
      foundUser.refreshToken = [...newRefreshTokenArray];
      const result = await foundUser.save();
    }
    if (err || foundUser.id !== decoded.id) return res.sendStatus(403);

    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: decoded.id,
        },
      },
      "abcd1234",
      { expiresIn: "5d" }
    );
    S;
    const newRefreshToken = jwt.sign({ id: foundUser.id }, "abcd1234", {
      expiresIn: "15s",
    });
    // Saving refreshToken with current user
    foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    const result = await foundUser.save();

    // Creates Secure Cookie with refresh token
    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken, foundUser });
  });
};
module.exports = { handleLogin, refreshToken };