import Joi from "joi";

export const userRegistrationSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    "string.empty": "Email is required",
    "string.email": "Please enter a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),
  image: Joi.string().uri().optional().messages({
    "string.uri": "Please enter a valid image URL",
  }).allow("", null),
  confirmPassword: Joi.any().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match",
    "any.required": "Please confirm your password",
  }),
  terms: Joi.boolean().valid(true).required().messages({
    "any.only": "You must accept the Terms and Conditions",
    "any.required": "You must accept the Terms and Conditions",
  }),
});