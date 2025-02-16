const { uuid } = require("unique-string-generator");
const { fn, col, Op } = require("sequelize");
import { Admin, User, ForgotPasswordRequest, Policies, Notifications, AdminNotifications } from "../../models";
const { verifyPassword, hashPassword } = require("../../utils/passwordBcrypt");
const { issueAccessToken } = require("../../utils/jwtToken");
const AdminServices = require('../../services/admin/adminServices');

const adminController = {
    // Admin login(public API)
    login: async (req, res, next) => {
        try {
            await AdminServices.login(req, res, next)
        } catch (error) {
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || "Something went wrong!");
        }
    },

    // Get Admin profile details(protected API)
    getProfileDetails: async (req, res, next) => {
        try {
            const adminProfileResponse = await AdminServices.getProfileDetails(req, res, next);
            return generateResponse(req, res, StatusCodes.OK, true, "Data fetched successfully !", adminProfileResponse);

        } catch (error) {
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || 'Something went wrong !',
                { data: {} }
            );
        }
    },

    register: async (req, res) => {
        try {
            const { email, password, name } = req.body;

            const user = await Admin.findOne({
                where: { email, isDeleted: false },
            });
            if (user) {
                throw new Error("User already exists with same email");
            }
            const reqPass = await hashPassword(password);
            const payload = {
                email,
                name,
                password: reqPass,
                secretId: uuid.v4(),
                adminType: "admin"
            };

            const newUser = await Admin.create(payload);
            return generateResponse(
                req,
                res,
                StatusCodes.CREATED,
                true,
                "Admin register successfully !"
            );
        } catch (error) {
            return generateResponse(
                req,
                res,
                StatusCodes.INTERNAL_SERVER_ERROR,
                false,
                error.message || 'Something went wrong !'
            );
        }
    },

    profile: async (req, res) => {
        try {
            const { userId } = req.user;
            const user = await Admin.findOne({ where: { id: userId, isDeleted: false } });

            delete user.dataValues.id;
            delete user.dataValues.isDeleted;
            delete user.dataValues.createdAt;
            delete user.dataValues.updatedAt;

            return generateResponse(
                req,
                res,
                StatusCodes.OK,
                true,
                "Data fetch successfully !",
                { data: user }
            );
        } catch (error) {
            return generateResponse(
                req,
                res,
                StatusCodes.INTERNAL_SERVER_ERROR,
                false,
                error.message || 'Something went wrong !',
                { data: {} }
            );
        }
    },

    list: async (req, res) => {
        try {
            const user = await Admin.findAll({
                where: {
                    isDeleted: false
                },
                order: [
                    ['createdAt', 'DESC'],
                ]
            });
            return generateResponse(
                req,
                res,
                StatusCodes.OK,
                true,
                "Data fetch successfully !",
                { data: user }
            );
        } catch (error) {
            return generateResponse(
                req,
                res,
                StatusCodes.INTERNAL_SERVER_ERROR,
                false,
                error.message || 'Something went wrong !',
                { data: [] }
            );
        }
    },

    updateAdmin: async (req, res) => {
        try {

            const { secretId, email, name, password } = req.body;
            const payload = {
                email,
                name
            };

            const user = await Admin.findOne({
                where: {
                    email,
                    isDeleted: false,
                    secretId: { [Op.ne]: secretId },
                },
            });
            if (user) {
                throw new Error("User already exists with same email");
            }

            if (password && password != "") {
                const reqPass = await hashPassword(password)
                payload.password = reqPass
            }

            await Admin.update(payload, {
                where: {
                    secretId: secretId,
                    isDeleted: false
                }
            });

            return generateResponse(
                req,
                res,
                StatusCodes.OK,
                true,
                "Data updated successfully !"
            );
        } catch (error) {
            return generateResponse(
                req,
                res,
                StatusCodes.INTERNAL_SERVER_ERROR,
                false,
                error.message || 'Something went wrong !'
            );
        }
    },

    deleteAdmin: async (req, res) => {
        try {
            const { secretId } = req.body;

            await Admin.update({ isDeleted: true }, {
                where: {
                    secretId: secretId,
                    isDeleted: false
                }
            });

            return generateResponse(
                req,
                res,
                StatusCodes.OK,
                true,
                "Admin deleted successfully !"
            );

        } catch (error) {
            return generateResponse(
                req,
                res,
                StatusCodes.INTERNAL_SERVER_ERROR,
                false,
                error.message || 'Something went wrong !'
            );
        }
    },

    details: async (req, res) => {
        try {
            const { secretId } = req.body;

            const user = await Admin.findOne({ where: { secretId: secretId, isDeleted: false } });

            delete user.dataValues.id;
            delete user.dataValues.password;
            delete user.dataValues.isDeleted;
            delete user.dataValues.createdAt;
            delete user.dataValues.updatedAt;

            return generateResponse(
                req,
                res,
                StatusCodes.OK,
                true,
                "Admin data fetch successfully !",
                { data: user }
            );

        } catch (error) {
            return generateResponse(
                req,
                res,
                StatusCodes.INTERNAL_SERVER_ERROR,
                false,
                error.message || 'Something went wrong !',
                { data: {} }
            );
        }
    },

    adminDashboards: async (req, res) => {
        try {
            const [userCount, adminCount] = await Promise.all([
                User.count({
                    where: {
                        isDeleted: false
                    }
                }),
                Admin.count({
                    where: {
                        isDeleted: false
                    }
                }),
            ]);

            const data = [
                {
                    title: "Users",
                    stats: userCount.toString(),
                    color: 'success',
                    icon: 'ri-group-line'
                },
                {
                    title: "Admin",
                    stats: adminCount.toString(),
                    color: 'primary',
                    icon: 'ri-pie-chart-2-line'
                }
            ];

            // Return the response
            return generateResponse(
                req,
                res,
                StatusCodes.OK,
                true,
                "Data fetched successfully!",
                { data }
            );
        } catch (error) {
            // Handle errors
            return generateResponse(
                req,
                res,
                StatusCodes.INTERNAL_SERVER_ERROR,
                false,
                error.message || 'Something went wrong!',
                { data: {} }
            );
        }
    },

    notificationList: async (req, res) => {
        try {
            const data = await AdminNotifications.findAll({
                attributes: ['id', 'title', 'body'],
                order: [['createdAt', 'DESC']],
            });

            return generateResponse(
                req,
                res,
                StatusCodes.OK,
                true,
                "Data fetched successfully!",
                { data: data }
            );
        } catch (error) {
            return generateResponse(
                req,
                res,
                StatusCodes.INTERNAL_SERVER_ERROR,
                false,
                error.message || "Something went wrong!",
                { data: [] }
            );
        }
    },

    notificationCreate: async (req, res, next) => {
        try {
            const { title, body } = req.body;

            const payload = {
                title, body
            };

            await AdminNotifications.create(payload);

            const users = await User.findAll({
                attributes: ["id", "fcmToken"],
                where: {
                    fcmToken: { [Op.ne]: null }
                },
            });

            let notificationData = []
            for (const user of users) {
                const { fcmToken, id } = user;
                try {
                    let resp = await sendNotificationsToUser(fcmToken, title, body, "admin")
                    notificationData.push({
                        userId: id,
                        title,
                        body,
                        data: JSON.stringify(resp),
                        type: "admin",
                        isAdminNotification: true
                    })
                } catch (error) {
                    console.error(`Error sending notification to User ID: ${id} - `, error);
                }
            }
            await Notifications.bulkCreate(notificationData)

            return generateResponse(
                req,
                res,
                StatusCodes.CREATED,
                true,
                "Sending notification to the users !"
            );
        } catch (error) {
            return generateResponse(
                req,
                res,
                StatusCodes.INTERNAL_SERVER_ERROR,
                false,
                error.message || "Something went wrong!"
            );
        }
    },

    getPolicies: async (req, res) => {
        try {
            const { type } = req.body;
            let policies_data = await Policies.findOne({ where: { type } });
            policies_data = { ...policies_data.get() };

            delete policies_data.id
            delete policies_data.updatedAt
            delete policies_data.createdAt

            return generateResponse(
                req,
                res,
                StatusCodes.OK,
                true,
                "Data fetched successfully",
                { data: policies_data }
            );
        } catch (error) {
            return generateResponse(
                req,
                res,
                StatusCodes.INTERNAL_SERVER_ERROR,
                false,
                error.message || 'Something went wrong !',
                {}
            );
        }
    },

    getAllPolicies: async (req, res) => {
        try {
            let policies_data = await Policies.findAll();
            return generateResponse(
                req,
                res,
                StatusCodes.OK,
                true,
                "Data fetched successfully",
                { data: policies_data }
            );
        } catch (error) {
            return generateResponse(
                req,
                res,
                StatusCodes.INTERNAL_SERVER_ERROR,
                false,
                error.message || 'Something went wrong !',
                {}
            );
        }
    },

    editPolicies: async (req, res) => {
        try {
            const { type, content } = req.body;
            await Policies.update(
                { content },
                {
                    where: {
                        type
                    }
                },
            );
            return generateResponse(
                req,
                res,
                StatusCodes.OK,
                true,
                "Data updated successfully !"
            );
        } catch (error) {
            return generateResponse(
                req,
                res,
                StatusCodes.INTERNAL_SERVER_ERROR,
                false,
                error.message || 'Something went wrong !',
                {}
            );
        }
    },

    userList: async (req, res) => {
        try {
            const user = await User.findAll({
                where: {
                    isDeleted: false
                },
                order: [
                    ['createdAt', 'DESC'],
                ]
            });
            return generateResponse(
                req,
                res,
                StatusCodes.OK,
                true,
                "Data fetch successfully !",
                { data: user }
            );
        } catch (error) {
            return generateResponse(
                req,
                res,
                StatusCodes.INTERNAL_SERVER_ERROR,
                false,
                error.message || 'Something went wrong !',
                { data: [] }
            );
        }
    },

    deleteUser: async (req, res) => {
        try {
            const { secretId } = req.body;

            await User.update({ isDeleted: true }, {
                where: {
                    secretId: secretId,
                    isDeleted: false
                }
            });

            return generateResponse(
                req,
                res,
                StatusCodes.OK,
                true,
                "User deleted successfully !"
            );

        } catch (error) {
            return generateResponse(
                req,
                res,
                StatusCodes.INTERNAL_SERVER_ERROR,
                false,
                error.message || 'Something went wrong !'
            );
        }
    },
}

module.exports = adminController;