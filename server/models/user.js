"use strict";

const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const ModelSchema = new Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    phone: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

ModelSchema.methods.response = function () {
  return {
    _id: this._id,
    first_name: this.first_name,
    last_name: this.last_name,
    phone: this.phone,
    email: this.email,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

ModelSchema.methods.getObjectId = function () {
  return {
    _id: this._id,
  };
};

module.exports = Mongoose.model("users", ModelSchema, "users");
