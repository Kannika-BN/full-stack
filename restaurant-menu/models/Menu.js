const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Menu item name is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['veg', 'non-veg', 'drinks', 'dessert']
  },
  availability: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Menu', menuSchema);
