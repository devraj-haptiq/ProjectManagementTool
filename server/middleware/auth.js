// /server/middleware/auth.js

const jwt = require("jsonwebtoken");

// This middleware function will be used to protect routes
module.exports = function (req, res, next) {
  // Get the token from the request header
  const token = req.header("x-auth-token");

  // Check if no token is provided
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  // Verify the token
  try {
    // The decoded object will contain the payload we set during login (e.g., { user: { id: '...' } })
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user from the payload to the request object
    // Now, any protected route will have access to req.user
    req.user = decoded.user;
    next(); // Proceed to the next middleware or the route handler
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
