import JWT from "jsonwebtoken";

export const signAccessToken = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {};
    const secret = process.env.ACCESS_SECRET;
    const options = {
      expiresIn: process.env.ACCESS_EXPIRY,
      issuer: "another-auth",
      audience: userId,
    };
    JWT.sign(payload, secret, options, (err, token) => {
      if (err) {
        return reject(err.message);
      }
      resolve(token);
    });
  });
};

export const verifyAccessToken = (token) => {
  return new Promise((resolve, reject) => {
    JWT.verify(token, process.env.ACCESS_SECRET, (err, payload) => {
      if (err) return reject(err);
      return resolve(payload);
    });
  });
};

export const signRefreshToken = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {};
    const secret = process.env.REFRESH_SECRET;
    const options = {
      expiresIn: process.env.REFRESH_EXPIRY,
      issuer: "another-auth",
      audience: userId,
    };
    JWT.sign(payload, secret, options, (err, token) => {
      if (err) {
        return reject(err.message);
      }
      resolve(token);
    });
  });
};

export const verifyRefreshToken = (token) => {
  return new Promise((resolve, reject) => {
    JWT.verify(token, process.env.REFRESH_SECRET, (err, payload) => {
      if (err) return reject(err);
      return resolve(payload);
    });
  });
};
