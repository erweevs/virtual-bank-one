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