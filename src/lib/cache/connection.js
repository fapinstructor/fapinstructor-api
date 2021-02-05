const redis = require("redis");
const { CACHE_HOST, CACHE_PORT } = require("config");
const log = require("lib/logger").child({ cache: "connection" });

const connection = redis.createClient(CACHE_PORT, CACHE_HOST);

connection.on("connect", () => {
  log.info("Connection was successfully established");
});

connection.on("error", error => {
  log.fatal(error);
});

connection.on("reconnecting", ({ attempt }) => {
  log.warn("Attempting to reconnect: " + attempt);
});

module.exports = connection;
