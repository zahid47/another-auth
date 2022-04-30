import { verifyToken } from "../helpers/jwtHelper.js";
import User from "../models/User.js";

const protect = (req, res, next) => {
  if (!req.headers.authorization)
    return res.status(401).json({ error: "unauthorized, no token provided" });
  if (!req.headers.authorization.startsWith("Bearer"))
    return res.status(401).json({ error: "unauthorized, not a Bearer token" });

  const token = req.headers.authorization.split(" ")[1];

  verifyToken(token, type="ACCESS")
    .then((payload, err) => {
      if (err)
        return res.status(401).json({ error: "unauthorized, bad token" });

      User.findById(payload.aud)
        .then((user) => {
          req.user = user;
          next();
        })
        .catch((err) => res.status(500).json(err));
    })
    .catch((_) => {
      return res.status(401).json({ error: "expired or bad token" });
    });
};

export default protect;
