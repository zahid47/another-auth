import { signToken, verifyToken } from "../helpers/jwtHelper.js";
import User from "../models/User.js";
import sgMail from "@sendgrid/mail";
import bcrypt from "bcryptjs";

export const forgotPass = (req, res) => {
  if (!req.body.email)
    return res.status(400).json({ error: "no email provided" });

  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) return res.status(404).json({ email: "email not found" });

      if (!user.verified)
        return res.status(400).json({ email: "email not verified" });

      //all good, lets send the forgot pass email
      //sign a jwt token for verification email
      signToken(user.id, "GENERAL")
        .then((token) => {
          //construct a verification email
          sgMail.setApiKey(process.env.SENDGRID_API_KEY);
          const confirmationUrl = `${process.env.SERVER_URL}/api/v1/password/reset/${token}`;
          const msg = {
            to: req.body.email,
            from: {
              name: "Another-Auth",
              email: process.env.EMAIL_FROM,
            },
            subject: "Reset Password",
            text: `Please reset your password using this link: ${confirmationUrl}. It will expire in 1 day.`,
            html: `<p><a href=${confirmationUrl}>Click here</a> to reset your password. The link will expire in 1 day.</p>`,
          };
          return res.status(200).json(msg);
          //   sgMail
          //     .send(msg)
          //     .then(() => {
          //       res.status(200).json({ message: "password reset email sent!" });
          //     })
          //     .catch((error) => {
          //       console.error(error);
          //     });
        })
        .catch((err) => console.log(err));
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
