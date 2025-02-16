import { Admin } from "../../models";
const { verifyPassword, hashPassword } = require("../../utils/passwordBcrypt");
const { issueAccessToken } = require("../../utils/jwtToken");


const AdminServices = {
    async login(req, res, next) {
        const { email, password } = req.body;
        let user = await Admin.findOne({
            where: { email, isDeleted: false }
        });

        if (!user) {
            return generateResponse(req, res, StatusCodes.BAD_REQUEST, false, "Incorrect Email Id");
        }

        const isMatch = await verifyPassword(password, user.password);
        if (!isMatch) {
            return generateResponse(req, res, StatusCodes.BAD_REQUEST, false, "Incorrect Password");
        }

        let token = issueAccessToken({
            secretId: user.secretId,
            loginType: "admin",
        });

        delete user.dataValues.password;

        const adminLoginResponse = {
            data: { user, token }
        };

        return generateResponse(req, res, StatusCodes.OK, true, "Login successfully !", adminLoginResponse);
    },
    async getProfileDetails(req, res, next) {
        const { secretId } = req.loggedInUser;
        const user = await Admin.findOne({
            where: {
                secretId: secretId,
                isDeleted: false
            },
            attributes: { exclude: ['password', 'isDeleted', 'updatedAt'] }
        });

        return { user: user };
    }
}

module.exports = AdminServices;