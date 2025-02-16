
const Joi = require('joi');

const AdminValidator = {
    adminLoginValidationSchema: {
        body: Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            loginType: Joi.string().valid('admin', 'college', 'organisation').default('admin'),
        }),
    },

    adminForgotPasswordValidator: {
        body: Joi.object({
            email: Joi.string().email().required(),
        }),
    },

    adminVerifyResetPasswordValidator: {
        body: Joi.object({
            otp: Joi.number().required(),
        }),
    },

    adminResetPasswordValidator: {
        body: Joi.object({
            password: Joi.string().required()
        }),
    },

    registerValidator: {
        body: Joi.object({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        })
    },

    updateValidator: {
        body: Joi.object({
            secretId: Joi.string().required(),
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().optional(),
        })
    },

    deleteAdminValidator: {
        body: Joi.object({
            secretId: Joi.string().required()
        })
    },

    detailsAdminValidator: {
        body: Joi.object({
            secretId: Joi.string().required()
        })
    },

    notificationCreateValidator: {
        body: Joi.object({
            title: Joi.string().required(),
            body: Joi.string().required(),
        })
    },

    editPoliciesValidator: {
        body: Joi.object({
            type: Joi.string().valid('privacy_policy', 'terms_and_conditions').required(),
            content: Joi.string().required()
        })
    },

    deleteUserValidator: {
        body: Joi.object({
            secretId: Joi.string().required()
        })
    }

}

module.exports = AdminValidator;