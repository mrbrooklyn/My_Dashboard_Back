const mongoose = require("mongoose");

async function connectDB() {
  try {
    const connection = process.env.DB_MONGO_CONNECTION_STRING + "/" + process.env.DB_NAME
    await mongoose.connect(connection, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}

module.exports = connectDB;
