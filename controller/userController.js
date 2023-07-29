import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.redirect("/login");
  } catch (error) {
    res.status(500).json({
      succeded: false,
      error,
    });
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

const getDashboardPage = (req, res) => {
  res.render("dashboard", {
    link: "dashboard",
  });
};

export { createUser, loginUser, getDashboardPage };
