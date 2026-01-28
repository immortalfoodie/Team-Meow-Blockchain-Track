// authentication routes
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const { findByUsername, findById, validatePassword, sanitizeUser, getAllUsers, addUser } = require("../services/users");
const { logAction, ACTIONS } = require("../services/audit");
const { verifyToken, allowRoles } = require("../middleware/auth");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-123";
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || "24h";

// login endpoint
router.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
    }

    const user = findByUsername(username);

    if (!user || !validatePassword(user, password)) {
        logAction({
            action: ACTIONS.USER_LOGIN,
            userId: user?.id || null,
            username,
            role: user?.role || null,
            success: false,
            errorMessage: "Invalid credentials",
            ipAddress: req.ip
        });
        return res.status(401).json({ error: "Invalid credentials" });
    }

    // generate token
    const token = jwt.sign(
        { userId: user.id, username: user.username, role: user.role, name: user.name },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES }
    );

    logAction({
        action: ACTIONS.USER_LOGIN,
        userId: user.id,
        username: user.username,
        role: user.role,
        success: true,
        ipAddress: req.ip
    });

    res.json({
        success: true,
        token,
        user: sanitizeUser(user)
    });
});

// get current user profile
router.get("/profile", verifyToken, (req, res) => {
    const user = findById(req.user.userId);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    res.json({ user: sanitizeUser(user) });
});

// register new user (admin only)
router.post("/register", verifyToken, allowRoles(["ADMIN"]), (req, res) => {
    const { username, password, role, name, department } = req.body;

    if (!username || !password || !role || !name) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    if (findByUsername(username)) {
        return res.status(409).json({ error: "Username taken" });
    }

    const validRoles = ["POLICE", "LAB", "JUDGE", "ADMIN"];
    if (!validRoles.includes(role)) {
        return res.status(400).json({ error: "Invalid role" });
    }

    const newUser = addUser({ username, password, role, name, department: department || "" });

    logAction({
        action: ACTIONS.USER_REGISTER,
        userId: req.user.userId,
        username: req.user.username,
        role: req.user.role,
        details: { newUser: newUser.username, newRole: newUser.role },
        success: true,
        ipAddress: req.ip
    });

    res.status(201).json({ success: true, user: newUser });
});

// list all users (admin)
router.get("/users", verifyToken, allowRoles(["ADMIN"]), (req, res) => {
    res.json({ users: getAllUsers() });
});

// verify token endpoint
router.post("/verify-token", (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: "Token required" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.json({ valid: true, user: decoded });
    } catch (e) {
        res.json({ valid: false });
    }
});

module.exports = router;
