// main server file
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// simple request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
  next();
});

// routes
const authRoutes = require("./routes/auth");
const evidenceRoutes = require("./routes/evidence");

app.use("/api/auth", authRoutes);
app.use("/api/evidence", evidenceRoutes);

// health check
const { getConnectionStatus } = require("./services/blockchain");
const { getStats } = require("./services/audit");

app.get("/api/health", async (req, res) => {
  const bcStatus = await getConnectionStatus();
  res.json({
    status: "ok",
    time: new Date().toISOString(),
    blockchain: bcStatus,
    audit: getStats()
  });
});

// root - api info
app.get("/", (req, res) => {
  res.json({
    name: "Evidence Chain API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth/login",
      evidence: "/api/evidence",
      health: "/api/health"
    }
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

// start
app.listen(PORT, () => {
  console.log("\n=================================");
  console.log("  Evidence Chain Backend");
  console.log("=================================");
  console.log(`  Running on port ${PORT}`);
  console.log(`  http://localhost:${PORT}`);
  console.log("=================================\n");
});

module.exports = app;
