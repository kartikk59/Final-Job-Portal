import jwt from 'jsonwebtoken';
import User from '../../../models/user.js';

export async function authenticateUser(req, res, next) {
  try {
    const bearerToken = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : null;
    const token = req.cookies?.token || bearerToken;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Please log in to book a session.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Your account could not be found.' });
    }

    const safeUser = user.toSafeJSON();
    req.user = { ...safeUser, _id: String(user._id), id: String(user._id) };
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Your session is invalid or expired.' });
  }
}

export function requireCandidate(req, res, next) {
  if (req.user?.role !== 'candidate') {
    return res.status(403).json({ success: false, message: 'Candidate access is required to book a session.' });
  }
  next();
}
