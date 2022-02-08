const express = require('express');
const router = express.Router();

const { 
    getUsers, 
    getUser, 
    createUser, 
    updateUser, 
    deleteUser
} = require('../controllers/usersController');

// mount the controller methods
router.route('/')
    .get(getUsers) // mount the GET call to the route /
    .post(createUser); // mount the POST call to the route /

router.route('/:id')
    .get(getUser) // mount the GET call to the route /:id
    .put(updateUser) // mount the PUT call to the route /:id
    .delete(deleteUser); // mount the DELETE call to the route /:id

module.exports = router;