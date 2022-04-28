import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../helpers/jwtHelper.js";

export const refreshAccessToken = (req, res) => {
  verifyRefreshToken(req.cookies.refreshToken)
    .then((payload, err) => {
      if (err)
        return res.status(400).json({ refreshToken: "bad refresh token" });

      signAccessToken(payload.aud)
        .then((accessToken) => {
          signRefreshToken(payload.aud)
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
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};
