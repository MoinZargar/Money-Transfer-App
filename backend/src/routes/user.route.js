import { Router } from "express";
import {signupUser,signInUser,signOutUser} from "../controllers/auth.controller.js"
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { validateSignup,validateSignIn } from "../middlewares/authValidation.middleware.js";

const router = Router()

router.route("/signup").post(validateSignup, signupUser)
router.route("/signin").post(validateSignIn, signInUser)
//Secure routes
router.route("/signout").post(verifyJwt,signOutUser)

export default router