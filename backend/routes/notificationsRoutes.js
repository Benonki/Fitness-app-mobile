const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notificationsController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware.authenticate);

router.get('/:userId', notificationsController.getNotifications);
router.post('/:userId/add', notificationsController.addNotification);
router.delete('/:userId/:notificationId', notificationsController.deleteNotification);

module.exports = router;