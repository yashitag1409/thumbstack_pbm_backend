const { default: rateLimit } = require("express-rate-limit");
const jwt = require("jsonwebtoken");
const USERMODEL = require("../../database/model/user.model");

const verifyToken = (token, secret = process.env.JWT_SECRET_KEY) => {
  try {
    const decoded = jwt.verify(token, secret);
    return { valid: true, expired: false, decoded };
  } catch (error) {
    return {
      valid: false,
      expired: error.message === "jwt expired",
      decoded: null,
    };
  }
};

/**
 * Rate limiter for login attempts
 * Limits to 5 requests per IP in 15 minutes
 */
exports.loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    status: "error",
    message:
      "Too many login attempts from this IP, please try again after 15 minutes",
  },
  skipSuccessfulRequests: false, // Count all requests
});
/**
 * Rate limiter for registration
 * Limits to 3 accounts per IP in 1 hour
 */
exports.registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "error",
    message:
      "Too many accounts created from this IP, please try again after an hour",
  },
});
/**
 * Rate limiter for OTP verification attempts
 * Limits to 10 requests per IP in 1 hour
 */
exports.otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "error",
    message:
      "Too many verification attempts from this IP, please try again after an hour",
  },
});

/**
 * Rate limiter for Resending OTP
 * Limits to 3 resend attempts per IP in 30 minutes
 */
exports.resendOtpLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 3, // 3 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "error",
    message:
      "You have requested too many OTPs. Please wait 30 minutes before trying again to protect your vault's security.",
  },
  // Optional: You can skip the limit if the request is successful,
  // but for Resend, it's safer to limit even successful ones to prevent spamming.
  skipSuccessfulRequests: false,
});

/**
 * Rate limiter for Forgot Password requests
 * Limits to 3 requests per IP in 1 hour
 * Highly strict to prevent account enumeration and spam
 */
exports.forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "error",
    message:
      "Too many password reset attempts. To keep your AksharVault secure, please try again after an hour.",
  },
});

/**
 * Middleware to protect routes that require authentication
 */
exports.protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    // Get token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    console.log("token 👇👇", token);

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "You are not logged in. Please log in to get access.",
      });
    }

    // Verify token
    const { valid, expired, decoded } = verifyToken(token);

    console.log(
      "valid 👇",
      valid,
      "\nexpired 👇👇",
      expired,
      "\ndecoded 👇👇👇",
      decoded,
    );

    if (!valid) {
      return res.status(401).json({
        status: "error",
        message: expired
          ? "Your token has expired. Please log in again."
          : "Invalid token.",
      });
    }

    // Check if user still exists
    const currentUser = await USERMODEL.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: "error",
        message: "The user belonging to this token no longer exists.",
      });
    }

    // Grant access to protected route
    req.user = currentUser;
    next();
  } catch (error) {
    res.status(401).json({
      status: "error",
      message: "Authentication failed.",
    });
  }
};

/**
 * Middleware to restrict access based on user roles.
 * @param  {...string} roles - The roles allowed to access the route (e.g., 'admin', 'user')
 */
module.exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // 1. Check if the user's role is included in the allowed roles
    // req.user is populated by the 'protect' middleware after token verification
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "failed",
        message:
          "Access Denied: You do not have permission to perform this action.",
      });
    }

    // 2. User has the correct role, proceed to the next middleware/controller
    next();
  };
};
