const Account = require('../models/Account');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc Get all Accounts
// @route GET /api/v1/accounts
// @route GET /api/v1/users/:userId/accounts
// @access Private
exports.getAccounts = asyncHandler(async (req, res, next) => {
    let query = {};

    // first see if we should fetch accouts for a specific user
    if(req.params.userId){
        query = Account.find({
            user: req.params.userId
        });
    } else{
        // else get all the accounts
        query = Account.find().populate('user');
    }

    const accounts = await query;

    res.status(200).json({
        success: true,
        count: accounts.length,
        data: accounts
    });
});

// @desc Get all Accounts
// @route GET /api/v1/accounts
// @access Private
exports.createAccount = asyncHandler(async (req, res, next) => {
    const account = await Account.create(req.body);

    res.status(201).json({
        success: true,
        data: account
    });
});

// @desc Get all Accounts
// @route GET /api/v1/accounts
// @access Private
exports.deleteAccount = asyncHandler(async (req, res, next) => {
    // TODO: add deletion
});