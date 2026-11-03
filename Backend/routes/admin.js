const express = require("express");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(requireAuth, requireRole("admin"));

router.get("/dashboard", (req, res) => {
  res.json({
    message: "Admin dashboard",
    user: req.user,
  });
});

module.exports = router;
