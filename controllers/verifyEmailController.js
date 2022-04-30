import { verifyToken } from "../helpers/jwtHelper.js";
import User from "../models/User.js";

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
