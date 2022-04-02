const express = require('express');
const {protect, authorize} = require('../middleware/auth');

const {
    register,
    login,
    getMe,
    forgotPassword,
    resetPassword,
    logout
} = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.get('/me', protect, getMe);
router.get('/logout', logout);
router.put('/resetpassword/:resetToken', resetPassword);

module.exports = router;