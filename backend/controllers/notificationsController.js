const notificationsService = require('../services/notificationsService');

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await notificationsService.getNotifications(req.user._id);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addNotification = async (req, res) => {
  try {
    const { title, message } = req.body;
    const notifications = await notificationsService.addNotification(req.user._id, title, message);
    res.json(notifications);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notifications = await notificationsService.deleteNotification(req.user._id, notificationId);
    res.json(notifications);
  } catch (error) {
    console.error('Błąd usuwania powiadomienia:', error.message);
    res.status(400).json({ message: error.message });
  }
};

exports.updateNotificationFlag = async (req, res) => {
  try {
    const { flagName, value } = req.body;
    await notificationsService.updateNotificationFlag(req.user._id, flagName, value);
    res.json({
      message: 'Flaga powiadomienia została zaktualizowana'
    });
  } catch (error) {
    console.error('Błąd podczas aktualizacji flagi powiadomienia:', error);
    res.status(400).json({ message: error.message });
  }
};