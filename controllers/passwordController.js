import { verifyToken } from "../helpers/jwtHelper.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import sendEmail from "../helpers/sendEmail.js";

export const forgotPass = (req, res) => {
  if (!req.body.email)
    return res.status(400).json({ error: "no email provided" });

  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) return res.status(404).json({ email: "email not found" });

      if (!user.verified)
        return res.status(400).json({ email: "email not verified" });

      //all good, lets send the forgot pass email
      // sendEmail(user.id, req.body.email, "PASSWORD-RESET");
      res.status(200).send("ok");
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
};

export const resetPass = (req, res) => {
  if (!req.params.token)
    return res.status(404).json({ token: "no token provided" });
  if (!req.body.password)
    return res.status(404).json({ token: "no new password provided" });

  const token = req.params.token;

  verifyToken(token)
    .then((payload) => {
      User.findById(payload.aud)
        .then((user) => {
          if (!user) return res.status(404).json({ user: "user not found" });

          //hash the pass
          bcrypt.genSalt((err, salt) => {
            if (err) return res.status(400).send(err);
            bcrypt.hash(req.body.password, salt, (err, hashedPassword) => {
              if (err) return res.status(400).send(err);
              User.findByIdAndUpdate(payload.aud, { password: hashedPassword })
                .then((_) => {
                  return res.status(200).json({ success: true });
                })
                .catch((err) => {
                  return res.status(500).json(err);
                });
            });
          });
        })
        .catch((err) => {
          return res.status(500).json(err);
        });
    })
    .catch((_) => {
      return res.status(400).json({ token: "invalid or expired token" });
    });
};
