// routes/routes.js
const express = require('express');
const router = express.Router();

const { validate } = require('express-validation');
const dataValidator = require("../../src/validator")

const adminModuleController = require("../../src/controllers/admin")
const userController = require("../../src/controllers/api/v1/userController")
const policiesController = require("../../src/controllers/api/v1/policiesController")

// Admin APIs
router.post("/admin/login", validate(dataValidator.adminValidator.adminLoginValidationSchema), adminModuleController.adminController.login);

// User APIs
router.post("/user/login-register", validate(dataValidator.userValidator.userLoginRegisterValidationSchema), userController.loginRegister);
router.post("/user/verify-otp", validate(dataValidator.userValidator.userVerifyOtpValidationSchema), userController.verifyOtp);
router.post("/user/resend-otp", validate(dataValidator.userValidator.userResendOtpValidationSchema), userController.resendOtp);
router.post("/policies", validate(dataValidator.policiesValidator.getPoliciesValidationSchema), policiesController.fetchPolicies);

module.exports = router;
