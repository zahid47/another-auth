import { signToken } from "../helpers/jwtHelper.js";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import registerValidation from "../validation/registerValidation.js";
import loginValidation from "../validation/loginValidation.js";
import sendEmail from "../helpers/sendEmail.js";

export const registerUser = (req, res) => {
  if (!req.body.username)
    return res.status(400).json({ username: "no username provided" });
  if (!req.body.email)
    return res.status(400).json({ email: "no email provided" });
  if (!req.body.password)
    return res.status(400).json({ password: "no password provided" });

  const { error } = registerValidation(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  //everything seems ok, lets try to create a new user!
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
        .then((user) => {
          // sendEmail(user.id, req.body.email, "EMAIL-VERIFICATION");
          res.status(200).json(user);
        })
        .catch((err) => {
          if (err.keyPattern.username)
            return res
              .status(500)
              .json({ username: "username already exists" });

          if (err.keyPattern.email) {
            return res.status(500).json({ email: "email already exists" });
          }

          return res.status(500).json({ error: "internal server error" });
        });
    });
  });
};

export const loginUser = (req, res) => {
  if (!req.body.email)
    return res.status(400).json({ email: "no email provided" });
  if (!req.body.password)
    return res.status(400).json({ password: "no password provided" });

  const { error } = loginValidation(req.body);
  if (error)
    return res.status(400).json({ password: error.details[0].message });

  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) return res.status(401).json({ email: "email not found" });

      // if (!user.verified)
      //   return res.status(401).json({ error: "please verify your email" });

      bcrypt
        .compare(req.body.password, user.password)
        .then((matched) => {
          if (!matched)
            return res.status(401).json({ password: "wrong password" });
          signToken(user.id, "ACCESS")
            .then((accessToken) => {
              signToken(user.id, "REFRESH")
                .then((refreshToken) => {
                  // const cookieOptions = {
                  //   maxAge: 24 * 60 * 60 * 1000, // 1d
                  //   httpOnly: true,
                  //   secure: true,
                  //   sameSite: "None",
                  // };
                  // res.cookie("refreshToken", refreshToken, cookieOptions);
                  // res.json({ accessToken });
                  res.json({ user, accessToken, refreshToken }); //temp fix //TODO fix it
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
};
