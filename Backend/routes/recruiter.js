const express = require("express");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(requireAuth, requireRole("recruiter"));

router.get("/dashboard", (req, res) => {
  res.json({
    message: `Recruiter dashboard for ${req.user.name}`,
    user: req.user,
    stats: {
      openRoles: 0,
      applicants: 0,
      interviews: 0,
    },
  });
});

module.exports = router;
