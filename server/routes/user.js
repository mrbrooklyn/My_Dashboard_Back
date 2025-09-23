const UserController = require("../controllers/user");
const UserSchema = require("../schema/user");
const ServiceResponse = require("../schema/service");
const AuthUtil = require("../lib/auth");
const Util = require("../lib/utility");
const { ERRORS } = require("../constants/custom-errors.js");

module.exports = [
  {
    method: "POST",
    path: "/auth/register",
    options: {
      auth: false,
      description: "Register new user",
      validate: {
        payload: UserSchema.register,
      },
    },
    handler: async (request, h) => {
      let serviceRes = ServiceResponse.success();
      let { status, data, message } = await UserController.register(request.payload);

      if (status === 200) {
        serviceRes.data = data;
        serviceRes.message = message;
        return h.response(serviceRes).code(200);
      } else {
        serviceRes = ServiceResponse.customCode(status, message);
        return h.response(serviceRes).code(200);
      }
    },
  },
  {
    method: "POST",
    path: "/auth/login",
    options: {
      auth: false,
      description: "Login user",
      validate: {
        payload: UserSchema.login,
      },
    },
    handler: async (request, h) => {
      let serviceRes = ServiceResponse.success();
      let { status, data, message } = await UserController.login(request.payload);

      if (status === 200) {
        serviceRes.data = data;
        serviceRes.message = message;
        return h.response(serviceRes).code(200);
      } else {
        serviceRes = ServiceResponse.customCode(status, message);
        return h.response(serviceRes).code(200);
      }
    },
  },
  {
    method: "POST",
    path: "/auth/refresh-token",
    options: {
      auth: false,
      description: "Refresh token",
      validate: {
        payload: UserSchema.refreshToken,
      },
    },
    handler: async (request, h) => {
      let serviceRes = ServiceResponse.success();
      const token = request.payload.token;
      let { status, data, message } = await AuthUtil.refreshToken(token);

      if (status === 200) {
        serviceRes.data = { access_token: data };
        serviceRes.message = message;
        return h.response(serviceRes).code(200);
      } else {
        serviceRes = ServiceResponse.customCode(status, message);
        return h.response(serviceRes).code(200);
      }
    },
  },
  {
    method: "GET",
    path: "/users/profile",
    options: {
      auth: {
        strategy: "jwt",
      },
      description:
        "Get user profile by current access-token (Need access-token in header)",
    },
    handler: async (request, h) => {
      let serviceRes = ServiceResponse.success();
      let user = await Util.findUser(request);

      if (user) {
        serviceRes.data = user;
        return h.response(serviceRes).code(200);
      } else {
        serviceRes = ServiceResponse.customCode(
          ERRORS.USER_NOT_FOUND_IN_HEADER.code,
          ERRORS.USER_NOT_FOUND_IN_HEADER.message
        );
        return h.response(serviceRes).code(200);
      }
    },
  },
  {
    method: "POST",
    path: "/auth/reset-password",
    options: {
      auth: {
        strategy: "jwt",
      },
      description: "Reset password",
      validate: {
        payload: UserSchema.resetPassword,
      },
    },
    handler: async (request, h) => {
      let serviceRes = ServiceResponse.success();
      let userId = request.auth.credentials._id;
      let { status, data, message } = await UserController.resetPassword(userId, request.payload);

      if (status === 200) {
        serviceRes.data = data;
        serviceRes.message = message;
        return h.response(serviceRes).code(200);
      } else {
        serviceRes = ServiceResponse.customCode(status, message);
        return h.response(serviceRes).code(200);
      }
    },
  },
  {
    method: "PUT",
    path: "/users/profile",
    options: {
      auth: {
        strategy: "jwt",
      },
      description: "Update user profile",
      validate: {
        payload: UserSchema.updateUser,
      },
    },
    handler: async (request, h) => {
      let serviceRes = ServiceResponse.success();
      let userId = request.auth.credentials._id;
      let { status, data, message } = await UserController.updateProfile(userId, request.payload);

      if (status === 200) {
        serviceRes.data = data;
        serviceRes.message = message;
        return h.response(serviceRes).code(200);
      } else {
        serviceRes = ServiceResponse.customCode(status, message);
        return h.response(serviceRes).code(200);
      }
    },
  },
];
