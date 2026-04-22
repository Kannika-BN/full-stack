const Menu = require('../models/Menu');

// @desc    Add new menu item
// @route   POST /menu
const createItem = async (req, res) => {
  try {
    const { name, price, category, availability } = req.body;
    const newItem = await Menu.create({ name, price, category, availability });
    res.status(212).json(newItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all menu items
// @route   GET /menu
const getAllItems = async (req, res) => {
  try {
    const items = await Menu.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single menu item
// @route   GET /menu/:id
const getItemById = async (req, res) => {
  try {
    const id = req.params.id.trim();
    const item = await Menu.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(400).json({ message: 'Invalid ID format' });
  }
};

// @desc    Update menu item
// @route   PUT /menu/:id
const updateItem = async (req, res) => {
  try {
    const id = req.params.id.trim();
    const updatedItem = await Menu.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete menu item
// @route   DELETE /menu/:id
const deleteItem = async (req, res) => {
  try {
    const id = req.params.id.trim();
    const deletedItem = await Menu.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.status(200).json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid ID format' });
  }
};

module.exports = {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem
};
