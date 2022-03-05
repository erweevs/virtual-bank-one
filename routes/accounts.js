const express = require('express');
const router = express.Router({mergeParams: true});

const Account = require('../models/Account');
const advancedResults = require('../middleware/advanceResults');

const {
    createAccount,
    getAccounts,
    deleteAccount
} = require('../controllers/accountsController');

// mount the controller methods
router.route('/')
    .get(advancedResults(Account, 'user'), getAccounts)
    .post(createAccount);

router.route('/:id')
    .delete(deleteAccount);

module.exports = router;