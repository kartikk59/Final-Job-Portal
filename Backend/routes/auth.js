const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();
const PUBLIC_ROLES = ["candidate", "recruiter"];
const LOGIN_ROLES = [...PUBLIC_ROLES, "admin"];

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

function createToken(user) {
  return jwt.sign(
    { userId: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function setSessionCookie(res, user) {
  res.cookie("token", createToken(user), cookieOptions);
}

function parseDob(value) {
  if (typeof value !== "string" || !value.trim()) return null;

  const dob = new Date(value);
  if (Number.isNaN(dob.getTime())) return null;

  const now = new Date();
  if (dob > now) return null;

  const youngestAllowed = new Date();
  youngestAllowed.setFullYear(now.getFullYear() - 14);
  if (dob > youngestAllowed) return null;

  return dob;
}

function sanitizeUser(user) {
  return user.toSafeJSON();
}

router.post("/signup", async (req, res) => {
  try {
    const { name, email, college, dob, password, role } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof college !== "string" ||
      !college.trim() ||
      typeof password !== "string" ||
      password.length < 8
    ) {
      return res.status(400).json({
        message:
          "Enter name, email, college, date of birth, and a password of at least 8 characters.",
      });
    }

    if (!PUBLIC_ROLES.includes(role)) {
      return res.status(400).json({
        message: "Choose whether you are signing up as a candidate or recruiter.",
      });
    }

    const parsedDob = parseDob(dob);
    if (!parsedDob) {
      return res.status(400).json({
        message: "Enter a valid date of birth. You must be at least 14 years old.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      college: college.trim(),
      dob: parsedDob,
      password: await bcrypt.hash(password, 12),
      role,
    });

    setSessionCookie(res, user);

    return res.status(201).json({
      message: "Account created successfully",
      user: sanitizeUser(user),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email already registered." });
    }

    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    if (!LOGIN_ROLES.includes(role)) {
      return res.status(400).json({
        message: "Choose candidate, recruiter, or admin before logging in.",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (user.role !== role) {
      return res.status(403).json({
        message: `This account is registered as a ${user.role}. Please log in with that role.`,
      });
    }

    setSessionCookie(res, user);

    return res.json({
      message: "Login successful",
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  res.json({ user: req.user });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  res.json({ message: "Logged out successfully" });
});

module.exports = router;
