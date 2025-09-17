const Bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const AuthToken = require("../models/auth-token");
const User = require("../models/user");

const saltRounds = 10;

const methods = {};

methods.hash = async (text) => {
  let salt = await Bcrypt.genSalt(saltRounds);
  return await Bcrypt.hash(text, salt);
};

methods.tokenSign = (user, expiresIn) => {
  if (process.env.ENABLED_MANUAL_TOKEN_EXPIRED_TIME === "true") {
    expiresIn = process.env.MANUAL_TOKEN_EXPIRED_TIME;
  }
  return JWT.sign(user, process.env.SECRET_JWT, {
    algorithm: "HS256",
    expiresIn: expiresIn ? expiresIn : "1h",
  });
};

methods.compare = async (text, hashed) => {
  return await Bcrypt.compare(text, hashed);
};

methods.getUserByAccessToken = async (token) => {
  if (!token) {
    return null;
  }

  const userByToken = await AuthToken.findOne({
    access_tokens: token,
  }).lean();

  if (userByToken) {
    const user = await User.findOne({
      _id: userByToken.user_id,
    });
    if (!user) {
      return null;
    }
    return await user.response();
  } else {
    return null;
  }
};

methods.findUser = async (request) => {
  let user = request.auth.credentials ? request.auth.credentials.user : null;
  if (!user) {
    let authorization = request.headers.authorization;
    if (authorization) {
      let bearer = authorization.split(" ");
      if (
        bearer.length > 1 &&
        bearer[0].toLocaleLowerCase() == "Bearer".toLocaleLowerCase()
      ) {
        authorization = bearer[1];
      }
      user = await methods.getUserByAccessToken(authorization);
    }
  }
  return user ? user : null;
};

module.exports = methods;