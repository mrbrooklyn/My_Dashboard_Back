const Joi = require("@hapi/joi");
const UserController = require("../controllers/user");

module.exports = [
  {
    method: "POST",
    path: "/users",
    options: {
      description: "Create user",
      validate: {
        payload: Joi.object({
          name: Joi.string().required(),
          email: Joi.string().email().required(),
        }),
      },
    },
    handler: async (request, h) => {
      const user = await UserController.createUser(request.payload);
      return h.response(user).code(201);
    },
  },
  {
    method: "GET",
    path: "/users",
    handler: async () => {
      return await UserController.getUsers();
    },
  },
  {
    method: "GET",
    path: "/users/{id}",
    handler: async (request, h) => {
      const user = await UserController.getUserById(request.params.id);
      if (!user) {
        return h.response({ message: "User not found" }).code(404);
      }
      return user;
    },
  },
  {
    method: "PUT",
    path: "/users/{id}",
    options: {
      validate: {
        payload: Joi.object({
          name: Joi.string().optional(),
          email: Joi.string().email().optional(),
        }),
      },
    },
    handler: async (request, h) => {
      const user = await UserController.updateUser(
        request.params.id,
        request.payload
      );
      if (!user) {
        return h.response({ message: "User not found" }).code(404);
      }
      return user;
    },
  },
  {
    method: "DELETE",
    path: "/users/{id}",
    handler: async (request, h) => {
      const user = await UserController.deleteUser(request.params.id);
      if (!user) {
        return h.response({ message: "User not found" }).code(404);
      }
      return { message: "User deleted" };
    },
  },
];
