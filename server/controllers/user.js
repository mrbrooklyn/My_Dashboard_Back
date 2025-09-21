const Mongoose = require("mongoose");
const User = require("../models/user");
const AuthToken = require("../models/auth-token");
const Util = require("../lib/utility");
const AuthUtil = require("../lib/auth");
const crypto = require("crypto");
const { ERRORS } = require("../constants/custom-errors.js");

exports.register = async (payload) => {
  const existingUser = await User.findOne({ email: payload.email }).lean();

  if (existingUser) {
    return { status: ERRORS.USER_ALREADY_EXISTS.code, message: ERRORS.USER_ALREADY_EXISTS.message };
  }

  const checkPassword = AuthUtil.isValidPassword(payload.password ?? null);
  if (!checkPassword) {
    return { status: ERRORS.INVALID_PASSWORD.code, message: ERRORS.INVALID_PASSWORD.message };
  }

  const hashedPassword = await Util.hash(payload.password);

  const randomSuffix = crypto.randomBytes(3).toString("hex");
  const defaultFirstName = "Guest";
  const defaultLastName = `User_${randomSuffix}`;

  const user = new User({
    first_name: payload.first_name || defaultFirstName,
    last_name: payload.last_name || defaultLastName,
    phone: payload.phone,
    email: payload.email,
    password: hashedPassword,
  });

  let registerUser = await user.save();

  if (!registerUser) {
    return { status: ERRORS.REGISTER_FAILED.code, message: ERRORS.REGISTER_FAILED.message };
  }

  let token = Util.tokenSign(registerUser.getObjectId(), "1h");

  await new AuthToken({
    user_id: new Mongoose.Types.ObjectId(registerUser._id),
    access_tokens: [token],
  }).save();

  return { status: 200, data: { user: await registerUser.response(), access_token: token }, message: "User registered successfully" };
};

exports.login = async (payload) => {
  const existingUser = await User.findOne({ email: payload.email });

  if (!existingUser) {
    return { status: ERRORS.USER_NOT_FOUND.code, message: ERRORS.USER_NOT_FOUND.message };
  }

  if (!payload.password || !existingUser.password) {
    return { status: ERRORS.INVALID_USER.code, message: ERRORS.INVALID_USER.message };
  }

  const matchedPassword = await Util.compare(payload.password, existingUser.password);
  
  if (!matchedPassword) {
    return { status: ERRORS.PASSWORD_NOT_MATCH.code, message: ERRORS.PASSWORD_NOT_MATCH.message };
  }

  let token = Util.tokenSign(existingUser.getObjectId(), "1h");

  await AuthToken.updateOne(
    {
      user_id: existingUser._id,
    },
    {
      $push: {
        access_tokens: {
          $each: [token],
          $slice: -3,
        },
      },
    },
    {
      upsert: true,
      new: true,
    }
  ).exec();

  return { status: 200, data: { user: await existingUser.response(), access_token: token }, message: "User login successfully" };
};
