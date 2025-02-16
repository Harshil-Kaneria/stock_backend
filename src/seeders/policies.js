exports.seed = async function (knex) {
    return knex("policies").then(async function () {
        const moment = require("moment");
        const currentDateTime = moment().utc().format("YY-MM-DD HH:mm:ss");
        const policies = [
            {
                id: 1,
                type: "privacy_policy",
                content: "Default Privacy Policy content.",
                updatedAt: currentDateTime,
                createdAt: currentDateTime,
            },
            {
                id: 2,
                type: "terms_and_conditions",
                content: "Default Terms and Conditions content.",
                updatedAt: currentDateTime,
                createdAt: currentDateTime,
            },
        ];
        await knex("policies").del();
        await knex("policies").insert(policies);
    })
};
