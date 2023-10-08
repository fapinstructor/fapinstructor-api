const http = require("http");
const log = require("pino")();

const options = {
  timeout: 2000,
  host: "localhost",
  port: process.env.PORT || 8080,
  path: "/health", // must be the same as HEALTHCHECK in Dockerfile
};

const request = http.request(options, res => {
  log.info(`HEALTHCHECK STATUS: ${res.statusCode}`);
  process.exitCode = res.statusCode === 200 ? 0 : 1;
  process.exit();
});

request.on("error", function(err) {
  log.fatal(`HEALTH CHECK FAILED: ${err}`);
  process.exit(1);
});

request.end();
