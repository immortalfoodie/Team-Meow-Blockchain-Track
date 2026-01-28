/**
 * User Service - Mock User Database
 * 
 * In production, this would connect to a real database.
 * For this judicial evidence system, we have pre-defined roles:
 * - POLICE: Can upload evidence, transfer custody
 * - LAB: Forensic lab technicians, can transfer custody
 * - JUDGE: Can verify evidence integrity
 * - ADMIN: System administrator
 */

const crypto = require("crypto");

// Simple password hashing using SHA-256 (use bcrypt in production)
function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// Mock user database with pre-defined judicial stakeholders
const users = [
  {
    id: "USR001",
    username: "officer_sharma",
    password: hashPassword("police123"),
    role: "POLICE",
    name: "Inspector Sharma",
    department: "Mumbai Police - Cyber Crime",
    badgeNumber: "MH-CYB-4521"
  },
  {
    id: "USR002",
    username: "officer_patel",
    password: hashPassword("police123"),
    role: "POLICE",
    name: "Sub-Inspector Patel",
    department: "Mumbai Police - Cyber Crime",
    badgeNumber: "MH-CYB-7832"
  },
  {
    id: "USR003",
    username: "lab_verma",
    password: hashPassword("lab123"),
    role: "LAB",
    name: "Dr. Verma",
    department: "Central Forensic Science Laboratory",
    employeeId: "CFSL-2019-0234"
  },
  {
    id: "USR004",
    username: "lab_khan",
    password: hashPassword("lab123"),
    role: "LAB",
    name: "Dr. Khan",
    department: "State Forensic Science Laboratory",
    employeeId: "SFSL-2020-0891"
  },
  {
    id: "USR005",
    username: "judge_mehta",
    password: hashPassword("judge123"),
    role: "JUDGE",
    name: "Hon. Justice Mehta",
    court: "Mumbai High Court",
    benchId: "MHC-BENCH-03"
  },
  {
    id: "USR006",
    username: "judge_reddy",
    password: hashPassword("judge123"),
    role: "JUDGE",
    name: "Hon. Justice Reddy",
    court: "Sessions Court, Mumbai",
    benchId: "SC-MUM-BENCH-12"
  },
  {
    id: "USR007",
    username: "admin",
    password: hashPassword("admin123"),
    role: "ADMIN",
    name: "System Administrator",
    department: "IT Department"
  }
];

/**
 * Find user by username
 */
function findByUsername(username) {
  return users.find(u => u.username === username);
}

/**
 * Find user by ID
 */
function findById(id) {
  return users.find(u => u.id === id);
}

/**
 * Validate password
 */
function validatePassword(user, password) {
  return user.password === hashPassword(password);
}

/**
 * Get user without sensitive data
 */
function sanitizeUser(user) {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
}

/**
 * Get all users (without passwords) - Admin function
 */
function getAllUsers() {
  return users.map(sanitizeUser);
}

/**
 * Add new user - Admin function
 */
function addUser(userData) {
  const newUser = {
    id: `USR${String(users.length + 1).padStart(3, "0")}`,
    ...userData,
    password: hashPassword(userData.password)
  };
  users.push(newUser);
  return sanitizeUser(newUser);
}

module.exports = {
  findByUsername,
  findById,
  validatePassword,
  sanitizeUser,
  getAllUsers,
  addUser
};
