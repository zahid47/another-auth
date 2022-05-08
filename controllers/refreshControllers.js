import { signToken, verifyToken } from "../helpers/jwtHelper.js";

export const refreshAccessToken = (req, res) => {
  // const refToken = req.cookies.refreshToken;
  const refToken = req.query.refreshToken; //temporary fix //TODO fix it

  if (!refToken)
    return res.status(401).json({ refreshToken: "no refresh token provided" });

  verifyToken(refToken, "REFRESH")
    .then((payload, err) => {
      if (err)
        return res.status(400).json({ refreshToken: "bad refresh token" });

      signToken(payload.aud, "ACCESS")
        .then((accessToken) => {
          signToken(payload.aud, "REFRESH")
            .then((refreshToken) => {
              const cookieOptions = {
                maxAge: 24 * 60 * 60 * 1000, // 1d
                httpOnly: true,
                secure: true,
                sameSite: "None",
              };
              res
                .status(200)
                .cookie("refreshToken", refreshToken, cookieOptions)
                .json({ accessToken });
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};
