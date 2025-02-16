import { getReasonPhrase } from "http-status-codes";
const { uuid, UniqueOTP } = require("unique-string-generator");
const twilio = require('twilio');
const nodemailer = require("nodemailer");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');
const { objectData } = require('../constant');
const firebaseAdmin = require('firebase-admin');
const serviceAccount = require('./nutriscan-5d33d-firebase-adminsdk-cvp6c-2a4ecfa9a9.json');
firebaseAdmin.initializeApp({ credential: firebaseAdmin.credential.cert(serviceAccount) });


export const generateResponse = (
    req,
    res,
    status_code,
    status,
    message = "",
    data
) => {
    message = message === "" ? getReasonPhrase(status_code) : message;

    const response = {
        status,
        message,
        ...data,
    };

    return res.status(status_code).json(response);
};

export const upload_file = async function (
    req,
    res,
    next,
    file_name = "",
    directory_name = "",
    allowedTypes = []

) {
    const files = req.files;
    if (files && files.length > 0) {
        for (const file of files) {
            if (file.fieldname === file_name) {
                const fileExtension = file.mimetype.split('/')[1];
                if (allowedTypes.length > 0 && !allowedTypes.includes(fileExtension)) {
                    return false;
                }
                const filename = uuidv4() + "_" + file.originalname.replace(/\s/g, "");
                let dirname = `./${objectData.UPLOAD_DIR}`;
                if (directory_name) {
                    dirname += `/${directory_name}`;
                }

                if (!fs.existsSync(dirname)) {
                    fs.mkdirSync(dirname, { recursive: true });
                }

                const filePath = `${dirname}/${filename}`;
                try {
                    fs.writeFileSync(filePath, file.buffer);
                    return filename;
                } catch (error) {
                    return false;
                }
            }
        }
    } else {
        return false;
    }
};

export const delete_file = async function (file_path = "") {
    if (!file_path) {
        throw new Error("File path is required");
    }
    try {
        file_path = "./" + objectData.UPLOAD_DIR + "/" + file_path;
        if (fs.existsSync(file_path)) {
            await fs.promises.unlink(file_path);
            return true;
        } else {
            return false;
            // throw new Error("File does not exist");
        }
    } catch (error) {
        console.error("Error deleting file:", error);
        return false;
    }
};

export const sendMail = async function (to = "", subject = "", html = "", attachements = "") {
    try {

        if (to == "" || subject == "" || html == "") return false

        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        const info = await transporter.sendMail({
            from: process.env.MAIL_SENDER,
            to: to,
            subject: subject,
            html: html,
            attachements: attachements
        });

        return true

    } catch (err) {
        console.log('send_mail error', err)
        return false
    }

}

export const sendOtp = async (toPhoneNumber) => {
    try {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
        const client = twilio(accountSid, authToken);

        const otp = UniqueOTP(4);
        const message = `Your OTP is ${otp}. It is valid for 10 minutes.`;

        const response = await client.messages.create({
            body: message,
            from: twilioPhoneNumber,
            to: toPhoneNumber,
        });

        return {
            status: true,
            otp: otp,
            error: null,
        }
    } catch (error) {
        return {
            status: false,
            otp: null,
            error: error,
        }
    }
}

export const sendNotificationsToUser = async (token, title, body, type = "") => {
    try {
        const message = {
            notification: {
                title,
                body,
            },
            data: {
                title,
                body,
                type,
            },
            token,
        };
        const response = await firebaseAdmin.messaging().send(message);
        return {
            status: true,
            response: response
        }
    } catch (error) {
        console.error('Error sending notification:', error);
        return {
            status: false,
            response: error
        }
    }
}

export const verifyPaymentReceipt = async (receipt, receiptType) => {
    var moment = require('moment');
    let toDaydate = moment(new Date()).utc().format("YYYY-MM-DD");
    var isSubscribed = false;
    var payemntStartDate = null;
    var paymentExpireDate = null;
    var isReceiptDeveloperPayloadError = false;

    const platforms = {
        apple: require("./../utils/apple"),
        google: require("./../utils/google"),
    };
    const engine = receipt.platform === 'apple' ? platforms['apple'] : platforms['google'];
    let expireDate = null;
    let startDate = null;
    return engine.verifyPayment(receipt.payment, function (error, result) {
        if (error) {
            return {
                isSubscribed: isSubscribed,
                expireDate: paymentExpireDate,
                startDate: payemntStartDate,
                isReceiptDeveloperPayloadError: isReceiptDeveloperPayloadError
            };
        }

        if (result.expirationDate && result.purchaseDate) {
            expireDate = moment(result.expirationDate).format("YYYY-MM-DD");
            startDate = moment(result.purchaseDate).format("YYYY-MM-DD");

            if (expireDate && (expireDate < toDaydate)) {
                isSubscribed = false;
                paymentExpireDate = expireDate;
                payemntStartDate = startDate;

            } else {
                isSubscribed = true;
                paymentExpireDate = expireDate;
                payemntStartDate = startDate;
            }
        }

        return {
            isSubscribed: isSubscribed,
            expireDate: paymentExpireDate,
            startDate: payemntStartDate,
            isReceiptDeveloperPayloadError: isReceiptDeveloperPayloadError
        };
    });
}