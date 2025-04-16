const userProductsService = require('../services/userProductsService');

exports.getUserProducts = async (req, res) => {
  try {
    const products = await userProductsService.getUserProducts(req.user._id);
    res.json({ eatenProducts: products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUserProducts = async (req, res) => {
  try {
    const products = await userProductsService.updateUserProducts(req.user._id, req.body.eatenProducts);
    res.json(products);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};