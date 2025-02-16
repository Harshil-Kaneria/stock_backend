const express = require('express');
const router = express.Router();
const { validate } = require('express-validation');

const dataValidator = require("../validator")
const adminModuleController = require("../controllers/admin")

// =============================================================================================================================
// ================================================= ADMIN MODULE APIs =========================================================
// =============================================================================================================================

// admin APIs

router.get("/admin/get-profile", adminModuleController.adminController.getProfileDetails);
router.get("/admin/admin-list", adminModuleController.adminController.list);
router.get("/admin/dashboards", adminModuleController.adminController.adminDashboards);
router.post("/admin/details", validate(dataValidator.adminValidator.detailsAdminValidator), adminModuleController.adminController.details);
router.post("/admin/delete-admin", validate(dataValidator.adminValidator.deleteAdminValidator), adminModuleController.adminController.deleteAdmin);
router.post("/admin/update-admin", validate(dataValidator.adminValidator.updateValidator), adminModuleController.adminController.updateAdmin);
router.post("/admin/register", validate(dataValidator.adminValidator.registerValidator), adminModuleController.adminController.register);
router.get("/admin/get-policies", adminModuleController.adminController.getAllPolicies);
router.post("/admin/edit-policies", validate(dataValidator.adminValidator.editPoliciesValidator), adminModuleController.adminController.editPolicies);
router.get("/admin/notification-list", adminModuleController.adminController.notificationList);
router.post("/admin/notification-create", validate(dataValidator.adminValidator.notificationCreateValidator), adminModuleController.adminController.notificationCreate);
router.get("/admin/user-list", adminModuleController.adminController.userList);
router.post("/admin/delete-user", validate(dataValidator.adminValidator.deleteUserValidator), adminModuleController.adminController.deleteUser);
module.exports = router;
