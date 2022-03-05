const express = require('express');
const router = express.Router();

const { 
    getUsers, 
    getUser, 
    createUser, 
    updateUser, 
    deleteUser,
    userPhotoupload
} = require('../controllers/usersController');

// include other area router
const accountRouter = require('./accounts');

// re-route into other area routers
router.use('/:userId/accounts', accountRouter);

router.route('/:id/photo').put(userPhotoupload);

// mount the controller methods
router.route('/')
    .get(getUsers) // mount the GET call to the route /
    .post(createUser); // mount the POST call to the route /

router.route('/:id')
    .get(getUser) // mount the GET call to the route /:id
    .put(updateUser) // mount the PUT call to the route /:id
    .delete(deleteUser); // mount the DELETE call to the route /:id

module.exports = router;