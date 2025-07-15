const jwtUtils = require("../utils/jwtUtils");

const authMiddleware = (req, res, next) => {
  console.log("Auth Middleware - Request received:", {
    method: req.method,
    url: req.url,
    headers: req.headers,
    user: req.user,
  });

  const authHeader = req.header("Authorization");
  if (!authHeader) {
    console.log("Auth Middleware - No Authorization header");
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  // Extract the token from the Authorization header
  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = jwtUtils.verifyToken(token);
    req.user = decoded;
    console.log("Auth Middleware - Token decoded successfully:", {
      userId: decoded._id,
      userRole: decoded.role,
      userEmail: decoded.email,
    });

    // Allow any authenticated user to pass through
    // Individual controllers will handle specific permissions
    next();
  } catch (error) {
    console.log("Auth Middleware - Token verification failed:", error.message);
    res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = authMiddleware;
