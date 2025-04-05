const mongoose = require('mongoose');
const Notification = require('./Notification');
const Product = require('./Product');

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
  notifications: [Notification.schema],
  eatenProducts: [Product.schema],
  lastSyncDate: { type: Date, default: new Date().toISOString().split('T')[0] }
});

module.exports = mongoose.model('User', userSchema);