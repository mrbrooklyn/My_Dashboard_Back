const { start, init } = require("./config/server");

const startServer = async () => {
  await init();
  await start();
};

startServer();
