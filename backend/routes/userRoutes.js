const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', userController.createUser);

router.use(authMiddleware.authenticate);

router.get('/:userId', userController.getUser);
router.put('/:userId', userController.updateUser);
router.patch('/:userId/reset-daily', userController.resetDaily);

module.exports = router;