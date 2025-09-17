"use strict";

const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const ModelSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "users" },
    access_tokens: [String],
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

module.exports = Mongoose.model("authTokens", ModelSchema, "authTokens");
