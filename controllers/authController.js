const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const UserIdentity = require('../models/UserIdentity');

// @desc Register new User Identity
// @route POST /api/v1/auth/register
// @access Public
exports.register = asyncHandler(async (req,res, next) => {
    const {userName, role, password} = req.body;

    // create the Identity
    const identity = await UserIdentity.create({
        userName,
        role,
        password
    });

    // use helper method to send the response
    sendTokenResponse(identity, 200, res);    
});

// @desc Login User
// @route POST /api/v1/auth/login
// @access Public
exports.login = asyncHandler(async (req,res, next) => {
    const {userName, password} = req.body;

    // validate the userName and password
    if(!userName || !password){
        return next(new ErrorResponse('Please provide a user name and password', 400));
    }

    // check that the user's identity exists
    const identity = await UserIdentity.findOne({userName: userName}).select('+password');

    if(!identity){
        return next(new ErrorResponse('Invalid login credentials', 401));
    }

    // check the password
    const validPassword = await identity.validatePassword(password);

    if(!validPassword){
        return next(new ErrorResponse('Invalid login credentials', 401));
    }

    // use helper method to send the response
    sendTokenResponse(identity, 200, res);   
});

// @desc get current logged in User
// @route GET /api/v1/auth/me
// @access Private
exports.getMe = asyncHandler(async (req,res, next) => {
    const loggedInUser = await UserIdentity.findById(req.identity.id);

    res.status(200).json({
        success: true,
        data: loggedInUser
    });
});

// @desc Forgot password
// @route POST /api/v1/auth/forgotpassword
// @access Public
exports.forgotPassword = asyncHandler(async (req,res, next) => {
    const user = await UserIdentity.findOne({userName: req.body.userName});

    if(!user){
        return next(new ErrorResponse(`UserName: ${req.body.userName} doesn't exist.`, 404));
    }

    // get reset token
    const resetToken = user.getResetTokenPasswordToken();

    await user.save({validateBeforeSave: false});

    res.status(200).json({
        success: true,
        data: user
    });
});

// helper method to get the token from the model, create the cookie, and send the response
const sendTokenResponse = (identity, statusCode, res) => {
    // generate the token
    const token = identity.getSignedJwtToken();

    // this is just to make the calculation below more readable
    const dailyHours = 24;
    const minutesPerHour = 60;
    const secondsPerMinute = 60;
    const milliSecondsPerSecond = 1000;

    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE_DAYS * dailyHours * minutesPerHour * secondsPerMinute * milliSecondsPerSecond),
        httpOnly: true
    };

    // set the 'secure' property to true for the production version
    if(process.env.NODE_ENV === 'production'){
        cookieOptions.secure = true
    }

    res.status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
        success: true,
        token: token
    }); 
}