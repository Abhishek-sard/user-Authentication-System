const jwt = require("jsonwebtoken");
const User = require("../models/User");

//Generate JWT Token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//send token response
const sendTokenResponse = (user, statusCode, res) => {
  //Create token
  const token = signToken(user._id);

  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
};

//register user
//post/api/auth/register
//public

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    //create user
    const user = await User.create({
      name,
      email,
      password,
      role,
    });
    sendTokenResponse(user, 201, res);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//login user
//post/api/auth/login
//public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide an email and password",
      });
    }

    //check for user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    //check if password matches
    const isMatch = await user.correctPassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//get current logged in user
//get/api/auth/me
//protected

exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

//logout user / clear cookie
//get/api/auth/logout
//private

exports.logout = async (req, res, next ) => {
    try {
        res.cookie("token", "none", {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true
        });
        res.status(200).json({
            success: true,
            data: {}
        });
        
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
        
    }
};
