const jwt = require("jsonwebtoken");
const User = require("../models/user");

async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "Please log in first",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select(
      "_id name email college dob role phone pronouns location currentAddress permanentAddress headline professionalSummary degree fieldOfStudy graduationYear currentTitle currentOrganization yearsExperience"
    );

    if (!user) {
      return res.status(401).json({
        message: "User no longer exists",
      });
    }

    req.user = user.toSafeJSON();
    next();
  } 
  catch (error) {
    return res.status(401).json({
      message: "Invalid or expired session",
    });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Please log in first" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You are not allowed to access this resource.",
      });
    }

    next();
  };
}

module.exports = {
  requireAuth,
  requireRole,
};
