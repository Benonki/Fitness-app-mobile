const express = require('express');
const router = express.Router();
const stepsController = require('../controllers/stepsController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware.authenticate);

router.get('/:userId', stepsController.getSteps);
router.patch('/:userId/update', stepsController.updateSteps);

module.exports = router;