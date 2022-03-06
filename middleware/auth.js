const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const UserIdentity = require('../models/UserIdentity');

// protect routes
exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    // else if(req.cookies.token){
    //     token = req.cookies.token
    // }

    // ensure the token exists
    if(!token){
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    // verify the token
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.identity = await UserIdentity.findById(decoded.id);

        next();
    }catch(err){
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }
});