const Joi = require("joi");

const isJoiErrors = async (payload) => {
  const schema = {
    email: Joi.string()
      .required()
      .email({ tlds: { allow: false } }),
    name: Joi.string().required().max(32).min(1),
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
    // console.log(errors.details);
    let joiErrors = {};
    errors.details.forEach((e) => (joiErrors[e.context.label] = e.message));
    return joiErrors;
  }
};

module.exports = isJoiErrors;
