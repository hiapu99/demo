const categoryModels = require('../models/category.js');
const UploadCloudinary = require('../utils/cloudinary.js');
const cloudinary = require('cloudinary').v2; // Ensure this is included

// Create category
module.exports.Createcategory = async (req, res) => {
    const { name } = req.body;
    const picturePath = req.file?.path;

    if (!name || !picturePath) {
        return res.status(400).json({
            success: false,
            msg: "All fields are required."
        });
    }

    try {
        // Check if category already exists
        const existingCategory = await categoryModels.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                msg: "Category already exists."
            });
        }

        // Upload picture to Cloudinary
        const { secure_url, public_id } = await UploadCloudinary(picturePath, 'categories');

        // Create new category
        const newCategory = await categoryModels.create({
            name,
            picture: {
                secure_url,
                public_id
            }
        });

        res.status(201).json({
            success: true,
            msg: "Category created successfully.",
            newCategory
        });
    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({
            success: false,
            msg: "An error occurred while creating the category."
        });
    }
};

// Get all categories
module.exports.GetAllCategories = async (req, res) => {
    try {
        const categories = await categoryModels.find();
        res.status(200).json({
            success: true,
            categories
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({
            success: false,
            msg: "An error occurred while fetching categories."
        });
    }
};

// Update category
module.exports.UpdateCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const picturePath = req.file?.path;

    try {
        const category = await categoryModels.findById(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                msg: "Category not found."
            });
        }

        // Prepare update data
        const updateData = { name };

        // Handle picture update
        if (picturePath) {
            // Upload new picture
            const { secure_url, public_id } = await UploadCloudinary(picturePath, 'categories');
            updateData.picture = { secure_url, public_id };

            // Delete old picture from Cloudinary
            if (category.picture?.public_id) {
                await cloudinary.uploader.destroy(category.picture.public_id);
            }
        }

        // Update category
        const updatedCategory = await categoryModels.findByIdAndUpdate(id, updateData, { new: true });

        res.status(200).json({
            success: true,
            msg: "Category updated successfully.",
            updatedCategory
        });
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({
            success: false,
            msg: "An error occurred while updating the category."
        });
    }
};

// Delete category
module.exports.DeleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await categoryModels.findById(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                msg: "Category not found."
            });
        }

        // Delete image from Cloudinary if it exists
        if (category.picture?.public_id) {
            await cloudinary.uploader.destroy(category.picture.public_id);
        }

        // Delete category from database
        await categoryModels.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            msg: "Category deleted successfully."
        });
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({
            success: false,
            msg: "An error occurred while deleting the category."
        });
    }
};
