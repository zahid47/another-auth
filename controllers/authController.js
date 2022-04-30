import { signAccessToken, signRefreshToken } from "../helpers/jwtHelper.js";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import authValidation from "../validation/authValidation.js";

export const registerUser = asyncHandler(async (req, res) => {
  if (!req.body.username)
    return res.status(400).json({ username: "no username provided" });
  if (!req.body.email)
    return res.status(400).json({ email: "no email provided" });
  if (!req.body.password)
    return res.status(400).json({ password: "no password provided" });

  const { error } = authValidation(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).json({ email: "email already exists" });
  } catch {
    return res.status(500).json({ error: "internal server error" });
  }

  //everything seems ok, lets create a new user!
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    avatar: `https://avatars.dicebear.com/api/bottts/${req.body.username}.svg`,
  });

  //hash the pass
  bcrypt.genSalt((err, salt) => {
    if (err) return res.send(err);
    bcrypt.hash(req.body.password, salt, (err, hashedPassword) => {
      if (err) return res.send(err);
      newUser.password = hashedPassword;
      //save the new user in DB
      newUser
        .save()
        .then((_) => res.status(201).json({ success: true }))
        .catch((err) => res.status(500).json(err));
    });
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { error } = authValidation(req.body);
  if (error)
    return res.status(400).json({ password: error.details[0].message });

  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) return res.status(401).json({ email: "email not found" });

      bcrypt
        .compare(req.body.password, user.password)
        .then((matched) => {
          if (!matched)
            return res.status(401).json({ password: "wrong password" });
          signAccessToken(user.id)
            .then((accessToken) => {
              signRefreshToken(user.id)
                .then((refreshToken) => {
                  const cookieOptions = {
                    maxAge: 3.156e10, // 1y
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== "development",
                    SameSite: "strict",
                  };
                  res
                    .status(200)
                    .cookie("refreshToken", refreshToken, cookieOptions)
                    .json({ accessToken });
                })
                .catch((err) => {
                  console.log(err);
                });
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => res.status(500).json(err));
});
