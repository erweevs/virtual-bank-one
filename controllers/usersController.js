const User = require('../models/User');

// @desc Get all Users
// @route GET /api/v1/users
// @access Public
exports.getUsers = (req,res, next) => {
    res.status(200).json({success: true, message: 'Fetch all users'});
}

// @desc Get single Users
// @route GET /api/v1/users/:id
// @access Public
exports.getUser = (req,res, next) => {
    res.status(200).json({success: true, message: `Fetch user with id ${req.params.id}`});
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
        res.status(400).json({ 
            success: false
        });
    }
}

// @desc Update a User
// @route PUT /api/v1/users/:id
// @access Private
exports.updateUser = (req,res, next) => {
    res.status(200).json({success: true, message: `Update User: ${req.params.id}`});
}

// @desc Deletes a User
// @route DELETE /api/v1/users
// @access Private
exports.deleteUser = (req,res, next) => {
    res.status(200).json({success: true, message: `Deleting User: ${req.params.id}`});
}