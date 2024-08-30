const cloudinary = require('cloudinary').v2;
const fs = require('fs');
require('dotenv').config();

// Configuration
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret // Click 'View API Keys' above to copy your API secret
});

const UploadCloudinary = async (filepath, folderName) => {
    try {
        const uploadResult = await cloudinary.uploader.upload(filepath, {
            folder: folderName
        });

        // Delete the file from the local server
        try {
            fs.unlinkSync(filepath);
        } catch (deleteError) {
            console.error("Error deleting the image from the local server:", deleteError);
        }

        // Return the upload result details
        return {
            secure_url: uploadResult.secure_url,
            public_id: uploadResult.public_id
        };
    } catch (uploadError) {
        console.error("Error uploading the image to Cloudinary:", uploadError);
        throw new Error("Cloudinary upload failed");
    }
};

module.exports = UploadCloudinary;
