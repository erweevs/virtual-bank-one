const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc Get all Users
// @route GET /api/v1/users
// @access Public
exports.getUsers = asyncHandler(async (req,res, next) => {
    // copy the request query
    const requestQuery = {...req.query};

    // array of fields to exclude from filtering
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // remove the nessecary fields so that we dont send it to MongoDB
    removeFields.forEach(param => delete requestQuery[param]);

    let query = User.find(requestQuery).populate('accounts');

    // filter the returned data if there is a select query present
    if(req.query.select){
        // format the select parameters to fit the format Mongo requires
        const selectFields = req.query.select.split(',').join(' ');

        // mount the select paramters to the query
        query = query.select(selectFields);
    }

    // sort the data id the sort parameter is present
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ');

        query = query.sort(sortBy);
    } else{
        // default sort by updatedAt
        query = query.sort('-updatedAt');
    }

    // for pagination, get the page number and amout per page
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10; // default to 10 per page
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const total = await User.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // execut the query
    const users = await query;

    const paginationResult = {};

    // add the pagination details to the response
    if(endIndex < total){
        paginationResult.next = {
            page: page + 1,
            limit: limit
        };
    }

    if(startIndex > 0){
        paginationResult.prev = {
            page: page - 1,
            limit: limit
        };
    }

    res.status(200).json({
        success: true, 
        count: users.length,
        pagination: paginationResult,
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