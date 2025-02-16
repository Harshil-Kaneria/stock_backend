
const Joi = require('joi');

const UserValidator = {
    userLoginRegisterValidationSchema: {
        body: Joi.object({
            email: Joi.string().required()
        }),
    },
    userVerifyOtpValidationSchema: {
        body: Joi.object({
            secretId: Joi.string().required(),
            otp: Joi.string().required(),
        }),
    },
    userResendOtpValidationSchema: {
        body: Joi.object({
            secretId: Joi.string().required()
        }),
    },
    userProfileValidationSchema: {
        body: Joi.object({
            countryCode: Joi.string().optional(),
            phoneNumber: Joi.string().optional(),
            name: Joi.string().optional(),
            email: Joi.string().email().optional(),
            language: Joi.string().optional(),
            country: Joi.string().optional(),
            gender: Joi.string().valid('male', 'female', 'other').optional(),
            dob: Joi.date().optional(),
            workoutPerWeek: Joi.string().optional(),
            otherApp: Joi.string().optional(),
            isImperial: Joi.boolean().optional(),
            height: Joi.string().optional(),
            heightUnit: Joi.string().optional(),
            heightSub: Joi.string().optional(),
            heightSubUnit: Joi.string().optional(),
            weight: Joi.string().optional(),
            weightUnit: Joi.string().optional(),
            goal: Joi.string().optional(),
            goalTarget: Joi.string().optional(),
            goalSpeed: Joi.string().optional(),
            stoppingGoal: Joi.string().optional(),
            diet: Joi.string().optional(),
            accomplish: Joi.string().optional(),
            profileImage: Joi.string().uri().optional(),
            isProfileCompleted: Joi.boolean().optional(),
            isNotificationOn: Joi.boolean().optional()
        })
    },
    updateFcmValidationSchema: {
        body: Joi.object({
            fcmToken: Joi.string().required()
        })
    },
    userUpdateRecommandationValidationSchema: {
        body: Joi.object({
            calories: Joi.string().optional(),
            carbs: Joi.string().optional(),
            protine: Joi.string().optional(),
            fats: Joi.string().optional()
        })
    },
    userUpdateFoodRecommandationValidationSchema: {
        body: Joi.object({
            id: Joi.string().required(),
            userDailyProgressId: Joi.string().required(),
            calories: Joi.string().optional(),
            carbs: Joi.string().optional(),
            protine: Joi.string().optional(),
            fats: Joi.string().optional(),
            ingredients: Joi.any().optional(),
        })
    },
    userChatbotSendMessagesValidationSchema: {
        body: Joi.object({
            isNewMessage: Joi.boolean().required(),
            chatId: Joi.when('isNewMessage', {
                is: false,
                then: Joi.string().required(),
                otherwise: Joi.string().optional()
            }),
            message: Joi.string().required()
        })
    },
    userPaymentValidationSchema: {
        body: Joi.object({
            receiptType: Joi.string().valid("android", "ios").required(),
            isRestore: Joi.boolean().optional(),
            transactionReceipt: Joi.string().optional(),
            purchaseToken: Joi.string().optional(),
            transactionDate: Joi.string().optional(),
            subscriptionAmount: Joi.string().optional(),
            dataAndroid: Joi.string().optional(),
            transactionId: Joi.string().optional(),
            originalTransactionIdentifierIOS: Joi.string().optional(),
            originalTransactionDateIOS: Joi.string().optional(),
            purchaseStateAndroid: Joi.string().optional(),
            signatureAndroid: Joi.string().optional(),
            isAcknowledgedAndroid: Joi.boolean().optional(),
            autoRenewingAndroid: Joi.boolean().optional()
        })
    },
}

module.exports = UserValidator;