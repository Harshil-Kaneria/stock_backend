
const Joi = require('joi');

const PoliciesValidator = {
    getPoliciesValidationSchema: {
        body: Joi.object({
            type: Joi.string().valid('privacy_policy', 'terms_and_conditions').required(),
        }),
    }
}

module.exports = PoliciesValidator;