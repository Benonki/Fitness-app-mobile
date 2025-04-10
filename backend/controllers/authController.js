const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.getUserInfo = async (req, res) => {
  try {
    const userLogin = req.query.login;

    if (!userLogin) {
      return res.status(400).json({ message: 'Login użytkownika jest wymagany' });
    }

    const user = await User.findOne({ login: userLogin });

    if (!user) {
      return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
    }

    const formattedUser = {
      id: user._id,
      login: user.login,
      imie: user.imie,
      nazwisko: user.nazwisko,
      waga: user.waga,
      wzrost: user.wzrost,
      kroki: user.kroki,
      zrKroki: user.zrKroki,
      cel: user.cel,
      iloscTr: user.iloscTr,
      plec: user.plec,
      dataUr: user.dataUr,
      imageUri: user.imageUri,
      lastSyncDate: user.lastSyncDate,
      notifications: user.notifications || [],
      eatenProducts: user.eatenProducts || [],
      notificationFlags: user.notificationFlags || {
        birthdaySent: false,
        stepsGoalSent: false,
        caloriesGoalSent: false
      }
    };

    res.json(formattedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { login, password } = req.body;

    // Walidacja danych wejściowych
    if (!login || !password) {
      return res.status(400).json({
        success: false,
        message: 'Wszystkie pola muszą być wypełnione'
      });
    }

    // Znajdź użytkownika
    const user = await User.findOne({ login });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Nieprawidłowy login lub hasło'
      });
    }

    // Porównaj hasła (bezpieczne porównanie)
    const isPasswordValid = await bcrypt.compare(password, user.haslo);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Nieprawidłowy login lub hasło'
      });
    }
    // Generuj token JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });


    // Zwróć odpowiedź
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        login: user.login,
        imie: user.imie,
        nazwisko: user.nazwisko,
        waga: user.waga,
        wzrost: user.wzrost,
        kroki: user.kroki,
        zrKroki: user.zrKroki,
        cel: user.cel,
        iloscTr: user.iloscTr,
        plec: user.plec,
        dataUr: user.dataUr,
        imageUri: user.imageUri,
        lastSyncDate: user.lastSyncDate,
        notifications: user.notifications || [],
        eatenProducts: user.eatenProducts || [],
        notificationFlags: user.notificationFlags || {
          birthdaySent: false,
          stepsGoalSent: false,
          caloriesGoalSent: false
        }
      }
    });

  } catch (error) {
    console.error('Błąd logowania:', error);
    res.status(500).json({
      success: false,
      message: 'Wystąpił błąd podczas logowania'
    });
  }
};

exports.checkLoginAvailability = async (req, res) => {
  try {
    const { login } = req.query;

    if (!login) {
      return res.status(400).json({
        success: false,
        message: 'Login jest wymagany',
        available: false
      });
    }

    const user = await User.findOne({ login });
    res.json({
      success: true,
      available: !user // true jeśli login dostępny, false jeśli zajęty
    });
  } catch (error) {
    console.error('Błąd sprawdzania loginu:', error);
    res.status(500).json({
      success: false,
      message: 'Wystąpił błąd podczas sprawdzania dostępności loginu',
      available: false
    });
  }
};