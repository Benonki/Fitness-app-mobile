const User = require('../models/User');

exports.getNotifications = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: 'Uzytkownik nie znaleziony' });
    }
    res.json(user.notifications || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addNotification = async (req, res) => {
  try {
    const { title, message } = req.body;
    const newNotification = {
      id: Date.now(),
      title,
      message,
      date: new Date().toISOString()
    };

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $push: { notifications: newNotification } },
        { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Uzytkownik nie znaleziony' });
    }

    res.json(user.notifications);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: 'Uzytkownik nie znaleziony' });
    }
    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { notifications: { id: Number(notificationId) } } },
        { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'Uzytkownik nie znaleziony' });
    }

    res.json(updatedUser.notifications);
  } catch (error) {
    console.error('Błąd usuwania powiadomienia:', error.message);
    res.status(400).json({ message: error.message });
  }
};

exports.updateNotificationFlag = async (req, res) => {
  try {
    const { flagName, value } = req.body;
    const update = { [`notificationFlags.${flagName}`]: value };

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: update },
        { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
    }

    res.json({
      message: 'Flaga powiadomienia została zaktualizowana'
    });
  } catch (error) {
    console.error('Błąd podczas aktualizacji flagi powiadomienia:', error);
    res.status(400).json({ message: error.message });
  }
};