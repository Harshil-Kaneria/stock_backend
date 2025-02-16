const jwToken = require('jsonwebtoken');
const { Admin, User } = require('../models/index');

module.exports = async function (req, res, next) {
    let token = null;
    if (req.headers && req.headers.authorization) {
        const parts = req.headers.authorization.split(" ");
        if (parts.length === 2) {
            const [scheme, credentials] = parts;

            if (/^Bearer$/i.test(scheme)) {
                token = credentials;
            } else {
                return generateResponse(req, res, StatusCodes.UNAUTHORIZED, false, "Format is Authorization: Bearer [token]");
            }
        } else {
            return generateResponse(req, res, StatusCodes.UNAUTHORIZED, false, "Format is Authorization: Bearer [token]");
        }
    }

    jwToken.verify(token, process.env.JWT_SECRET || 'yourFallbackSecret', async (err, decodedToken) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                return generateResponse(req, res, StatusCodes.UNAUTHORIZED, false, "Token has expired");
            } else {
                return generateResponse(req, res, StatusCodes.UNAUTHORIZED, false, "Invalid token");
            }
        } else {
            req.token = decodedToken;
            if (!decodedToken || !decodedToken.secretId) {
                return generateResponse(req, res, StatusCodes.UNAUTHORIZED, false, "Token mismatch");
            }

            try {
                var userObj = null;
                if (![
                    '/admin/verify-forgot-password-otp',
                    '/admin/reset-password',
                    '/user/sign-up-otp-verify',
                    '/user/verify-forgot-password-otp',
                    '/user/reset-password',
                ].includes(req.path) && (decodedToken.loginType === "forgotPassword" || decodedToken.loginType === "userForgotPassword")
                ) {
                    return generateResponse(req, res, StatusCodes.UNAUTHORIZED, false, "Invalid token");
                }

                if (decodedToken.loginType == "admin" || decodedToken.loginType == "forgotPassword") {
                    if (req.path.startsWith('/user')) {
                        return generateResponse(req, res, StatusCodes.FORBIDDEN, false, "Admins are not authorized to access user APIs");
                    }

                    userObj = await Admin.findOne({ where: { secretId: decodedToken.secretId } });
                    userObj.loginUserType = "admin";
                } else if (decodedToken.loginType == "user" || decodedToken.loginType == "userForgotPassword") {
                    if (req.path.startsWith('/admin')) {
                        return generateResponse(req, res, StatusCodes.FORBIDDEN, false, "Users are not authorized to access admin APIs");
                    }

                    userObj = await User.findOne({ where: { secretId: decodedToken.secretId } });
                    userObj.loginUserType = "user";
                }

                if (!userObj) {
                    return generateResponse(req, res, StatusCodes.UNAUTHORIZED, false, "Token mismatch");
                }

                if (userObj.isDeleted) {
                    return generateResponse(req, res, StatusCodes.UNAUTHORIZED, false, "User have no rights to access this application");
                }

                userObj.profileImage = userObj.profileImage != null ? process.env.BACKEND_BASE_URL + userObj.profileImage : null

                req.loggedInUser = userObj;
                return next();
            } catch (err) {
                return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, "User have no rights to access this application");
            }
        }
    });
};
