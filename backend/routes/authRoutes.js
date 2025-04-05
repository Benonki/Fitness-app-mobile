const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/', authController.getAllUsers);
router.post('/login', authController.login);
router.get('/check-login', authController.checkLoginAvailability);

module.exports = router;