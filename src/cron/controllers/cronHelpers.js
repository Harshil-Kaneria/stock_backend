import { Subscription, User } from "../../models"
const { objectData } = require('../../constant');
import { Op } from 'sequelize';
const Sequelize = require('sequelize');
let sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        logging: false,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT,
    }
);

export const handleSubscriptionForAndroid = async () => {
    try {
        // Query to get expired subscriptions
        const [getExpireSubscriptionsData] = await sequelize.query(`
          SELECT s.*, s.id as main_subscription_id, u.email 
          FROM subscription AS s 
          LEFT JOIN users AS u ON u.id = s.userId 
          WHERE (s.endDate < UTC_DATE()) 
          AND s.receiptType = "android" 
          AND u.isSubscribed = TRUE 
          ORDER BY s.id DESC
        `);

        for (let subscription of getExpireSubscriptionsData) {
            const paymentReceiptData = {
                payment: {
                    packageName: objectData.paymentAuth.android.packageName,
                    productId: subscription.productId,
                    receipt: subscription.purchaseToken,
                    subscription: true,
                },
                platform: "google",
            };

            const verifyReceiptData = await verifyPaymentReceipt({
                receipt: paymentReceiptData,
                receiptType: "android",
                email: subscription.email,
            });

            if (verifyReceiptData) {
                if (verifyReceiptData.expireDate && verifyReceiptData.startDate) {
                    await Subscription.update(
                        {
                            endDate: verifyReceiptData.expireDate,
                            startDate: verifyReceiptData.startDate,
                            isAcknowledgedAndroid: verifyReceiptData.isAcknowledgedAndroid,
                            autoRenewingAndroid: verifyReceiptData.autoRenewingAndroid,
                        },
                        { where: { id: subscription.main_subscription_id } }
                    );
                }

                await User.update(
                    {
                        isSubscribed: verifyReceiptData.isSubscribed,
                        autoSubscription: verifyReceiptData.autoRenewingAndroid,
                    },
                    { where: { id: subscription.userId } }
                );
            }
        }

    } catch (error) {
        console.error("Error handling subscriptions:", error);
    }
}

export const handleSubscriptionForIOS = async () => {
    try {
        // Raw SQL query to fetch expired subscriptions
        const [getExpireSubscriptionsData] = await sequelize.query(
            `SELECT s.*, s.id AS main_subscription_id, u.email 
         FROM subscription AS s 
         LEFT JOIN users AS u ON u.id = s.userId 
         WHERE s.endDate < CURDATE() 
         AND s.receiptType = 'ios' 
         AND u.isSubscribed = TRUE 
         ORDER BY s.id DESC`
        );

        for (const subscription of getExpireSubscriptionsData) {
            const paymentReceiptData = {
                payment: {
                    receipt: subscription.transactionReceipt,
                    secret: objectData.paymentAuth.ios.secretId,
                },
                platform: 'apple',
            };

            // Verify receipt using helper
            const verifyReceiptData = await verifyPaymentReceipt({
                receipt: paymentReceiptData,
                receiptType: 'ios',
            });

            if (verifyReceiptData) {
                if (verifyReceiptData.expireDate && verifyReceiptData.startDate) {
                    // Update subscription record
                    await Subscription.update(
                        {
                            endDate: verifyReceiptData.expireDate,
                            startDate: verifyReceiptData.startDate,
                        },
                        {
                            where: { id: subscription.main_subscription_id },
                        }
                    );
                }

                // Update user subscription status
                await User.update(
                    {
                        isSubscribed: verifyReceiptData.isSubscribed,
                        autoSubscription: verifyReceiptData.auto_renew_status,
                    },
                    {
                        where: { id: subscription.userId },
                    }
                );
            }
        }

        console.log('iOS subscription handling completed.');
    } catch (error) {
        console.error('Error handling iOS subscriptions:', error);
    }
};

export const handleFreeTrialsForUsers = async () => {
    try {
        const now = new Date();

        // Subtract 3 days from the current date
        const freeTrialEndTime = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

        // Fetch users with free trials not yet marked as ended
        const freeTrialUsers = await User.findAll({
            where: {
                isFreeTrialEnd: false,
                createdAt: { [Op.lte]: freeTrialEndTime }, // createdAt <= now - 3 days
            },
        });

        if (freeTrialUsers.length > 0) {
            // Update each user's isFreeTrialEnd status
            await User.update(
                { isFreeTrialEnd: true },
                {
                    where: {
                        id: freeTrialUsers.map(user => user.id),
                    },
                }
            );
            console.log(`${freeTrialUsers.length} user(s) marked as free trial ended.`);
        } else {
            console.log('No free trials to update.');
        }
    } catch (error) {
        console.error('Error handling free trial updates:', error);
    }
};