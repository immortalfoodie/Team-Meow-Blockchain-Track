#!/usr/bin/env node
/**
 * Comprehensive API Test Suite
 * Tests all backend endpoints with realistic scenarios
 */

const http = require("http");

// Helper to make HTTP requests with timeout
function makeRequest(options, data = null, timeoutMs = 5000) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      req.destroy();
      reject(new Error(`Request timeout after ${timeoutMs}ms`));
    }, timeoutMs);

    const req = http.request(options, (res) => {
      clearTimeout(timeout);
      let body = "";
      
      res.on("data", (chunk) => {
        body += chunk;
      });
      
      res.on("end", () => {
        try {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: body ? JSON.parse(body) : null
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: body
          });
        }
      });
    });

    req.on("error", (err) => {
      clearTimeout(timeout);
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Test cases
async function runTests() {
  const BASE_URL = "http://localhost:3000";
  const tests = [];
  const results = { passed: 0, failed: 0, tests: [] };

  console.log("=".repeat(60));
  console.log("API Test Suite - Evidence Chain Backend");
  console.log("=".repeat(60));
  console.log("");

  // Test 1: Root endpoint
  tests.push({
    name: "GET / - API Info",
    request: async () => {
      return makeRequest({
        hostname: "localhost",
        port: 3000,
        path: "/",
        method: "GET"
      });
    },
    validate: (res) => res.statusCode === 200 && res.body.name === "Evidence Chain API"
  });

  // Test 2: Health check
  tests.push({
    name: "GET /api/health - Health Check",
    request: async () => {
      return makeRequest({
        hostname: "localhost",
        port: 3000,
        path: "/api/health",
        method: "GET"
      }, null, 10000); // 10 second timeout
    },
    validate: (res) => res.statusCode === 200 && res.body.status === "ok"
  });

  // Test 3: 404 handling
  tests.push({
    name: "GET /nonexistent - 404 Handler",
    request: async () => {
      return makeRequest({
        hostname: "localhost",
        port: 3000,
        path: "/nonexistent",
        method: "GET"
      });
    },
    validate: (res) => res.statusCode === 404
  });

  // Test 4: Login endpoint structure (should fail without credentials)
  tests.push({
    name: "POST /api/auth/login - Auth Endpoint",
    request: async () => {
      return makeRequest({
        hostname: "localhost",
        port: 3000,
        path: "/api/auth/login",
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      }, {});
    },
    validate: (res) => res.statusCode >= 400 // Should fail with 400 or 401
  });

  // Run all tests
  for (const test of tests) {
    process.stdout.write(`Testing: ${test.name}... `);
    
    try {
      const startTime = Date.now();
      const response = await test.request();
      const duration = Date.now() - startTime;
      
      const passed = test.validate(response);
      
      if (passed) {
        console.log(`✓ PASS (${duration}ms)`);
        results.passed++;
        results.tests.push({
          name: test.name,
          status: "PASS",
          duration,
          statusCode: response.statusCode
        });
      } else {
        console.log(`✗ FAIL (${duration}ms)`);
        console.log(`  Status: ${response.statusCode}`);
        console.log(`  Body:`, response.body);
        results.failed++;
        results.tests.push({
          name: test.name,
          status: "FAIL",
          duration,
          statusCode: response.statusCode,
          body: response.body
        });
      }
    } catch (err) {
      console.log(`✗ ERROR: ${err.message}`);
      results.failed++;
      results.tests.push({
        name: test.name,
        status: "ERROR",
        error: err.message
      });
    }
  }

  // Summary
  console.log("");
  console.log("=".repeat(60));
  console.log("Test Results Summary");
  console.log("=".repeat(60));
  console.log(`Total Tests: ${tests.length}`);
  console.log(`Passed: ${results.passed} ✓`);
  console.log(`Failed: ${results.failed} ✗`);
  console.log(`Success Rate: ${((results.passed / tests.length) * 100).toFixed(1)}%`);
  console.log("=".repeat(60));

  process.exit(results.failed === 0 ? 0 : 1);
}

// Start tests
console.log("Waiting 2 seconds for server to be ready...\n");
setTimeout(runTests, 2000);
