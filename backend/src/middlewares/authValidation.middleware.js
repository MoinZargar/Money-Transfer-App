import { signupSchema, signInSchema, updateUserSchema } from "../utils/validationSchema.js";
import { apiError } from "../utils/apiError.js";

const validateSignup = (req, res, next) => {
  try {
    signupSchema.parse(req.body);
    next();
  } catch (error) {
    throw new apiError(400, "Input validation failed", error.errors);
  }
};

const validateSignIn = (req, res, next) => {
  try {
    signInSchema.parse(req.body);
    next();
  } catch (error) {
    throw new apiError(411, "Input validation failed", error.errors);
  }
};
const validateUpdateUser = (req, res, next) => {
  try {
    updateUserSchema.parse(req.body);
    next();
  } catch (error) {
    throw new apiError(411, "Input validation failed", error.errors);
  }
}
export {
  validateSignup,
  validateSignIn,
  validateUpdateUser,
};
