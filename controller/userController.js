import User from "../models/userModel.js";
import bcrypt from "bcrypt";
const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({
      succeded: true,
      user,
    });
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

    const user = await User.findOne({ username });

    if (user) {
      same = bcrypt.compare(password, user.password);
      if (same) {
        res.send("<h1>Login is succesfull.<h1>");
      } else {
        res.status(400).json({
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

export { createUser, loginUser };
