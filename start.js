#!/usr/bin/env node
/**
 * Start script that keeps the server alive
 */

// Keep the process alive by preventing stdin close from killing it
process.stdin.resume();

// Load the server
require("./server.js");

console.log("[Startup] Server process initialized and kept alive");
