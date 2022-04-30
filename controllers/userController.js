import User from "../models/User.js";
import isEmpty from "../helpers/isEmpty.js";

export const showMe = (req, res) => {
  // already should have currently logged in user from the protect middleware
  if (!req.user) return res.status(401).json({ error: "user not found" });
  return res.status(200).json(req.user);
};

export const updateUser = (req, res) => {
  // already should have currently logged in user from the protect middleware
  if (!req.user) return res.status(401).json({ error: "user not found" });

  if (req.body.newUsername && req.body.newUsername === req.user.username)
    return res.status(400).json({ email: "thats already your username" });

  if (req.body.newEmail && req.body.newEmail === req.user.email)
    return res.status(400).json({ email: "thats already your email" });

  const updatedUser = {};

  if (req.body.newUsername) {
    updatedUser.username = req.body.newUsername;
  }

  if (req.body.newEmail) {
    updatedUser.email = req.body.newEmail;
  }

  if (isEmpty(updatedUser))
    return res.status(400).json({ error: "nothing to update" });

  const options = {
    new: true,
  };

  User.findByIdAndUpdate(req.user.id, updatedUser, options)
    .then((user) => res.status(200).json(user))
    .catch((err) => {
      if (err.codeName === "DuplicateKey" && err.keyPattern.username) {
        return res
          .status(400)
          .json({ username: "an user with that username already exists" });
      }

      if (err.codeName === "DuplicateKey" && err.keyPattern.email) {
        return res
          .status(400)
          .json({ email: "an user with that email already exists" });
      }

      return res.status(500).json({ error: "internal server error" });
    });
};

export const deleteUser = (req, res) => {
  // already should have currently logged in user from the protect middleware
  if (!req.user) return res.status(401).json({ error: "user not found" });

  User.findByIdAndDelete(req.user.id)
    .then((_) => res.status(200).json({ success: true }))
    .catch((err) => res.status(500).json(err));
};
