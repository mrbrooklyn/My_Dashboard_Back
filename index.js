const Hapi = require("@hapi/hapi");
const connectDB = require("./config/db");
const userRoutes = require("./server/routes/user");

const init = async () => {
  // connect mongo
  await connectDB();

  // start Hapi server
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
  });

  // register routes
  server.route(userRoutes);

  await server.start();
  console.log(`🚀 Server running on ${server.info.uri}`);
};

process.on("unhandledRejection", (err) => {
  console.error(err);
  process.exit(1);
});

init();
