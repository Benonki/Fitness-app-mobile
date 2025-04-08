const express = require('express');
const router = express.Router();
const userProductsController = require('../controllers/userProductsController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware.authenticate);

router.get('/:userId', userProductsController.getUserProducts);
router.patch('/:userId/update', userProductsController.updateUserProducts);

module.exports = router;