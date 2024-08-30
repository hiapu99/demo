const productModels = require('../models/ProductModels.js'); // Update to the correct product model
const UploadCloudinary = require('../utils/cloudinary.js');
const cloudinary = require('cloudinary').v2; // Ensure this is included

// Create product
module.exports.CreateProduct = async (req, res) => {
  const { name, description, price, category, quantity } = req.body;
  const picturePath = req.file?.path;

  if (!name || !description || !price || !category || !picturePath || !quantity) {
    return res.status(400).json({
      success: false,
      msg: "All fields are required."
    });
  }

  try {
    // Check if product already exists
    const existingProduct = await productModels.findOne({ name });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        msg: "Product already exists."
      });
    }

    // Upload picture to Cloudinary
    const { secure_url, public_id } = await UploadCloudinary(picturePath, 'products');

    // Create new product
    const newProduct = await productModels.create({
      name,
      description,
      price,
      category,
      quantity,
      picture: {
        secure_url,
        public_id
      }
    });

    res.status(201).json({
      success: true,
      msg: "Product created successfully.",
      newProduct
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      msg: "An error occurred while creating the product."
    });
  }
};

// Get all products
module.exports.GetAllProducts = async (req, res) => {
  try {
    const products = await productModels.find();
    res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      msg: "An error occurred while fetching products."
    });
  }
};

// Update product
module.exports.UpdateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, quantity } = req.body;
  const picturePath = req.file?.path;

  try {
    const product = await productModels.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        msg: "Product not found."
      });
    }

    // Prepare update data
    const updateData = { name, description, price, category, quantity };

    // Handle picture update
    if (picturePath) {
      // Upload new picture
      const { secure_url, public_id } = await UploadCloudinary(picturePath, 'products');
      updateData.picture = { secure_url, public_id };

      // Delete old picture from Cloudinary
      if (product.picture?.public_id) {
        await cloudinary.uploader.destroy(product.picture.public_id);
      }
    }

    // Update product
    const updatedProduct = await productModels.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({
      success: true,
      msg: "Product updated successfully.",
      updatedProduct
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      msg: "An error occurred while updating the product."
    });
  }
};

// Delete product
module.exports.DeleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await productModels.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        msg: "Product not found."
      });
    }

    // Delete image from Cloudinary if it exists
    if (product.picture?.public_id) {
      await cloudinary.uploader.destroy(product.picture.public_id);
    }

    // Delete product from database
    await productModels.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      msg: "Product deleted successfully."
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      msg: "An error occurred while deleting the product."
    });
  }
};
