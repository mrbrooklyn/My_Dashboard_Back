const Mongoose = require("mongoose");
const User = require("../models/user");
const AuthToken = require("../models/auth-token");
const Util = require("../lib/utility");
const AuthUtil = require("../lib/auth");

exports.register = async (payload) => {
  const existingUser = await User.findOne({ email: payload.email }).lean();

  if (existingUser) {
    return { status: 10001, message: "User already exists" };
  }

  const checkPassword = AuthUtil.isValidPassword(payload.password ?? null);
  if (!checkPassword) {
    return { status: 10002, message: "Password format is invalid" };
  }

  const hashedPassword = await Util.hash(payload.password);

  const user = new User({
    first_name: payload.first_name,
    last_name: payload.last_name,
    phone: payload.phone,
    email: payload.email,
    password: hashedPassword,
  });

  let registerUser = await user.save();

  if (!registerUser) {
    return { status: 10003, message: "Create user with password failed" };
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
    return { status: 20001, message: "User not found" };
  }

  if (!payload.password || !existingUser.password) {
    return { status: 20002, message: "invalid user data" };
  }

  const matchedPassword = await Util.compare(payload.password, existingUser.password);
  
  if (!matchedPassword) {
    return { status: 20003, message: "Invalid password, please try again." };
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
