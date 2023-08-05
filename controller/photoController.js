import Photo from "../models/photoModel.js";
import User from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const createPhoto = async (req, res) => {
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: "project_1314",
    }
  );
  try {
    await Photo.create({
      name: req.body.name,
      description: req.body.description,
      user: res.locals.user._id,
      adress: result.secure_url,
      photo_id: result.public_id,
    });
    fs.unlinkSync(req.files.image.tempFilePath);
    res.status(201).redirect("/users/dashboard");
  } catch (error) {
    res.status(500).json({
      succeded: false,
      error,
    });
  }
};

const getAllPhotos = async (req, res) => {
  try {
    const photos = await Photo.find({});
    res.status(200).render("photos", {
      photos,
      link: "photos",
    });
  } catch (error) {
    res.status(500).json({
      succeded: false,
      error,
    });
  }
};

const getPhoto = async (req, res) => {
  try {
    const photo = await Photo.findById({ _id: req.params.id }).populate("user");
    const user = await User.findById({ _id: res.locals.user._id });
    res.status(200).render("photo", {
      photo,
      link: "photos",
      user,
    });
  } catch (error) {
    res.status(500).json({
      succeded: false,
      error,
    });
  }
};

const deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    const photoId = photo.photo_id;
    await cloudinary.uploader.destroy(photoId);
    await Photo.findOneAndRemove({ _id: req.params.id });
    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(500).json({
      succeded: false,
      error,
    });
  }
};

const updatePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);

    if (req.files) {
      const photoId = photo.photo_id;
      await cloudinary.uploader.destroy(photoId);

      const result = await cloudinary.uploader.upload(
        req.files.image.tempFilePath,
        {
          use_filename: true,
          folder: "project_1314",
        }
      );

      photo.adress = result.secure_url;
      photo.image_id = result.public_id;

      fs.unlinkSync(req.files.image.tempFilePath);
    }
    photo.name = req.body.name;
    photo.description = req.body.description;
    photo.save();

    res.status(200).redirect(`/photos/${req.params.id}`);
  } catch (error) {
    res.status(500).json({
      succeded: false,
      error,
    });
  }
};

export { createPhoto, getAllPhotos, getPhoto, deletePhoto, updatePhoto };
