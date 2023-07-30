import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minLength: [6, "Password must be a minimum of 6 characters."],
      validate: [
        validator.isAlphanumeric,
        "Username can consist of numbers and letters.",
      ],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, "Please enter your email correctly."],
    },
    password: {
      type: String,
      required: true,
      minLength: [6, "Password must be a minimum of 6 characters."],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  const user = this;
  bcrypt.hash(user.password, 10, (err, hash) => {
    user.password = hash;
    next();
  });
});

const User = mongoose.model("User", userSchema);

export default User;
