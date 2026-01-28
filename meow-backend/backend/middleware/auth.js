// auth middleware - handles jwt stuff and role checking
const jwt = require("jsonwebtoken");
const { logAction, ACTIONS } = require("../services/audit");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key-123";

// check if token is valid
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  // handle both "Bearer token" and just "token"
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = {
      userId: decoded.userId,
      username: decoded.username,
      role: decoded.role,
      name: decoded.name
    };
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(401).json({ error: "Invalid token" });
  }
}

// check if user has required role
function allowRoles(roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    if (!roles.includes(req.user.role)) {
      // log failed access attempt
      logAction({
        action: ACTIONS.ACCESS_DENIED,
        userId: req.user.userId,
        username: req.user.username,
        role: req.user.role,
        details: { route: req.originalUrl, needed: roles },
        success: false,
        ipAddress: req.ip
      });

      return res.status(403).json({
        error: "Access denied",
        yourRole: req.user.role,
        requiredRoles: roles
      });
    }
    next();
  };
}

// legacy support - old header based auth
function allowRole(role) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    // try jwt first
    if (authHeader) {
      try {
        const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;

        if (decoded.role === role) return next();
        return res.status(403).json({ error: "Access denied" });
      } catch (e) {
        // fall through to header check
      }
    }

    // fallback to role header (backwards compat)
    const headerRole = req.headers.role;
    if (headerRole !== role) {
      return res.status(403).json({ error: "Access denied" });
    }

    req.user = { userId: "legacy", username: "legacy-user", role: headerRole };
    next();
  };
}

module.exports = { verifyToken, allowRoles, allowRole };
