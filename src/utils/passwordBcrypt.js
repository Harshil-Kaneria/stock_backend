
const bcrypt = require('bcrypt');
const { uuid } = require("unique-string-generator");

const hashPassword = async (plainPassword) => {
    const saltRounds = 11;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    return hashedPassword;
};

const verifyPassword = async (plainPassword, hashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
        return isMatch;
    } catch (error) {
        console.error('Error verifying password:', error);
        return false;
    }
};

function generatePassword(length = 8) {
    const uniqueStr = uuid.v4();
    let stringWithoutHyphens = uniqueStr.replace(/-/g, '');
    return stringWithoutHyphens.slice(0, length);
}

module.exports = {
    hashPassword,
    verifyPassword,
    generatePassword
};
