import User from "../models/userModel.js";
import Photo from "../models/photoModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ user: user._id });
  } catch (error) {
    const errors2 = {};
    if (error.code === 11000) {
      if (error.keyPattern.email === 1) {
        errors2.email = "Email is already registered";
      }
      if (error.keyPattern.username === 1) {
        errors2.username = "Username is already registered";
      }
    }

    if (error.name === "ValidationError") {
      Object.keys(error.errors).forEach((key) => {
        errors2[key] = error.errors[key].message;
      });
    }

    res.status(400).json(errors2);
  }
};
const loginUser = async (req, res) => {
  try {
    let same = false;
    const { username, password } = req.body;

    const user = await User.findOne({
      username,
    });

    if (user) {
      same = bcrypt.compare(password, user.password);
      if (same) {
        const token = createToken(user._id);
        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 7,
        });

        res.redirect("/users/dashboard");
      } else {
        res.status(401).json({
          succeded: false,
          error: "Password is wrong.",
        });
      }
    } else {
      res.status(400).json({
        succeded: false,
        error: "User is not found.",
      });
    }
  } catch (error) {
    res.status(500).json({
      succeded: false,
      error,
    });
  }
};

const createToken = (userId) => {
  return jwt.sign(
    {
      userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

const getDashboardPage = async (req, res) => {
  const photos = await Photo.find({ user: res.locals.user._id });
  const users = await User.findById({ _id: res.locals.user._id }).populate([
    "followers",
    "followings",
  ]);
  res.render("dashboard", {
    link: "dashboard",
    photos,
    users,
  });
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).render("users", {
      users,
      link: "users",
    });
  } catch (error) {
    res.status(500).json({
      succeded: false,
      error,
    });
  }
};

const getAUser = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.id });
    const inFollowers = user.followers.some((follower) => {
      return follower.equals(res.locals.user._id);
    });
    const photos = await Photo.find({ user: req.params.id });
    res.status(200).render("user", {
      user,
      photos,
      inFollowers,
      link: "user",
    });
  } catch (error) {
    res.status(500).json({
      succeded: false,
      error,
    });
  }
};

const follow = async (req, res) => {
  try {
    let user = await User.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $push: { followers: res.locals.user._id },
      },
      { new: true }
    );
    console.log('test');
    user = await User.findByIdAndUpdate(
      { _id: res.locals.user._id },
      {
        $push: { followings: req.params.id },
      },
      { new: true }
    );
    console.log('test2');
    res.status(200).redirect(`/users/${req.params.id}`);
  } catch (error) {
    res.status(500).json({
      succeded: false,
      error,
    });
  }
};

const unfollow = async (req, res) => {
  try {
    let user = await User.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $pull: { followers: res.locals.user._id },
      },
      { new: true }
    );

    user = await User.findByIdAndUpdate(
      { _id: res.locals.user._id },
      {
        $pull: { followings: req.params.id },
      },
      { new: true }
    );
    res.status(200).redirect(`/users/${req.params.id}`);
  } catch (error) {
    res.status(500).json({
      succeded: false,
      error,
    });
  }
};

export {
  createUser,
  loginUser,
  getDashboardPage,
  getAllUsers,
  getAUser,
  follow,
  unfollow,
};
