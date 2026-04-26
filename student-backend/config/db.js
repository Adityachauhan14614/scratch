const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // New options are no longer necessary in Mongoose 6+, but including for robustness if older mongoose is somehow used
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.warn("Server is running without Database Connection. Please check MongoDB URI and IP Whitelist.");
    // process.exit(1); // Do not crash the server per user instructions
  }
};

module.exports = connectDB;
