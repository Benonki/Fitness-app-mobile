const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/public/status', (req, res) => {
    res.json({ status: 'Server is running', version: '1.0' });
});
router.post('/', userController.createUser);
router.get('/', userController.getAllLogins);

router.use(authMiddleware.authenticate);

router.get('/:userId', userController.getUser);
router.put('/:userId', userController.updateUser);
router.patch('/:userId', userController.patchUser);

module.exports = router;