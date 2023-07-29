import express from "express";
import * as userController from "../controller/userController.js";
import * as authController from "../middleware/authMiddleware.js";
const router = express.Router();

router.route("/register").post(userController.createUser);
router.route("/login").post(userController.loginUser);
router
  .route("/dashboard")
  .get(authController.authenticationToken, userController.getDashboardPage);
export default router;
