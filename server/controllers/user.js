const Mongoose = require("mongoose");
const User = require("../models/user");
const AuthToken = require("../models/auth-token");
const Util = require("../lib/utility");
const AuthUtil = require("../lib/auth");
const crypto = require("crypto");

exports.register = async (lang, payload) => {
  const existingUser = await User.findOne({ email: payload.email }).lean();

  if (existingUser) {
    return Util.customError(lang, "USER_ALREADY_EXISTS");
  }

  const checkPassword = AuthUtil.isValidPassword(payload.password ?? null);
  if (!checkPassword) {
    return Util.customError(lang, "INVALID_PASSWORD");
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
    return Util.customError(lang, "REGISTER_FAILED");
  }

  let token = Util.tokenSign(registerUser.getObjectId(), "1h");

  await new AuthToken({
    user_id: new Mongoose.Types.ObjectId(registerUser._id),
    access_tokens: [token],
  }).save();

  return { status: 200, data: { user: await registerUser.response(), access_token: token }, message: "User registered successfully" };
};

exports.login = async (lang, payload) => {
  const existingUser = await User.findOne({ email: payload.email });

  if (!existingUser) {
    return Util.customError(lang, "USER_NOT_FOUND");
  }

  if (!payload.password || !existingUser.password) {
    return Util.customError(lang, "INVALID_USER");
  }

  const matchedPassword = await Util.compare(payload.password, existingUser.password);
  
  if (!matchedPassword) {
    return Util.customError(lang, "PASSWORD_NOT_MATCH");
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

exports.resetPassword = async (lang, userId, payload) => {
  if (!payload.new_password && !payload.old_password) {
    return Util.customError(lang, "INVALID_PAYLOAD");
  }

  const existingUser = await User.findOne({ _id: userId });
  if (!existingUser) {
    return Util.customError(lang, "USER_NOT_FOUND");
  }

  const checkOldPassword = await Util.compare(payload.old_password, existingUser.password);
  if (!checkOldPassword) {
    return Util.customError(lang, "INVALID_OLD_PASSWORD");
  }

  const checkNewPassword = AuthUtil.isValidPassword(payload.new_password ?? null);
  if (!checkNewPassword) {
    return Util.customError(lang, "INVALID_PASSWORD");
  }

  const isSameOldPassword = await Util.compare(payload.new_password, existingUser.password);
  if (isSameOldPassword) {
    return Util.customError(lang, "PASSWORD_DUPLICATED");
  }

  const hashedPassword = await Util.hash(payload.new_password);

  existingUser.password = hashedPassword;
  const savedUser = await existingUser.save();

  if (!savedUser) {
    return Util.customError(lang, "INVALID_RESPONSE");
  }

  let token = Util.tokenSign(savedUser.getObjectId(), "1h");

  await new AuthToken({
    user_id: new Mongoose.Types.ObjectId(savedUser._id),
    access_tokens: [token],
  }).save();

  return { status: 200, data: { user: await savedUser.response(), access_token: token }, message: "Change password successfully" };
};

exports.updateProfile = async (lang, userId, payload) => {
  if(!payload.first_name && !payload.last_name && !payload.phone)  {
    return Util.customError(lang, "INVALID_PAYLOAD");
  }

  const existingUser = await User.findOne({ _id: userId });
  if (!existingUser) {
    return Util.customError(lang, "USER_NOT_FOUND");
  }

  // if(payload.email) {
  //   existingUser.email = payload.email;
  // }
  if(payload.first_name) {
    existingUser.first_name = payload.first_name;
  }
  if(payload.last_name) {
    existingUser.last_name = payload.last_name;
  }
  if(payload.phone) {
    existingUser.phone = payload.phone;
  }

  const savedUser = await existingUser.save();

  if (!savedUser) {
    return Util.customError(lang, "INVALID_RESPONSE");
  }

  let token = Util.tokenSign(savedUser.getObjectId(), "1h");

  await new AuthToken({
    user_id: new Mongoose.Types.ObjectId(savedUser._id),
    access_tokens: [token],
  }).save();

  return { status: 200, data: { user: await savedUser.response(), access_token: token }, message: "Update profile successfully" };
};