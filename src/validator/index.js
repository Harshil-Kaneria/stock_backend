
// admin module validator 
const adminValidator = require('./admin/adminValidator');
const userValidator = require('./user/userValidator');
const policiesValidator = require('./policies/policiesValidator');


const dataValidator = {
    // admin validator
    adminValidator: adminValidator,

    // user Validator
    userValidator: userValidator,

    // policies Validator,
    policiesValidator: policiesValidator,
}

module.exports = dataValidator;
