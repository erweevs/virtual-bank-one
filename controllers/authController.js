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

    // generate the token
    const token = identity.getSignedJwtToken();

    res.status(200).json({
        success: true,
        token: token
    });    
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

    // generate the token
    const token = identity.getSignedJwtToken();

    res.status(200).json({
        success: true,
        token: token
    });    
});