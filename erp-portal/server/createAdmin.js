import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existing = await User.findOne({ email: "admin@example.com" });

    if (existing) {
      console.log("⚠️ Admin already exists");
      process.exit();
    }

    await User.create({
      name: "Admin",
      email: "admin@example.com",
      password: "123456",
      role: "admin",
    });

    console.log("✅ Admin created");
    process.exit();
  } catch (err) {
    console.error("🔥 FULL ERROR:");
    console.error(err); // ✅ now you'll see real issue
    process.exit(1);
  }
};

run();