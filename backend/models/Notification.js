const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: String, required: true }
}, { _id: false });

module.exports = mongoose.model('Notification', notificationSchema);