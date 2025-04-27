import jwt from 'jsonwebtoken';
import User from '../model/user.model.js';
import cookieParser from 'cookie-parser';

export const auth = async (req, res, next) => {
    try {
        let token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

        // 🛑 If no token is found, return error
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided",
            });
        }

        try {
            // Verify token with a timeout to prevent hanging on network issues
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            if (!decoded || !decoded.id) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid token format",
                });
            }

            // Find user by ID with a timeout
            const user = await Promise.race([
                User.findById(decoded.id),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Database timeout')), 5000)
                )
            ]);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }

            req.id = user._id;
            req.email = user.email;
            next();
        } catch (err) {
            console.error("JWT Verification Error:", err);

            // Handle specific error types
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: "Token expired, please login again"
                });
            } else if (err.code === 'ECONNRESET' || err.message === 'Database timeout') {
                return res.status(503).json({
                    success: false,
                    message: "Service temporarily unavailable, please try again"
                });
            } else {
                return res.status(401).json({
                    success: false,
                    message: "Authentication failed"
                });
            }
        }
    } catch (err) {
        console.error("Auth Middleware Error:", err);
        res.status(500).json({ success: false, message: "Authentication error" });
    }
};
