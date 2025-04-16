const User = require('../models/User');

exports.getSteps = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('Uzytkownik nie znaleziony');
    }
    return user.zrKroki;
};

exports.updateSteps = async (userId, zrKroki) => {
    const user = await User.findByIdAndUpdate(
        userId,
        { zrKroki },
        { new: true }
    );

    if (!user) {
        throw new Error('Uzytkownik nie znaleziony');
    }

    return user.zrKroki;
};