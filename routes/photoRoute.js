import express from "express";
import * as photoController from "../controller/photoController.js";
import * as auth from '../middleware/authMiddleware.js'
const router = express.Router();

router
  .route("/")
  .post(photoController.createPhoto)
  .get(photoController.getAllPhotos);

router.route("/:id").get( auth.authenticationToken ,photoController.getPhoto);
router.route("/:id").delete(photoController.deletePhoto);
router.route("/:id").put(photoController.updatePhoto);
export default router;
