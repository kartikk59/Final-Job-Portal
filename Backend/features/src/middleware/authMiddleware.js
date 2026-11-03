import jwt from 'jsonwebtoken';
import User from '../../../models/user.js';

export const protect = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : null;
    const token = req.cookies?.token || bearerToken;
    if (!token) return res.status(401).json({ success: false, message: 'Please log in first.' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ success: false, message: 'User no longer exists.' });
    const safeUser = user.toSafeJSON();
    req.user = { ...safeUser, id: String(user._id), _id: String(user._id) };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session.' });
  }
};

/**
 * Role-Based Access Control Middleware
 * Restricts endpoints to specific roles e.g., 'recruiter', 'admin', 'student'
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: this action requires one of these roles: ${roles.join(', ')}.`,
      });
    }
    next();
  };
};
