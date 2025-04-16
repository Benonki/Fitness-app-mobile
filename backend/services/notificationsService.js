const User = require('../models/User');

exports.getNotifications = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('Uzytkownik nie znaleziony');
    }
    return user.notifications || [];
};

exports.addNotification = async (userId, title, message) => {
    const newNotification = {
        id: Date.now(),
        title,
        message,
        date: new Date().toISOString()
    };

    const user = await User.findByIdAndUpdate(
        userId,
        { $push: { notifications: newNotification } },
        { new: true }
    );

    if (!user) {
        throw new Error('Uzytkownik nie znaleziony');
    }

    return user.notifications;
};

exports.deleteNotification = async (userId, notificationId) => {
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $pull: { notifications: { id: Number(notificationId) } } },
        { new: true }
    );

    if (!updatedUser) {
        throw new Error('Uzytkownik nie znaleziony');
    }

    return updatedUser.notifications;
};

exports.updateNotificationFlag = async (userId, flagName, value) => {
    const update = { [`notificationFlags.${flagName}`]: value };

    const user = await User.findByIdAndUpdate(
        userId,
        { $set: update },
        { new: true }
    );

    if (!user) {
        throw new Error('Użytkownik nie znaleziony');
    }
};