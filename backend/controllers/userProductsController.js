const User = require('../models/User');

exports.getUserProducts = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: 'Uzytkownik nie znaleziony' });
    }
    res.json({ eatenProducts: user.eatenProducts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUserProducts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const newProducts = req.body.eatenProducts.filter(product =>
        product.calories > 0 && product.fat > 0 && product.sugar > 0 && product.proteins > 0
    );

    user.eatenProducts = newProducts;
    await user.save();

    res.json(user.eatenProducts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.clearUserProducts = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
        req.user._id,
      { eatenProducts: [] },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'Uzytkownik nie znaleziony' });
    }
    res.json(user.eatenProducts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};