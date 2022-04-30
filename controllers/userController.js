import User from "../models/User.js";
import asyncHandler from "express-async-handler";

export const updateUser = asyncHandler(async (req, res) => {
  // already should have currently logged in user from the protect middleware
  if (!req.user) return res.status(401).json({ error: "user not found" });

  if (!req.body.newEmail)
    return res.status(401).json({ email: "no new email provided" });

  if (req.body.newEmail === req.user.email)
    return res.status(401).json({ email: "thats already your email" });

  const updatedUser = {
    email: req.body.newEmail,
  };

  const options = {
    new: true,
  };

  User.findByIdAndUpdate(req.user.id, updatedUser, options)
    .then((user) => res.status(200).json(user))
    .catch((err) => {
      if (err.codeName === "DuplicateKey") {
        return res
          .status(400)
          .json({ email: "an user with that email already exists" });
      }
      return res.status(500).json({ error: "internal server error" });
    });
});

export const deleteUser = asyncHandler(async (req, res) => {
  // already should have currently logged in user from the protect middleware
  if (!req.user) return res.status(401).json({ error: "user not found" });

  User.findByIdAndDelete(req.user.id)
    .then((_) => res.status(200).json({ success: true }))
    .catch((err) => res.status(500).json(err));
});
