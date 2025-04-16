const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.getUserInfo = async (userLogin) => {
    if (!userLogin) {
        throw new Error('Login użytkownika jest wymagany');
    }

    const user = await User.findOne({ login: userLogin });
    if (!user) {
        throw new Error('Użytkownik nie znaleziony');
    }

    return {
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
};

exports.login = async (login, password) => {
    if (!login || !password) {
        throw new Error('Wszystkie pola muszą być wypełnione');
    }

    const user = await User.findOne({ login });
    if (!user) {
        throw new Error('Nieprawidłowy login lub hasło');
    }

    const isPasswordValid = await bcrypt.compare(password, user.haslo);
    if (!isPasswordValid) {
        throw new Error('Nieprawidłowy login lub hasło');
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

    return {
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
    };
};

exports.checkLoginAvailability = async (login) => {
    if (!login) {
        throw new Error('Login jest wymagany');
    }

    const user = await User.findOne({ login });
    return {
        success: true,
        available: !user
    };
};