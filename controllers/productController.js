const Product = require("../models/Product");
const Category = require("../models/Category");
const deleteFromCloudinary = require("../utils/deleteFromCloudinary");
const fs = require("fs");
const path = require("path");


// Create Category
exports.createCategory = async (req, res) => {
  try {
    const { name, slug, parentCategory } = req.body;
    const category = new Category({ name, slug, parentCategory });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ msg: "Error creating category", error: err.message });
  }
};


exports.createProduct = async (req, res) => {
  try {
    const {
      title,
      slug,
      description,
      price,
      stock,
      brand,
      category,
      specs,
      isAccessory
    } = req.body;

    const images = req.files.map(file => ({
      public_id: file.filename,
      url: `/uploads/products/${file.filename}`
    }));

    const newProduct = new Product({
      title,
      slug,
      description,
      price,
      stock,
      brand,
      category,
      specs: JSON.parse(specs || "{}"),
      isAccessory: isAccessory === "true",
      images
    });

    await newProduct.save();
    res.status(201).json({ msg: "Product created successfully", product: newProduct });
  } catch (err) {
    res.status(500).json({ msg: "Error creating product", error: err.message });
  }
};



// Get All Products (with optional category filter)
exports.getProducts = async (req, res) => {
  try {
    const { category } = req.query;

    const filter = category
      ? { category: { $regex: new RegExp(`^${category}$`, 'i') } } // case-insensitive match
      : {};

    const products = await Product.find(filter);

    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching products", error: err.message });
  }
};




exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: "Product not found" });

    // Delete each image from Cloudinary
    for (let img of product.images) {
      await deleteFromCloudinary(img.public_id);
    }

    await product.deleteOne();

    res.json({ msg: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting product", error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const {
      title,
      slug,
      description,
      price,
      stock,
      brand,
      category,
      specs,
      isAccessory
    } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: "Product not found" });

    // --- Handle removed images ---
    if (req.body.images) {
      const keptImages = JSON.parse(req.body.images); // array of kept images

      // Remove deleted ones from local and DB
      const removedImages = product.images.filter(img =>
        !keptImages.some(kImg => kImg.url === img.url)
      );

      for (let img of removedImages) {
        const imgPath = path.join(__dirname, "..", img.url);
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      }

      // Keep only the selected images
      product.images = product.images.filter(img =>
        keptImages.some(kImg => kImg.url === img.url)
      );
    }

    // --- Append new image files ---
    if (req.files && req.files.length > 0) {
      const newImgs = req.files.map(file => ({
        public_id: file.filename,
        url: `/uploads/products/${file.filename}`
      }));
      product.images = [...product.images, ...newImgs];
    }

    // --- Update other fields ---
    product.title = title || product.title;
    product.slug = slug || product.slug;
    product.description = description || product.description;
    product.price = price || product.price;
    product.stock = stock || product.stock;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.specs = specs ? JSON.parse(specs) : product.specs;
    product.isAccessory = isAccessory === "true";

    await product.save();

    res.json({ msg: "Product updated successfully", product });

  } catch (err) {
    res.status(500).json({ msg: "Error updating product", error: err.message });
  }
};


exports.getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) return res.status(404).json({ msg: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching product", error: err.message });
  }
};
