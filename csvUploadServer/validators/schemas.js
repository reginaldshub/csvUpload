const Joi = require('@hapi/joi');

module.exports = {

    registerschema: Joi.object().keys({
        username: Joi.string().alphanum().min(3).max(30).required(),
        email: Joi.string().email().lowercase().required(),
        password: Joi.string().regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/),
    }),

    loginschema: Joi.object().keys({
        email: Joi.string().email().lowercase().required(),
        password: Joi.string().required(),
    }),

    userDetails: Joi.object().keys({
        username:Joi.string().required(),
        password: Joi.string(),
        place: Joi.string(),
        latitude: Joi.string(),
        longitude: Joi.string()
    })
}