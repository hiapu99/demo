const jwt = require('jsonwebtoken');

const ensureAuthorization = async (req, res, next) => {
    // Get token from Authorization header
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            msg: "JWT token is required"
        });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(authHeader, process.env.JWT_SECRET);
        req.user = decoded; // Attach user data to request
        next(); // Pass control to the next middleware
    } catch (err) {
        return res.status(401).json({
            success: false,
            msg: "Invalid or expired token"
        });
    }
};

const ensureAdmin = async (req, res, next) => {
    try {
        if (req.user.role === 'admin') {
            next()
        } else {
            return res.status(403).json({
                success: false,
                msg: "Access denied. Admins only."
            });
        }
    } catch (error) {
        return res.status(401).json({
            success: false,
            msg: "Invalid or expired token admin"
        });
    }
}

module.exports = { ensureAuthorization, ensureAdmin };
