
require("dotenv").config();
const express = require("express");

const cors = require("cors");
const bodyParser = require('body-parser');
require("./src/config/database");
require('./src/cron/cronJob');

const multer = require('multer');
const upload = multer();
const path = require("path");

import { StatusCodes } from "http-status-codes";
import {
    generateResponse,
    upload_file,
    delete_file,
    sendMail,
    sendOtp,
    sendNotificationsToUser,
    verifyPaymentReceipt
} from "./src/helpers"

import publicApiRoutesV1 from './src/routes/public_api_v1';
import apiRoutesV1 from './src/routes/api_v1';
import apiMiddleware from './src/middleware/apiAuth';
import errorHandler from './src/middleware/errorHandler';

global.StatusCodes = StatusCodes
global.generateResponse = generateResponse
global.upload_file = upload_file
global.delete_file = delete_file
global.sendMail = sendMail
global.sendOtp = sendOtp
global.sendNotificationsToUser = sendNotificationsToUser
global.verifyPaymentReceipt = verifyPaymentReceipt

const app = express();

const corsOptions = {
    origin: '*',
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(upload.any());
app.use(express.static('uploads'));
// Middleware to parse JSON bodies
app.use('/api/v1', apiMiddleware, apiRoutesV1);
app.use('/public/api/v1', publicApiRoutesV1);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(errorHandler);

module.exports = app;
