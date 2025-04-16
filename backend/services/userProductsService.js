const User = require('../models/User');

exports.getUserProducts = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('Uzytkownik nie znaleziony');
    }
    return user.eatenProducts;
};

exports.updateUserProducts = async (userId, eatenProducts) => {
    const user = await User.findById(userId);
    const newProducts = eatenProducts.filter(product => product.calories > 0);

    user.eatenProducts = newProducts;
    await user.save();

    return user.eatenProducts;
};