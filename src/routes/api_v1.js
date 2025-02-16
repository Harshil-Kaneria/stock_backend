const express = require('express');
const router = express.Router();
const { validate } = require('express-validation');
const adminRoutes = require('./admin_routes');
router.use(adminRoutes);

const dataValidator = require("../../src/validator")
const userController = require("../../src/controllers/api/v1/userController")

// User APIs
router.post("/user/update-profile", validate(dataValidator.userValidator.userProfileValidationSchema), userController.updateUserProfile);
router.post("/user/update-profile-photo", userController.uploadProfilePicture);
router.post("/user/update-fcm-token", validate(dataValidator.userValidator.updateFcmValidationSchema), userController.updateFcmToken);
router.get("/user/notification-data", userController.getNotificationsData);
router.get("/user/details", userController.getUserData);
router.get("/user/generate-recommendation", userController.generateRecommandation);
router.get("/user/fetch-recommendation", userController.fetchRecommandation);
router.post("/user/update-recommendation", validate(dataValidator.userValidator.userUpdateRecommandationValidationSchema), userController.updateRecommandation);
router.get("/user/datewise-progress", userController.getDatewiseProgressData);
router.post("/user/upload-food-photo", userController.uploadFoodPhoto);
router.get("/user/fetch-food-progress-data", userController.getFoodProgressData);
router.post("/user/update-food-recommendation", validate(dataValidator.userValidator.userUpdateFoodRecommandationValidationSchema), userController.updateFoodRecommandation);
router.post("/user/chatbot", validate(dataValidator.userValidator.userChatbotSendMessagesValidationSchema), userController.userChatbotSendMessages);
router.get("/user/chatbot-messages", userController.getChatbotMessagesData);
router.post("/user/user-payment", validate(dataValidator.userValidator.userPaymentValidationSchema), userController.userPayement);
// const dataValidator = require("../../src/validator")
// const APIController = require("../../src/controllers/api/v1")
// const adminModuleController = require("../../src/controllers/admin")

module.exports = router;
