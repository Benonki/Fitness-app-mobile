const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  calories: { type: Number, required: true, min: 0 },
  fat: { type: Number, default: 0, min: 0 },
  sugar: { type: Number, default: 0, min: 0 },
  proteins: { type: Number, default: 0, min: 0 }
}, { _id: false });

module.exports = mongoose.model('Product', productSchema);