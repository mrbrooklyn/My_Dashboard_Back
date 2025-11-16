const Util = require("./utility");
const AuthToken = require("../models/auth-token");
const User = require("../models/user");
const { ERRORS } = require("../constants/custom-errors.js");

const methods = {};

methods.isValidPassword = (credential) => {
  if (!credential) {
    return false;
  }
  let isMorethanEightCharacter = credential.length >= 8;
  let isContainCharacter = /^(?=.*[a-zA-Z])/i.test(credential);
  let isContainNumber = /^(?=.*[0-9])/i.test(credential);
  return isMorethanEightCharacter && isContainCharacter && isContainNumber;
};

methods.refreshToken = async (lang, expiredToken) => {
  let authTokenData = await AuthToken.findOne({
    access_tokens: expiredToken,
  });

  if (!authTokenData) {
    return Util.customError(lang, "INVALID_TOKEN");
  }

  let user = await User.findOne({
    _id: authTokenData.user_id,
  });

  if (!user) {
    return Util.customError(lang, "USER_NOT_FOUND");
  }

  let newToken = Util.tokenSign(user.getObjectId(), "1h");

  let tokens = authTokenData.access_tokens;

  const index = tokens.indexOf(expiredToken);
  tokens.splice(index, 1);
  tokens.push(newToken);

  await AuthToken.updateOne(
    {
      user_id: user._id,
    },
    {
      $set: { access_tokens: tokens },
    }
  ).exec();

  return { status: 200, data: newToken };
};

module.exports = methods;
