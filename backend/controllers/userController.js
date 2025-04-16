const userService = require('../services/userService');

exports.getUser = async (req, res) => {
  try {
    const user = await userService.getUser(req.user._id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const newUser = await userService.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await userService.updateUser(req.user._id, req.body);
    res.json(updatedUser);
  } catch (error) {
    console.error('Błąd podczas aktualizacji użytkownika:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.resetDaily = async (req, res) => {
  try {
    const result = await userService.resetDaily(req.user._id);
    res.json(result);
  } catch (error) {
    console.error('Błąd podczas resetowania danych dziennych:', error);
    res.status(400).json({ message: error.message });
  }
};