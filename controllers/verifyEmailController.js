import { signToken, verifyToken } from "../helpers/jwtHelper.js";
import User from "../models/User.js";
import sgMail from "@sendgrid/mail";
//TODO move send email functionality in a separate file

export const sendVerificationEmail = (req, res) => {
  if (!req.body.email)
    return res.status(400).json({ email: "no email provided" });

  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) return res.status(400).json({ email: "email not found" });
      if (user.verified)
        return res.status(400).json({ email: "already verified" });

      //ok send a verification email
      //sign a jwt token for verification email
      signToken(user.id, "GENERAL")
        .then((token) => {
          //construct a verification email
          sgMail.setApiKey(process.env.SENDGRID_API_KEY);
          const confirmationUrl = `${process.env.SERVER_URL}/api/v1/verify/${token}`;
          const msg = {
            to: req.body.email,
            from: {
              name: "Another-Auth",
              email: process.env.EMAIL_FROM,
            },
            subject: "Verify Email",
            text: `Please verify your account using this link: ${process.env.SERVER_URL}/api/v1/verify/${token}. It will expire in 1 day.`,
            html: `<p><a href=${confirmationUrl}>Click here</a> to verify your account. The link will expire in 1 day.</p>`,
          };
          sgMail
            .send(msg)
            .then(() => {
              res.status(200).json({ message: "confirmation email sent!" });
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
};

export const verifyEmail = (req, res) => {
  const token = req.params.token;

  verifyToken(token, "GENERAL")
    .then((payload) => {
      User.findByIdAndUpdate(payload.aud, { verified: true })
        .then((_) => {
          //TODO redirect to frontend login page now
          return res.status(200).json({ success: true });
        })
        .catch((err) => {
          return res.status(500).json(err);
        });
    })
    .catch((_) => {
      return res.status(401).json({ error: "bad or expired link" });
    });
};
