require("dotenv").config();

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const connectDatabase = require("../db");
const User = require("../models/user");

function argument(name) {
  const position = process.argv.indexOf(`--${name}`);
  return position === -1 ? undefined : process.argv[position + 1];
}

async function createAdmin() {
  const name = argument("name");
  const email = argument("email");
  const college = argument("college");
  const dob = argument("dob");
  const password = process.env.ADMIN_PASSWORD;

  if (!name || !email || !college || !dob || !password) {
    throw new Error(
      "Usage: set ADMIN_PASSWORD, then provide --name, --email, --college, and --dob (YYYY-MM-DD)."
    );
  }

  const parsedDob = new Date(dob);
  if (Number.isNaN(parsedDob.getTime()) || parsedDob > new Date()) {
    throw new Error("Provide a valid past date of birth in YYYY-MM-DD format.");
  }

  if (password.length < 8) {
    throw new Error("ADMIN_PASSWORD must be at least 8 characters.");
  }

  const normalizedEmail = email.trim().toLowerCase();

  await connectDatabase();

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new Error(`An account already exists for ${normalizedEmail}.`);
  }

  await User.create({
    name: name.trim(),
    email: normalizedEmail,
    college: college.trim(),
    dob: parsedDob,
    password: await bcrypt.hash(password, 12),
    role: "admin",
  });

  console.log(`Admin account created for ${normalizedEmail}.`);
}

createAdmin()
  .catch((error) => {
    console.error(`Could not create admin: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
