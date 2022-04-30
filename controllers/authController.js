import { signToken } from "../helpers/jwtHelper.js";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import registerValidation from "../validation/registerValidation.js";
import loginValidation from "../validation/loginValidation.js";
// import sgMail from "@sendgrid/mail";
//TODO move send email functionality in a separate file

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
          return res.status(200).json(user);
          // //sign a jwt token for verification email
          // signToken(user.id, "GENERAL")
          //   .then((token) => {
          //     //construct a verification email
          //     sgMail.setApiKey(process.env.SENDGRID_API_KEY);
          //     const confirmationUrl = `${process.env.SERVER_URL}/api/v1/verify/${token}`;
          //     const msg = {
          //       to: req.body.email,
          //       from: {
          //         name: "Another-Auth",
          //         email: process.env.EMAIL_FROM,
          //       },
          //       subject: "Welcome to Another-Auth",
          //       text: `Please verify your account using this link: ${process.env.SERVER_URL}/api/v1/verify/${token}`,
          //       html: `<p><a href=${confirmationUrl}>Click here</a> to verify your account</p>`,
          //     };
          //     sgMail
          //       .send(msg)
          //       .then(() => {
          //         res.status(201).json({ message: "confirmation email sent!" });
          //       })
          //       .catch((error) => {
          //         console.error(error);
          //       });
          //   })
          //   .catch((err) => console.log(err));
        })
        .catch((err) => {
          if (err.keyPattern.username)
            return res
              .status(500)
              .json({ username: "username already exists" });

          if (err.keyPattern.email)
            return res.status(500).json({ email: "email already exists" });

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
};
