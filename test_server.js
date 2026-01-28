// Simplified test server for API testing
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5001;

// Basic middleware
app.use(cors());
app.use(express.json());

// Simple test routes
app.get("/", (req, res) => {
  res.json({
    name: "Evidence Chain API (Test Mode)",
    version: "1.0.0",
    status: "operational",
    endpoints: {
      auth: "/api/auth/login",
      evidence: "/api/evidence", 
      health: "/api/health"
    }
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    time: new Date().toISOString(),
    blockchain: { connected: false, usingMock: true },
    message: "Test mode - blockchain mocked"
  });
});

// Mock auth endpoint
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  // Mock authentication
  if (username === "police" && password === "test123") {
    res.json({
      success: true,
      token: "mock-jwt-token-police",
      user: {
        userId: "user001",
        username: "police",
        role: "POLICE"
      }
    });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// Mock evidence endpoints  
app.get("/api/evidence", (req, res) => {
  res.status(401).json({ error: "Authorization required" });
});

app.post("/api/evidence/upload", (req, res) => {
  res.status(401).json({ error: "Authorization required" });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🧪 TEST SERVER RUNNING ON PORT ${PORT}`);
  console.log(`   http://localhost:${PORT}`);
  console.log("=".repeat(50));
});