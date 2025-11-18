const Category = require('../models/Category')

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 })
    res.json(categories)
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching categories', error: err.message })
  }
}

exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
    if (!category) return res.status(404).json({ msg: 'Category not found' })
    res.json(category)
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching category', error: err.message })
  }
}

exports.createCategory = async (req, res) => {
  try {
    const { name, slug, parentCategory } = req.body
    const category = new Category({ name, slug, parentCategory: parentCategory || null })
    await category.save()
    res.status(201).json(category)
  } catch (err) {
    res.status(500).json({ msg: 'Error creating category', error: err.message })
  }
}

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
    if (!category) return res.status(404).json({ msg: 'Category not found' })

    const { name, slug, parentCategory } = req.body
    category.name = name || category.name
    category.slug = slug || category.slug
    category.parentCategory = typeof parentCategory !== 'undefined' ? parentCategory : category.parentCategory

    await category.save()
    res.json(category)
  } catch (err) {
    res.status(500).json({ msg: 'Error updating category', error: err.message })
  }
}

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
    if (!category) return res.status(404).json({ msg: 'Category not found' })
    await category.deleteOne()
    res.json({ msg: 'Category deleted' })
  } catch (err) {
    res.status(500).json({ msg: 'Error deleting category', error: err.message })
  }
}
