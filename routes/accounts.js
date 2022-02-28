const express = require('express');
const router = express.Router({mergeParams: true});

const {
    createAccount,
    getAccounts,
    deleteAccount
} = require('../controllers/accountsController');

// mount the controller methods
router.route('/')
    .get(getAccounts)
    .post(createAccount);

router.route('/:id')
    .delete(deleteAccount);

module.exports = router;