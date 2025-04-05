const User = require('../models/User');

exports.getSteps = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: 'Uzytkownik nie znaleziony' });
    }
    res.json({ zrKroki: user.zrKroki });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSteps = async (req, res) => {
  try {
    const { zrKroki } = req.body;
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { zrKroki },
        { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'Uzytkownik nie znaleziony' });
    }
    res.json({ zrKroki: user.zrKroki });
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({ message: error.message });
  }
};

exports.resetSteps = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
        req.user._id,
      { 
        zrKroki: 0,
        lastSyncDate: new Date().toISOString().split('T')[0]
      },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'Uzytkownik nie znaleziony' });
    }
    res.json({ zrKroki: user.zrKroki });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};