// Minimal server test
require("dotenv").config();
const express = require("express");

const app = express();
const PORT = 5001;

app.get("/", (req, res) => {
  res.json({ msg: "test" });
});

const server = app.listen(PORT, () => {
  console.log("Test server on port", PORT);
});

// Keep process alive
process.on("SIGINT", () => {
  console.log("Shutting down...");
  server.close();
  process.exit(0);
});

// Prevent process exit
setInterval(() => {}, 1000);
