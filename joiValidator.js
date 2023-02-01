const Joi = require("joi");
const formatErrorMsg = require("./util/formatErrorMsg");

const isJoiErrors = {
  contact: async (payload) => {
    const schema = {
      email: Joi.string()
        .required()
        .email({ tlds: { allow: false } }),
      name: Joi.string().required().max(32).min(1),
      tel: Joi.string()
        .regex(RegExp(/[\d+()]+/))
        .required()
        .max(16)
        .min(1),
      message: Joi.string().required().min(1).max(1024),
    };

    const _joiInstance = Joi.object(schema);

    try {
      const value = await _joiInstance.validateAsync(payload, {
        abortEarly: false,
      });
      // if validation succeeds, return false (no errors)
      return false;
    } catch (errors) {
      // if validation fails, return errors to notify user.
      let joiErrors = {};

      errors.details.forEach(
        (e) => (joiErrors[e.context.label] = formatErrorMsg(e.message))
      );
      return joiErrors;
    }
  },
  checkout: async (payload) => {
    const { firstName, lastName, email, phone } = payload;

    const schema = {
      email: Joi.string()
        .required()
        .email({ tlds: { allow: false } }),
      firstName: Joi.string().required().max(32).min(1),
      lastName: Joi.string().required().max(32).min(1),
      phone: Joi.string().max(16).min(11),
    };

    const _joiInstance = Joi.object(schema);

    let joiErrors = {};
    try {
      // if validation succeeds, return empty object
      await _joiInstance.validateAsync(payload, {
        abortEarly: false,
      });
      return joiErrors;
    } catch (errors) {
      // if validation fails, return errors to notify user.

      errors.details.forEach(
        (e) => (joiErrors[e.context.label] = formatErrorMsg(e.message))
      );
      return joiErrors;
    }
  },
};

module.exports = isJoiErrors;
