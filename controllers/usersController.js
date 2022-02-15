const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// @desc Get all Users
// @route GET /api/v1/users
// @access Public
exports.getUsers = async (req,res, next) => {
    try{
        const users = await User.find();
        res.status(200).json({
            success: true, 
            count: users.length,
            data: users
        });
    } catch(err){
        next(err);
    }    
}

// @desc Get single Users
// @route GET /api/v1/users/:id
// @access Public
exports.getUser = async (req,res, next) => {
    try{
        const user = await User.findById(req.params.id);

        if(!user){
            return next(new ErrorResponse(`User with Id ${req.params.id} does not exist`, 404));
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch(err){
        next(err);
    }    
}

// @desc Create new User
// @route POST /api/v1/users
// @access Private
exports.createUser = async (req,res, next) => {
    try{
        const user = await User.create(req.body);

        res.status(201).json({
            success: true, 
            data: user
        });
    } catch(err){
        next(err);
    }
}

// @desc Update a User
// @route PUT /api/v1/users/:id
// @access Private
exports.updateUser = async (req,res, next) => {
    try{
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
            data: user});
    }catch(err){
        next(err);
    }    
}

// @desc Deletes a User
// @route DELETE /api/v1/users
// @access Private
exports.deleteUser = async (req,res, next) => {
    try{
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user){
            return next(new ErrorResponse(`User with Id ${req.params.id} does not exist`, 404));
        }

        res.status(200).json({
            success: true, 
            data: {}
        });
    }catch(err){
        next(err);
    }    
}