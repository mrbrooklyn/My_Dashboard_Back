const Joi = require('@hapi/joi');

const register = Joi.object({
  first_name: Joi.string().allow('').example('lorem').default(null),
  last_name: Joi.string().allow('').example('ipsum').default(null),
  email: Joi.string().email().allow('').trim().example('lorem@gmail.com').default(null).required(),
  password: Joi.string().allow('').example('password').default(null).required(),
  phone: Joi.string().regex(/^\d+$/).min(8).max(12).trim().allow('').example('0123456789').default(null),
});

const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const refreshToken = Joi.object({
  token: Joi.string().required(),
});

module.exports = {
  register,
  login,
  refreshToken,
};