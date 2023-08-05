import express from "express";
import * as userController from "../controller/userController.js";
import * as authController from "../middleware/authMiddleware.js";
const router = express.Router();

router.route("/register").post(userController.createUser);
router.route("/login").post(userController.loginUser);
router.route("/dashboard").get(authController.authenticationToken, userController.getDashboardPage);
router.route("/").get(authController.authenticationToken, userController.getAllUsers);
router.route("/:id").get(authController.authenticationToken, userController.getAUser);
router.route('/:id/follow').put(authController.authenticationToken, userController.follow);
router.route('/:id/unfollow').put(authController.authenticationToken, userController.unfollow);
export default router;
