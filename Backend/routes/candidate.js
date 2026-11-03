const express = require("express");
const User = require("../models/user");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(requireAuth, requireRole("candidate"));

const profileFields = [
  "phone", "pronouns", "location", "currentAddress", "permanentAddress",
  "headline", "professionalSummary", "degree", "fieldOfStudy",
  "graduationYear", "currentTitle", "currentOrganization", "yearsExperience",
];

router.get("/profile", async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "Profile not found." });
  return res.json({ user: user.toSafeJSON() });
});

router.patch("/profile", async (req, res) => {
  try {
    const updates = {};
    for (const field of profileFields) {
      if (req.body[field] === undefined) continue;
      if (typeof req.body[field] !== "string") {
        return res.status(400).json({ message: `${field} must be text.` });
      }
      updates[field] = req.body[field].trim();
    }
    if (updates.professionalSummary?.length > 1000) {
      return res.status(400).json({ message: "Professional summary must be 1000 characters or fewer." });
    }

    const user = await User.findByIdAndUpdate(req.user.id, { $set: updates }, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ message: "Profile not found." });
    return res.json({ message: "Profile updated successfully.", user: user.toSafeJSON() });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Could not update your profile." });
  }
});

router.get("/home", (req, res) => {
  res.json({
    message: `Welcome back, ${req.user.name}`,
    user: req.user,
    stats: {
      applications: 0,
      internships: 0,
      competitions: 0,
    },
  });
});

module.exports = router;
