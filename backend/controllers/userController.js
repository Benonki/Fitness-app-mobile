const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getUser = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: 'Uzytkownik nie znaleziony' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllLogins = async (req, res) => {
  try {
    const users = await User.find().select('login -_id'); // same loginy
    const logins = users.map(user => user.login);
    res.json({
      success: true,
      logins
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const existingUser = await User.findOne({ login: req.body.login });
    if (existingUser) {
      return res.status(400).json({ message: 'Login juz istnieje' });
    }
    const hashedPassword = await bcrypt.hash(req.body.haslo, 12);
    const NewUser = new User({
      ...req.body,
      haslo: hashedPassword
    });
    await NewUser.save();
    res.status(201).json(NewUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'Uzytkownik nie znaleziony' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.patchUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'Uzytkownik nie znaleziony' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};