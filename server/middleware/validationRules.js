const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().trim().min(3).required().messages({
    "string.empty": "Name cannot be empty",
    "string.min": "Name must be at least 3 characters long",
    "any.required": "Name is a required field",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is a required field",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "any.required": "Password is a required field",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is a required field",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is a required field",
  }),
});

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      const formattedErrors = error.details.map((detail) => ({
        field: detail.context.key,
        message: detail.message.replace(/['"]/g, ""),
      }));
      return res.status(400).json({ errors: formattedErrors });
    }

    return next();
  };
};

module.exports = { registerSchema, loginSchema, validate };
