// Import the server
const app = require("./app");
const os = require("os");

// Global error handlers to catch unhandled rejections and exceptions
process.on("unhandledRejection", (reason, promise) => {
  console.error("UNHANDLED REJECTION at:", promise);
  console.error(
    "Reason:",
    reason instanceof Error ? reason.stack : JSON.stringify(reason, null, 2),
  );
});

process.on("uncaughtException", (error) => {
  console.error("UNCAUGHT EXCEPTION:", error.stack || error);
  process.exit(1);
});

// Get network IP automatically
function getNetworkIP() {
  const networks = os.networkInterfaces();
  for (const name of Object.keys(networks)) {
    for (const net of networks[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return "localhost";
}

// Start the server
const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || "0.0.0.0"; // Listen on all network interfaces
const networkIP = getNetworkIP();

app.listen(PORT, HOST, () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV || "development"} mode`,
  );
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`🌐 Network: http://${networkIP}:${PORT}`);
  console.log(`📊 API Base: http://${networkIP}:${PORT}/api`);
});

require("./database/index");
