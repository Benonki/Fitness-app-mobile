const mongoose = require('mongoose');
const notificationSchema = require('./Notification');
const productSchema = require('./Product');

const userSchema = new mongoose.Schema({
  login: { type: String, required: true, unique: true },
  haslo: { type: String, required: true },
  imie: { type: String, required: true },
  nazwisko: { type: String, required: true },
  waga: { type: Number, required: true, min: 0 },
  wzrost: { type: Number, required: true, min: 0 },
  kroki: { type: Number, default: 0, min: 0 },
  zrKroki: { type: Number, default: 0, min: 0 },
  cel: {
    type: String,
    required: true,
    enum: ['Utrata wagi', 'Przybieranie na wadze', 'Utrzymanie wagi']
  },
  iloscTr: { type: Number, default: 0, min: 0 },
  plec: { type: String, required: true, enum: ['Mężczyzna', 'Kobieta'] },
  dataUr: { type: String, required: true },
  imageUri: { type: String, default: '' },
  notifications: [notificationSchema],
  eatenProducts: [productSchema],
  lastSyncDate: { type: Date, default: new Date().toISOString().split('T')[0] },
  notificationFlags: {
    birthdaySent: { type: Boolean, default: false },
    stepsGoalSent: { type: Boolean, default: false },
    caloriesGoalSent: { type: Boolean, default: false }
  }
});

module.exports = mongoose.model('User', userSchema);