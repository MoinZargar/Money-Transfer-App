import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { getBalance ,transferMoney } from "../controllers/account.controller.js";

const router = Router();

router.route("/balance").get(verifyJwt,getBalance);
router.route("/transfer").post(verifyJwt,transferMoney);
export default router;