import { Router } from "express";
import {findUser, getCurrentUser, refreshAccessToken, signupUser, signInUser,signOutUser, updateUserAccount} from "../controllers/auth.controller.js"
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { validateSignup,validateSignIn, validateUpdateUser } from "../middlewares/authValidation.middleware.js";

const router = Router()

router.route("/signup").post(validateSignup, signupUser)
router.route("/signin").post(validateSignIn, signInUser)
router.route("/refresh-access-token").post(refreshAccessToken)
//Secured routes
router.route("/signout").post(verifyJwt, signOutUser)
router.route("/current").get(verifyJwt, getCurrentUser)
router.route("/update-account").put(verifyJwt, validateUpdateUser, updateUserAccount)
router.route("/find-user").get(verifyJwt, findUser)


export default router