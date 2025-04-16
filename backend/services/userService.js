const User = require('../models/User');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

exports.getUser = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('Uzytkownik nie znaleziony');
    }
    return user;
};

exports.createUser = async (userData) => {
    const existingUser = await User.findOne({ login: userData.login });
    if (existingUser) {
        throw new Error('Login juz istnieje');
    }

    const hashedPassword = await bcrypt.hash(userData.haslo, 12);
    const newUser = new User({
        ...userData,
        haslo: hashedPassword
    });

    await newUser.save();
    return newUser;
};

exports.updateUser = async (userId, updateData) => {
    const currentUser = await User.findById(userId);

    if (updateData.imageUri && updateData.imageUri.startsWith('data:image')) {
        const matches = updateData.imageUri.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
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

            const imageBuffer = Buffer.from(matches[2], 'base64');
            const imageName = `user_${userId}_${Date.now()}.${matches[1].split('/')[1] || 'jpg'}`;
            const imagePath = path.join(__dirname, '../public/uploads', imageName);

            fs.writeFileSync(imagePath, imageBuffer);
            updateData.imageUri = `/uploads/${imageName}`;
            console.log('Nowe zdjęcie zostało zapisane:', imagePath);
        }
    }

    const user = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
    );

    if (!user) {
        throw new Error('Użytkownik nie znaleziony');
    }

    return user;
};

exports.resetDaily = async (userId) => {
    const today = new Date().toISOString().split('T')[0];
    const user = await User.findByIdAndUpdate(
        userId,
        {
            zrKroki: 0,
            eatenProducts: [],
            lastSyncDate: today,
            'notificationFlags.birthdaySent': false,
            'notificationFlags.stepsGoalSent': false,
            'notificationFlags.caloriesGoalSent': false
        },
        { new: true }
    );

    if (!user) {
        throw new Error('Użytkownik nie znaleziony');
    }

    return {
        message: 'Dzienne dane zostały zresetowane',
        user: {
            zrKroki: user.zrKroki,
            lastSyncDate: user.lastSyncDate,
            eatenProducts: user.eatenProducts,
            notificationFlags: user.notificationFlags
        }
    };
};