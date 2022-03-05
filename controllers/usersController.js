const path = require('path');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc Get all Users
// @route GET /api/v1/users
// @access Private
exports.getUsers = asyncHandler(async (req,res, next) => {
    // use the advancedResults middleware to get the data
    res.status(200).json(res.advancedResults);    
});

// @desc Get single Users
// @route GET /api/v1/users/:id
// @access Private
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
    const user = await User.findById(req.params.id);

    if (!user){
        return next(new ErrorResponse(`User with Id ${req.params.id} does not exist`, 404));
    }

    // use this as is to trigger cascading deletion middleware
    user.remove();

    res.status(200).json({
        success: true, 
        data: {}
    });  
});

// @desc Upload a photo for the User
// @route PUT /api/v1/users/:id/photo
// @access Private
exports.userPhotoupload = asyncHandler(async (req,res, next) => {
    const user = await User.findById(req.params.id);

    if (!user){
        return next(new ErrorResponse(`User with Id ${req.params.id} does not exist`, 404));
    }

    // check to see if file was uploaded
    if(!req.files){
        return next(new ErrorResponse('Please upload a file', 400));
    }

    const file = req.files.file;

    // ensure the file is a photo
    if(!file.mimetype.startsWith('image')){
        return next(new ErrorResponse('Please upload an image file type', 400));
    }

    // limit the file upload size
    if(file.size > process.env.FILE_UPLOAD_MAX_BYTE_SIZE){
        return next(new ErrorResponse(`Please upload a file less than ${process.env.FILE_UPLOAD_MAX_BYTE_SIZE}`, 400));
    }

    // create custom filename
    file.name = `photo_${user._id}${path.parse(file.name).ext}`;

    // upload the file
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
        if(err){
            console.error(err);
            return next(new ErrorResponse(`Problem with file upload`, 500));
        }

        await User.findByIdAndUpdate(req.params.id, {photo: file.name });

        res.status(200).json({
            success: true, 
            data: file.name
        });
    });
});