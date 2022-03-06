const express = require('express');
const router = express.Router({mergeParams: true});

const Account = require('../models/Account');
const advancedResults = require('../middleware/advanceResults');
const {protect} = require('../middleware/auth');

const {
    createAccount,
    getAccounts,
    deleteAccount,
    getAccountTypes
} = require('../controllers/accountsController');

// mount the controller methods
router.route('/')
    .get(advancedResults(Account, 'user'), getAccounts)
    .post(protect, createAccount);

router.route('/:id')
    .delete(protect, deleteAccount);

router.route('/types')
    .get(getAccountTypes);

module.exports = router;