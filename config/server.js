"use strict";

const connectDB = require("./db");
const Hapi = require("@hapi/hapi");
const Jwt = require("hapi-auth-jwt2");
const Boom = require("@hapi/boom");
const userRoutes = require("../server/routes/user");
const AuthToken = require("../server/models/auth-token");

let server;

const init = async () => {
  await connectDB();

  server = Hapi.server({
    host: process.env.HOST || "localhost",
    port: process.env.PORT || 3000,
    // routes: {
    //   cors: {
    //     origin: ['http://localhost:3000','http://localhost:3001'],
    //     headers: ['Accept', 'Content-Type', 'Authorization', 'appid', 'platform', 'sign', 'timestamp'],
    //     credentials: true,
    //   },
    // },
  });

  await server.register(Jwt);

  const validate = async (decoded, r, h) => {
    let isValid = true;
    return { isValid, credentials: decoded };
  };

  server.auth.strategy("jwt", "jwt", {
    key: process.env.SECRET_JWT,
    validate,
    verifyOptions: { algorithms: ["HS256"] },
  });

  server.ext("onRequest", async (r, h) => {

    return h.continue;
  });

  server.ext("onPostAuth", async (r, h) => {
    if(r.auth.credentials) {
      let userAuthData = await AuthToken.findOne({
        user_id: r.auth.credentials._id,
        access_tokens: r.auth.token,
      })
      .lean()
      .read("sp");

      if(!userAuthData) {
        throw Boom.unauthorized("Token is invalid.");
      }
    }

    return h.continue;
  });

  server.ext("onPreResponse", (request, h) => {
    if(request.response && request.response.isBoom) {
      let errRes = {
        status_code: request.response.output.statusCode,
        is_success: false,
        data: request.response.data ?? null,
        error: request.response.output.payload.error,
        message: request.response.output.payload.message,
        system_message: request.response.output.payload.system_message,
      };
      if(request.response.isDeveloperError || request.response.isServer) {
        errRes.message = request.response.message
          ? request.response.message
          : request.response.output.payload.message;
      }
      console.log(errRes);

      return h.response(errRes).code(errRes.status_code);
    }

    return h.continue;
  });

  server.route(userRoutes);
};

const start = async () => {
  if (!server) throw new Error("Server is not initialized.");
  await server.start();
  console.log(`🚀 Server running on ${server.info.uri}`);
};

module.exports = { init, start };
