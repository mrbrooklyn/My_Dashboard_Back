const User = require("../models/user");

exports.createUser = async (payload) => {
  const user = new User(payload);
  return await user.save();
};

exports.getUsers = async () => {
  return await User.find();
};

exports.getUserById = async (id) => {
  return await User.findById(id);
};

exports.updateUser = async (id, payload) => {
  return await User.findByIdAndUpdate(id, payload, { new: true });
};

exports.deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};
