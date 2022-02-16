const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc Get all Users
// @route GET /api/v1/users
// @access Public
exports.getUsers = asyncHandler(async (req,res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true, 
        count: users.length,
        data: users
    });    
});

// @desc Get single Users
// @route GET /api/v1/users/:id
// @access Public
exports.getUser = asyncHandler(async (req,res, next) => {
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorResponse(`User with Id ${req.params.id} does not exist`, 404));
    }
    
    res.status(200).json({
        success: true,
        data: user
    });   
});

// @desc Create new User
// @route POST /api/v1/users
// @access Private
exports.createUser = asyncHandler(async (req,res, next) => {
    const user = await User.create(req.body);

    res.status(201).json({
        success: true, 
        data: user
    });
});

// @desc Update a User
// @route PUT /api/v1/users/:id
// @access Private
exports.updateUser = asyncHandler(async (req,res, next) => {
    let requestbody = req.body;
    requestbody['updatedAt'] = Date.now();

    const user = await User.findByIdAndUpdate(
        req.params.id, // find by Id
        requestbody, // and update to
        {
            new: true,
            runValidators: true
        }
    );

    if (!user){
        return next(new ErrorResponse(`User with Id ${req.params.id} does not exist`, 404));
    }

    res.status(200).json({
        success: true, 
        data: user
    });   
});

// @desc Deletes a User
// @route DELETE /api/v1/users
// @access Private
exports.deleteUser = asyncHandler(async (req,res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user){
        return next(new ErrorResponse(`User with Id ${req.params.id} does not exist`, 404));
    }

    res.status(200).json({
        success: true, 
        data: {}
    });  
});