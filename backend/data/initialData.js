const User = require('../models/User');
const bcrypt = require('bcryptjs');

const initialUsers = [
  {
    id: "f5a1",
    login: "Test",
    haslo: "Test",
    imie: "TestImię",
    nazwisko: "TestNaz",
    waga: 101,
    wzrost: 200,
    kroki: 20,
    zrKroki: 37,
    cel: "Przybieranie na wadze",
    iloscTr: 5,
    plec: "Mężczyzna",
    dataUr: "14.03.2025",
    imageUri: "",
    notifications: [],
    eatenProducts: []
  }
];

const initializeData = async () => {
  try {
    const count = await User.countDocuments();
    if (count === 0) {
      const usersWithHashedPasswords = await Promise.all(
          initialUsers.map(async (user) => {
            const hashedPassword = await bcrypt.hash(user.haslo, 12);
            return {
              ...user,
              haslo: hashedPassword
            };
          })
      );

      await User.insertMany(usersWithHashedPasswords);
      console.log('Wprowadzono podstawowe dane');
    }
  } catch (error) {
    console.error('Error podczas wprowadzania podstawowych danych:', error);
  }
};

module.exports = { initializeData };