const mongoose = require("mongoose");
const config = require("config");

const mongoURI = config.get("mongoURI");

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log("^^^ success: connected to DB");
  } catch (err) {
    console.log("^^^ error: ", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
