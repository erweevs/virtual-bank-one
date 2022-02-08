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
exports.createUser = (req,res, next) => {
    res.status(200).json({success: true, message: 'Add a new User'});
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