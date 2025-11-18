const express = require('express')
const router = express.Router()
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController')

const { protect, isAdmin } = require('../middleware/authMiddleware')

router.get('/', getCategories)
router.get('/:id', getCategory)

// Admin only
router.post('/', protect, isAdmin, createCategory)
router.put('/:id', protect, isAdmin, updateCategory)
router.delete('/:id', protect, isAdmin, deleteCategory)

module.exports = router
