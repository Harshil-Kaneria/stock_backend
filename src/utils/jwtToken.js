require("dotenv").config();
const jwt = require("jsonwebtoken");

const tokenSecret = process.env.JWT_SECRET || "fallbackRandomSecret";
const ACCESS_TOKEN_EXPIRY = "365d";
const REFRESH_TOKEN_EXPIRY = "365d";

const issueAccessToken = (payload) => {
    return jwt.sign(payload, tokenSecret, {
        algorithm: "HS256",
        expiresIn: ACCESS_TOKEN_EXPIRY,
    });
};

const issueRefreshToken = (payload) => {
    return jwt.sign(payload, tokenSecret, {
        algorithm: "HS256",
        expiresIn: REFRESH_TOKEN_EXPIRY,
    });
};

const verifyToken = (token, callback) => {
    jwt.verify(token, tokenSecret, {}, (err, decoded) => {
        if (err) {
            return callback({ success: false, message: "Invalid token" }, null);
        }
        return callback(null, decoded);
    });
};

const refreshToken = (refreshToken, cb) => {
    jwt.verify(refreshToken, tokenSecret, {}, (err, decoded) => {
        if (err) {
            return cb({ success: false, message: "Invalid refresh token" });
        }

        const newAccessToken = jwt.sign(
            { id: decoded.id, role: decoded.role },
            tokenSecret,
            { expiresIn: ACCESS_TOKEN_EXPIRY }
        );
        cb(null, { accessToken: newAccessToken });
    });
};

// Export the utility functions
module.exports = {
    issueAccessToken,
    issueRefreshToken,
    verifyToken,
    refreshToken,
};
