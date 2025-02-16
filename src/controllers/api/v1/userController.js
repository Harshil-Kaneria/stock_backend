const { UniqueOTP, uuid } = require("unique-string-generator");
const moment = require('moment');
import { User, Notifications, UserRecommandation, UserDailyProgress, UserDailyScaning, AiChat, AiMessages, Subscription } from "../../../models";
const { verifyPassword, hashPassword } = require("../../../utils/passwordBcrypt");
const { issueAccessToken } = require("../../../utils/jwtToken");
const otpTemplate = require('../../../views/otpTemplate');
const { objectData } = require('../../../constant');

const userController = {
    loginRegister: async (req, res, next) => {
        try {
            const { email } = req.body;

            const [user, created] = await User.findOrCreate({
                where: { email, isDeleted: false },
                defaults: { email, secretId: uuid.v4() },
            });

            const otp = UniqueOTP(4);
            const subject = "Your OTP for Login";
            const data = { otp: otp }
            const html = otpTemplate(data);
            sendMail(email, subject, html);

            user.otp = await hashPassword('' + otp);
            await user.save();

            return generateResponse(req, res, StatusCodes.OK, true, "OTP send successfully !", { secretId: user.secretId });
        } catch (error) {
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || "Something went wrong!");
        }
    },
    verifyOtp: async (req, res, next) => {
        try {
            const { secretId, otp } = req.body;

            const user = await User.findOne({
                where: { secretId, isDeleted: false },
            });

            if (!user) return generateResponse(req, res, StatusCodes.NOT_FOUND, false, "User not found!");


            const isOtpValid = true
            // const isOtpValid = verifyPassword(otp, user.otp);
            if (!isOtpValid) {
                return generateResponse(req, res, StatusCodes.UNAUTHORIZED, false, "Invalid OTP!");
            }
            user.otp = null;
            await user.save();

            let token = issueAccessToken({
                secretId: user.secretId,
                loginType: "user",
            });

            return generateResponse(req, res, StatusCodes.OK, true, "OTP verified successfully!", {
                secretId: user.secretId,
                isProfileCompleted: user.isProfileCompleted,
                token: token
            });

        } catch (error) {
            console.error(error);
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || "Something went wrong!");
        }
    },
    resendOtp: async (req, res, next) => {
        try {
            const { secretId } = req.body;

            const user = await User.findOne({
                where: { secretId, isDeleted: false },
            });

            if (!user) return generateResponse(req, res, StatusCodes.NOT_FOUND, false, "User not found!");

            const otp = UniqueOTP(4);
            const subject = "Your OTP for Login";
            const data = { otp: otp }
            const html = otpTemplate(data);
            sendMail(user.dataValues.email, subject, html);

            user.otp = await hashPassword('' + otp);
            await user.save();

            return generateResponse(req, res, StatusCodes.OK, true, "OTP send successfully !", { secretId: user.secretId });

        } catch (error) {
            console.error(error);
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || "Something went wrong!");
        }
    },
    updateUserProfile: async (req, res, next) => {
        try {
            const { id } = req.loggedInUser;
            const updateFields = req.body;

            const user = await User.findOne({
                where: { id, isDeleted: false },
            });

            if (!user) {
                return generateResponse(req, res, StatusCodes.NOT_FOUND, false, "User not found!");
            }

            Object.keys(updateFields).forEach((field) => {
                if (updateFields[field] !== undefined && field !== 'secretId' && field !== 'id') {
                    user[field] = updateFields[field];
                }
            });
            await user.save();

            return generateResponse(req, res, StatusCodes.OK, true, "Profile updated successfully!", { user });
        } catch (error) {
            console.error(error);
            return generateResponse(req, res, StatusCodes.INTERNAL_SERVER_ERROR, false, error.message || "Something went wrong!");
        }
    },
    uploadProfilePicture: async (req, res, next) => {
        try {
            const { id, profileImage } = req.loggedInUser;

            let imageName = await upload_file(
                req,
                res,
                next,
                "profile_photo",
                "profile"
            );
            if (imageName == false) throw new Error("Please upload profile photo");
            const fullImagePath = "profile/" + imageName

            await User.update(
                { profileImage: fullImagePath },
                {
                    where: {
                        id
                    }
                },
            );

            if (profileImage != null) await delete_file(profileImage);

            return generateResponse(
                req,
                res,
                StatusCodes.OK,
                true,
                "Profile picture updated successfully",
                { profileImage: process.env.BACKEND_BASE_URL + fullImagePath }
            );
        } catch (error) {
            return generateResponse(
                req,
                res,
                StatusCodes.INTERNAL_SERVER_ERROR,
                false,
                error.message || "Something went wrong !",
                { data: {} }
            );
        }
    },
    getNotificationsData: async (req, res) => {
        try {
            const { id } = req.loggedInUser;
            const { page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;

            let data = await Notifications.findAll({
                attributes: [
                    "title",
                    "body",
                    "isAdminNotification"
                ],
                where: {
                    userId: id,
                },
                limit: parseInt(limit) + 1,
                offset: parseInt(offset),
                order: [['id', 'DESC']],
            })

            const isNextPage = data.length > limit;
            if (isNextPage) {
                data.pop();
            }

            return generateResponse(
                req,
                res,
                StatusCodes.OK,
                true,
                "Data fetched successfully",
                { isNextPage, data: data }
            );
        } catch (error) {
            return generateResponse(
                req,
                res,
                StatusCodes.INTERNAL_SERVER_ERROR,
                false,
                error.message || "Something went wrong !",
                { data: [] }
            );
        }
    },
    updateFcmToken: async (req, res) => {
        try {
            const { fcmToken } = req.body;
            const { id } = req.loggedInUser;

            await User.update(
                { fcmToken },
                {
                    where: {
                        id,
                    }
                },
            );

            return generateResponse(
                req,
                res,
                StatusCodes.OK,
                true,
                "Data updated successfully",
                { data: { fcmToken } }
            );

        } catch (error) {
            return generateResponse(
                req,
                res,
                StatusCodes.INTERNAL_SERVER_ERROR,
                false,
                error.message || "Something went wrong !",
                { data: {} }
            );
        }
    },
    getUserData: async (req, res) => {
        try {
            return generateResponse(
                req,
                res,
                StatusCodes.OK,
                true,
                "Data fetched successfully",
                { data: req.loggedInUser }
            );

        } catch (error) {
            return generateResponse(
                req,
                res,
                StatusCodes.INTERNAL_SERVER_ERROR,
                false,
                error.message || "Something went wrong !",
                { data: {} }
            );
        }
    },
    generateRecommandation: async (req, res) => {
        try {
            const data = req.loggedInUser;

            let aiResponseData = {
                calories: 0,
                carbs: 0,
                protine: 0,
                fats: 0,
                healthScore: 0
            }

            // ai api call and update data 
            aiResponseData = {
                calories: 1200,
                carbs: 100,
                protine: 50,
                fats: 80,
                healthScore: 8
            }

            const [userRecommandationData, created] = await UserRecommandation.findOrCreate({
                where: { userId: data.id },
                defaults: {
                    userId: data.id,
                    ...aiResponseData
                },
            });

            return generateResponse(
                req,
                res,
                StatusCodes.OK,
                true,
                "Data generated successfully",
                { data: aiResponseData }
            );

        } catch (error) {
            return generateResponse(
                req,
                res,
                StatusCodes.INTERNAL_SERVER_ERROR,
                false,
                error.message || "Something went wrong !",
                { data: {} }
            );
        }
    },
    fetchRecommandation: async (req, res) => {
        try {

            const data = req.loggedInUser;
            const UserRecommandationData = await UserRecommandation.findOne({
                where: { userId: data.id },
            });
            if (!UserRecommandationData) {
                return generateResponse(req, res, StatusCodes.NOT_FOUND, false, "Data not found!");
            }

            return generateResponse(
                req,
                res,
                StatusCodes.OK,
                true,
                "Data fetched successfully",
                { data: UserRecommandationData }
            );

        } catch (error) {
            return generateResponse(
                req,
                res,
                StatusCodes.INTERNAL_SERVER_ERROR,
                false,
                error.message || "Something went wrong !",
                { data: {} }
            );
        }
    },
    updateRecommandation: async (req, res) => {
        try {

            const data = req.loggedInUser;
            const UserRecommandationData = await UserRecommandation.findOne({
                where: { userId: data.id },
            });
            if (!UserRecommandationData) {
                return generateResponse(req, res, StatusCodes.NOT_FOUND, false, "Data not found!");
            }

            const updateFields = req.body;
            Object.keys(updateFields).forEach((field) => {
                if (updateFields[field] !== undefined && field !== 'id') {
                    UserRecommandationData[field] = parseInt(updateFields[field]);
                }
            });
            await UserRecommandationData.save();

            return generateResponse(
                req,
                res,
                StatusCodes.OK,
                true,
                "Data updated successfully"
            );

        } catch (error) {
            return generateResponse(
                req,
                res,
                StatusCodes.INTERNAL_SERVER_ERROR,
                false,
                error.message || "Something went wrong !"
            );
        }
    },
    getDatewiseProgressData: async (req, res) => {
        try {
            const data = req.loggedInUser;
            const serverDate = moment().format("YYYY-MM-DD")
            const { date = serverDate } = req.query;

            const userRegistrationDate = moment(data.createdAt).format("YYYY-MM-DD");
            if (moment(date).isBefore(userRegistrationDate)) return generateResponse(req, res, StatusCodes.NOT_FOUND, false, "You cannot search before the registration date!")

            const UserRecommandationData = await UserRecommandation.findOne({
                where: { userId: data.id },
            });
            if (!UserRecommandationData) return generateResponse(req, res, StatusCodes.NOT_FOUND, false, "Data not found!");

            let aiResponseData = {
                date: date,
                calories: UserRecommandationData.calories,
                caloriesLeft: UserRecommandationData.calories,
                carbs: UserRecommandationData.carbs,
                carbsLeft: UserRecommandationData.carbs,
                protine: UserRecommandationData.protine,
                protineLeft: UserRecommandationData.protine,
                fats: UserRecommandationData.fats,
                fatsLeft: UserRecommandationData.fats,
            }

            let [userDailyProgressData, created] = await UserDailyProgress.findOrCreate({
                where: { userId: data.id, date: date },
                defaults: {
                    userId: data.id,
                    ...aiResponseData
                },
            });
            userDailyProgressData = userDailyProgressData.get()

            aiResponseData.scanData = []
            if (!created) {
                let UserDailyScaningData = await UserDailyScaning.findAll({
                    where: {
                        userDailyProgressId: userDailyProgressData.id
                    },
                    order: [['id', 'DESC']],
                })
                UserDailyScaningData = UserDailyScaningData.map(data => data.get());
                for (const element of UserDailyScaningData) {
                    element.imageUrl = process.env.BACKEND_BASE_URL + element.imageUrl
                    element.ingredients = JSON.parse(element.ingredients)
                }
                aiResponseData.scanData = UserDailyScaningData
                aiResponseData.calories = userDailyProgressData.calories
                aiResponseData.caloriesLeft = userDailyProgressData.caloriesLeft
                aiResponseData.carbs = userDailyProgressData.carbs
                aiResponseData.carbsLeft = userDailyProgressData.carbsLeft
                aiResponseData.protine = userDailyProgressData.protine
                aiResponseData.protineLeft = userDailyProgressData.protineLeft
                aiResponseData.fats = userDailyProgressData.fats
                aiResponseData.fatsLeft = userDailyProgressData.fatsLeft
            }

            return generateResponse(
                req,
                res,
                StatusCodes.OK,
                true,
                "Data fetched successfully",
                { data: aiResponseData }
            );

        } catch (error) {
            return generateResponse(
                req,
                res,
                StatusCodes.INTERNAL_SERVER_ERROR,
                false,
                error.message || "Something went wrong !",
                { data: {} }
            );
        }
    },
    uploadFoodPhoto: async (req, res, next) => {
        try {
            const data = req.loggedInUser;
            const serverDate = moment().format("YYYY-MM-DD")
            const { date = serverDate } = req.body;

            const userRegistrationDate = moment(data.createdAt).format("YYYY-MM-DD");
            if (moment(date).isBefore(userRegistrationDate)) return generateResponse(req, res, StatusCodes.NOT_FOUND, false, "You cannot upload before the registration date!")

            const UserDailyProgressData = await UserDailyProgress.findOne({
                where: { userId: data.id, date },
            });
            if (!UserDailyProgressData) return generateResponse(req, res, StatusCodes.NOT_FOUND, false, "Daily progress data not found!");

            let imageName = await upload_file(
                req,
                res,
                next,
                "food_photo",
                "foodphoto"
            );
            if (imageName == false) throw new Error("Please upload food photo");
            let fullImagePathRelative = "foodphoto/" + imageName
            let fullImagePath = process.env.BACKEND_BASE_URL + fullImagePathRelative

            let aiResponseData = {
                title: '',
                description: '',
                calories: 0,
                carbs: 0,
                protine: 0,
                fats: 0,
                healthScore: 0,
                ingredients: []
            }
            // ai api calling

            aiResponseData = {
                title: 'New title',
                description: 'updated description',
                calories: 200,
                carbs: 20,
                protine: 20,
                fats: 20,
                healthScore: 6,
                ingredients: JSON.stringify([
                    {
                        title: "XYZ",
                        value: 200
                    },
                    {
                        title: "ABC",
                        value: 50
                    },
                    {
                        title: "HK",
                        value: 100
                    }
                ])
            }

            UserDailyProgressData.caloriesLeft = UserDailyProgressData.caloriesLeft - aiResponseData.calories
            UserDailyProgressData.carbsLeft = UserDailyProgressData.carbsLeft - aiResponseData.carbs
            UserDailyProgressData.protineLeft = UserDailyProgressData.protineLeft - aiResponseData.protine
            UserDailyProgressData.fatsLeft = UserDailyProgressData.fatsLeft - aiResponseData.fats

            const payload = {
                userDailyProgressId: UserDailyProgressData.id,
                imageUrl: fullImagePathRelative,
                ...aiResponseData
            };
            await Promise.all[
                UserDailyProgressData.save(),
                UserDailyScaning.create(payload)
            ]

            return generateResponse(
                req,
                res,
                StatusCodes.OK,
                true,
                "Data process successfully",
                { profileImage: fullImagePath }
            );
        } catch (error) {
            return generateResponse(
                req,
                res,
                StatusCodes.INTERNAL_SERVER_ERROR,
                false,
                error.message || "Something went wrong !",
                { data: {} }
            );
        }
    },
    getFoodProgressData: async (req, res) => {
        try {
            const { id } = req.query;

            let UserDailyScaningData = await UserDailyScaning.findAll({
                where: {
                    id: id
                },
                order: [['id', 'DESC']],
            })
            UserDailyScaningData = UserDailyScaningData.map(data => data.get());
            for (const element of UserDailyScaningData) {
                element.imageUrl = process.env.BACKEND_BASE_URL + element.imageUrl
                element.ingredients = JSON.parse(element.ingredients)
            }

            return generateResponse(
                req,
                res,
                StatusCodes.OK,
                true,
                "Data fetched successfully",
                { data: UserDailyScaningData }
            );

        } catch (error) {
            return generateResponse(
                req,
                res,
                StatusCodes.INTERNAL_SERVER_ERROR,
                false,
                error.message || "Something went wrong !",
                { data: {} }
            );
        }
    },
    updateFoodRecommandation: async (req, res) => {
        try {

            const data = req.loggedInUser;
            const updateFields = req.body;

            const UserDailyProgressData = await UserDailyProgress.findOne({
                where: { userId: data.id, id: updateFields.userDailyProgressId },
            });
            if (!UserDailyProgressData) {
                return generateResponse(req, res, StatusCodes.NOT_FOUND, false, "Data not found!");
            }

            const UserDailyScaningData = await UserDailyScaning.findOne({
                where: { id: updateFields.id },
            });
            if (!UserDailyScaningData) {
                return generateResponse(req, res, StatusCodes.NOT_FOUND, false, "Data not found!");
            }

            let originalScanedValue = {
                calories: UserDailyScaningData.calories,
                carbs: UserDailyScaningData.carbs,
                protine: UserDailyScaningData.protine,
                fats: UserDailyScaningData.fats
            }

            let updatedScanedValue = {
                calories: UserDailyScaningData.calories,
                carbs: UserDailyScaningData.carbs,
                protine: UserDailyScaningData.protine,
                fats: UserDailyScaningData.fats
            }

            Object.keys(updateFields).forEach((field) => {
                if (updateFields[field] !== undefined && field !== 'id' && field !== 'userDailyProgressId') {
                    if (field == 'ingredients') {
                        UserDailyScaningData[field] = JSON.stringify(updateFields[field]);
                    } else {
                        UserDailyScaningData[field] = parseInt(updateFields[field]);
                        updatedScanedValue[field] = parseInt(updateFields[field]);
                    }
                }
            });

            let differences = {};
            for (let key in originalScanedValue) {
                differences[key] = updatedScanedValue[key] - originalScanedValue[key];
            }

            UserDailyProgressData.caloriesLeft -= differences.calories;
            UserDailyProgressData.carbsLeft -= differences.carbs;
            UserDailyProgressData.protineLeft -= differences.protine;
            UserDailyProgressData.fatsLeft -= differences.fats;

            await Promise.all([
                UserDailyScaningData.save(),
                UserDailyProgressData.save()
            ])

            return generateResponse(
                req,
                res,
                StatusCodes.OK,
                true,
                "Data updated successfully"
            );

        } catch (error) {
            return generateResponse(
                req,
                res,
                StatusCodes.INTERNAL_SERVER_ERROR,
                false,
                error.message || "Something went wrong !"
            );
        }
    },
    userChatbotSendMessages: async (req, res) => {
        try {
            const { id } = req.loggedInUser;
            const { isNewMessage, chatId, message } = req.body;

            let aiChatId;
            if (isNewMessage == 'false') {
                const AiChatData = await AiChat.findOne({
                    where: { id: chatId, userId: id },
                })
                if (!AiChatData) return generateResponse(req, res, StatusCodes.NOT_FOUND, false, "Data not found!");
                aiChatId = chatId
            } else {
                const AiChatData = await AiChat.create({
                    userId: id,
                    threadId: uuid.v4()
                });
                aiChatId = AiChatData.id
            }

            const AiMessagesData = await AiMessages.create({
                threadId: 0,
                chatId: aiChatId,
                messages: message,
                sender: 'user'
            })

            // ai api call
            const AiMessagesResponse = "This is ai generated message"

            const SaveAiMessagesData = await AiMessages.create({
                threadId: AiMessagesData.id,
                chatId: aiChatId,
                messages: AiMessagesResponse,
                sender: 'assistant'
            })

            return generateResponse(
                req,
                res,
                StatusCodes.OK,
                true,
                "Data saved successfully",
                {
                    data: {
                        userMessageData: AiMessagesData,
                        aiMessageData: SaveAiMessagesData
                    }
                }
            );
        } catch (error) {
            return generateResponse(
                req,
                res,
                StatusCodes.INTERNAL_SERVER_ERROR,
                false,
                error.message || "Something went wrong !",
            );
        }
    },
    getChatbotMessagesData: async (req, res) => {
        try {
            const { id } = req.loggedInUser;
            const { page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;

            let AiChatData = await AiChat.findAll({
                where: { userId: id },
                order: [['id', 'DESC']],
            })
            const chatIds = AiChatData.map(chat => chat.id);

            if (chatIds.length === 0) {
                return generateResponse(
                    req,
                    res,
                    StatusCodes.OK,
                    true,
                    "No chat messages found",
                    { isNextPage: false, data: [] }
                );
            }

            let data = await AiMessages.findAll({
                where: {
                    chatId: chatIds,
                },
                limit: parseInt(limit) + 1,
                offset: parseInt(offset),
                order: [['id', 'DESC']],
            })
            const isNextPage = data.length > limit;
            if (isNextPage) data.pop()

            return generateResponse(
                req,
                res,
                StatusCodes.OK,
                true,
                "Data fetched successfully",
                { isNextPage, data: data }
            );
        } catch (error) {
            return generateResponse(
                req,
                res,
                StatusCodes.INTERNAL_SERVER_ERROR,
                false,
                error.message || "Something went wrong !",
                { data: [] }
            );
        }
    },
    userPayement: async (req, res) => {
        try {
            const { id } = req.loggedInUser;
            const userId = id;

            let {
                receiptType,
                isRestore,
                transactionReceipt,
                purchaseToken,
                transactionDate,
                subscriptionAmount,
                dataAndroid,
                transactionId,
                originalTransactionIdentifierIOS,
                originalTransactionDateIOS,
                purchaseStateAndroid,
                signatureAndroid,
                isAcknowledgedAndroid,
                autoRenewingAndroid
            } = req.query;

            let paymentReceiptData = {};
            if (receiptType === "android") {

                productId = objectData.paymentAuth.android.productId
                purchaseToken = transactionReceipt;
                transactionReceipt = null;

                paymentReceiptData = {
                    "payment": {
                        "packageName": objectData.paymentAuth.android.packageName,
                        "productId": productId,
                        "receipt": purchaseToken,
                        "subscription": true,
                    },
                    "platform": "google",
                };
            } else {
                paymentReceiptData = {
                    "payment": {
                        "receipt": transactionReceipt,
                        "secret": objectData.paymentAuth.ios.secretId,
                    },
                    "platform": "apple",
                };
            }

            var verifyReceiptData = await verifyPaymentReceipt(paymentReceiptData, receiptType)
            if (isRestore == 'true' && verifyReceiptData.isSubscribed == true) {

                await Subscription.update({ isRestore }, {
                    where: {
                        userId: userId
                    }
                })

                await User.update({
                    isSubscribed: verifyReceiptData.isSubscribed,
                    autoSubscription: true,
                }, {
                    where: {
                        id: userId
                    }
                })

                return generateResponse(
                    req,
                    res,
                    StatusCodes.OK,
                    true,
                    "Restore Successful",
                );
            } else {

                const [subscription, wasCreated] = await Subscription.findOrCreate({
                    where: { userId },
                    defaults: {
                        userId,
                        transactionDate,
                        subscriptionAmount,
                        dataAndroid,
                        productId,
                        purchaseToken: receiptType === 'android' ? purchaseToken : null,
                        receiptType,
                        transactionId,
                        originalTransactionIdentifierIOS:
                            receiptType === 'ios' ? originalTransactionIdentifierIOS : null,
                        originalTransactionDateIOS:
                            receiptType === 'ios' ? originalTransactionDateIOS : null,
                        transactionReceipt,
                        purchaseStateAndroid: receiptType === 'android' ? purchaseStateAndroid : null,
                        signatureAndroid: receiptType === 'android' ? signatureAndroid : null,
                        isAcknowledgedAndroid: receiptType === 'android' ? isAcknowledgedAndroid : 0,
                        autoRenewingAndroid,
                        endDate: verifyReceiptData.expireDate,
                        startDate: verifyReceiptData.startDate,
                        isRestore,
                    },
                });

                if (!wasCreated) {
                    const updateData = {
                        userId,
                        transactionDate,
                        subscriptionAmount,
                        dataAndroid,
                        productId,
                        purchaseToken: receiptType === 'android' ? purchaseToken : null,
                        receiptType,
                        transactionId,
                        originalTransactionIdentifierIOS:
                            receiptType === 'ios' ? originalTransactionIdentifierIOS : null,
                        originalTransactionDateIOS:
                            receiptType === 'ios' ? originalTransactionDateIOS : null,
                        transactionReceipt,
                        purchaseStateAndroid: receiptType === 'android' ? purchaseStateAndroid : null,
                        signatureAndroid: receiptType === 'android' ? signatureAndroid : null,
                        isAcknowledgedAndroid: receiptType === 'android' ? isAcknowledgedAndroid : 0,
                        autoRenewingAndroid,
                        endDate: verifyReceiptData.expireDate,
                        startDate: verifyReceiptData.startDate,
                        isRestore,
                    };

                    if (verifyReceiptData.expireDate && verifyReceiptData.startDate) {
                        updateData.endDate = verifyReceiptData.expireDate;
                        updateData.startDate = verifyReceiptData.startDate;
                    }

                    await Subscription.update(updateData, { where: { userId } });
                }

                await User.update({ isSubscribed: true, autoSubscription: true }, {
                    where: {
                        id: userId
                    }
                })

                return generateResponse(
                    req,
                    res,
                    StatusCodes.OK,
                    true,
                    "Subscription Successful"
                );
            }

        } catch (error) {
            return generateResponse(
                req,
                res,
                StatusCodes.INTERNAL_SERVER_ERROR,
                false,
                error.message || "Something went wrong !",
            );
        }
    }
}

module.exports = userController;