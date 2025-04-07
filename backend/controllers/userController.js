const User = require('../models/User');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

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
    // Pobierz aktualne dane użytkownika, aby sprawdzić czy ma stare zdjęcie
    const currentUser = await User.findById(req.user._id);

    // Jeśli przesyłane jest nowe zdjęcie
    if (req.body.imageUri && req.body.imageUri.startsWith('data:image')) {
      const matches = req.body.imageUri.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        // Usuń poprzednie zdjęcie jeśli istnieje
        if (currentUser.imageUri) {
          const oldImagePath = path.join(__dirname, '../public', currentUser.imageUri);
          try {
            if (fs.existsSync(oldImagePath)) {
              fs.unlinkSync(oldImagePath);
              console.log('Poprzednie zdjęcie zostało usunięte:', oldImagePath);
            }
          } catch (err) {
            console.error('Błąd podczas usuwania poprzedniego zdjęcia:', err);
          }
        }

        // Zapisz nowe zdjęcie
        const imageBuffer = Buffer.from(matches[2], 'base64');
        const imageName = `user_${req.user._id}_${Date.now()}.${matches[1].split('/')[1] || 'jpg'}`;
        const imagePath = path.join(__dirname, '../public/uploads', imageName);

        fs.writeFileSync(imagePath, imageBuffer);
        req.body.imageUri = `/uploads/${imageName}`;
        console.log('Nowe zdjęcie zostało zapisane:', imagePath);
      }
    }

    // Aktualizuj dane użytkownika
    const user = await User.findByIdAndUpdate(
        req.user._id,
        req.body,
        { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
    }

    res.json(user);
  } catch (error) {
    console.error('Błąd podczas aktualizacji użytkownika:', error);
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