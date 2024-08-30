const UserModels = require('../models/userModels.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

module.exports.SignUp = async (req, res) => {
    const { name, email, password } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            msg: "All fields are required."
        });
    }

    try {
        // Check if the user already exists
        const existingUser = await UserModels.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                msg: "Email already exists."
            });
        }

        // Hash the password
        const hashPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = await UserModels.create({
            name,
            email,
            password: hashPassword,
            role: "user"
        });

        // Respond with success
        res.status(201).json({
            success: true,
            msg: "User created successfully.",
            user
        });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({
            success: false,
            msg: "Internal server error."
        });
    }
};



module.exports.SignIn = async (req, res) => {
    const { email, password } = req.body;

    // Check if all required fields are provided
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            msg: "All fields are required."
        });
    }

    try {
        // Find the user by email
        const user = await UserModels.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                msg: "User does not exist."
            });
        }

        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                msg: "Invalid password."
            });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role }, // Payload
            process.env.JWT_SECRET, // Secret key from environment variables
            { expiresIn: '1h' } // Token expiration time
        );

        // Respond with success and token
        res.status(200).json({
            success: true,
            msg: "User logged in successfully.",
            user,
            token
        });
    } catch (error) {
        console.error("Error during sign in:", error);
        res.status(500).json({
            success: false,
            msg: "Internal server error."
        });
    }
};