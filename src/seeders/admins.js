

exports.seed = async function (knex) {
    const { hashPassword } = require('../utils/passwordBcrypt');
    const { uuid } = require("unique-string-generator");

    const generatedHashPassword = await hashPassword('Admin@123')

    await knex('admins').del()
    await knex('admins').insert([
        {
            name: 'Super Admin',
            password: generatedHashPassword,
            email: 'superAdmin@admin.com',
            secretId: uuid.v4(),
            adminType: 'superAdmin'
        },
    ]);
};
