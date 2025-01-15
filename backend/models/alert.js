const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  email: String,
  coinId: String,
  minPrice: Number,
  maxPrice: Number,
  active: {type: Boolean, default: true},
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Alert', alertSchema);
