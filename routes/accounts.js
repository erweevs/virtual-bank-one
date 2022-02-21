const express = require('express');
const router = express.Router({mergeParams: true});

const {
    createAccount,
    getAccounts
} = require('../controllers/accountsController');

// mount the controller methods
router.route('/')
    .get(getAccounts)
    .post(createAccount);

module.exports = router;