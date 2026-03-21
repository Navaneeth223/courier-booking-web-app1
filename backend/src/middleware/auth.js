const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  }
  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.accountType)) {
      return res.status(403).json({
        success: false,
        error: `User role ${req.user.accountType} is not authorized to access this route`
      });
    }
    next();
  };
};

// Admin check middleware (specifically for 'admin' accountType if added later, 
// or using accountType 'business' as a proxy for admin in some cases, 
// but let's stick to the prompt's 'individual' vs 'business' for now 
// and assume business users have certain privileges or there's a separate admin role)
// Actually, let's add an 'admin' role to User model implicitly or specifically.
// Prompt says: "Two user types: Individual senders + Business accounts"
// and "Admin dashboard for order management"
// I should probably add 'admin' to the enum in User.js and create an admin user manually or via a flag.
