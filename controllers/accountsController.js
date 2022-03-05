const Account = require('../models/Account');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const accountTypes = require('../enums/accountTypes');

// @desc Get all Accounts
// @route GET /api/v1/accounts
// @route GET /api/v1/users/:userId/accounts
// @access Private
exports.getAccounts = asyncHandler(async (req, res, next) => {
    // first see if we should fetch accouts for a specific user
    if(req.params.userId){
        const accounts = await Account.find({
            user: req.params.userId
        });

        return res.status(200).json({
            success: true,
            count: accounts.length,
            data: accounts
        });
    } else{
        // else get all the accounts using the advancedResults middleware
        res.status(200).json(res.advancedResults);
    }
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
    const account = await Account.findById(req.params.id);

    if (!account){
        return next(new ErrorResponse(`Account with Id ${req.params.id} does not exist`, 404));
    }

    // use this as is to trigger cascading deletion middleware
    // TODO: add cascading middleware if need be
    account.remove();

    res.status(200).json({
        success: true, 
        data: {}
    });
});

// @desc Get all Account Types
// @route GET /api/v1/accounts/types
// @access Public
exports.getAccountTypes = asyncHandler(async (req, res, next) => {
    const types = Object.keys(accountTypes);

    res.status(200).json({
        success: true, 
        data: types
    });
});