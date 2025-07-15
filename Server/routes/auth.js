const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');



router.post('/register', authController.register);

router.post('/login', authController.login);

router.get('/users', authController.getAllUsers);

router.post('/forgot-password', authController.forgotPassword);

router.get('/verify-email/:token', authController.verifyEmail);

router.get('/reset-password/:id/:token', authController.resetPasswordGet);

router.put('/reset-password/:id/:token', authController.resetPasswordPut);



module.exports = router;