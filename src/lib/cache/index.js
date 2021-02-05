const { promisify } = require("util");
const redis = require("./connection");
const redisScan = require("node-redis-scan");
const scanner = new redisScan(redis);

redis.getAsync = promisify(redis.get).bind(redis);
redis.send_command = promisify(redis.send_command).bind(redis);
redis.hgetall = promisify(redis.hgetall).bind(redis);
redis.sadd = promisify(redis.sadd).bind(redis);
scanner.scan = promisify(scanner.scan).bind(scanner);

function get(key) {
  return redis.getAsync(key).then(value => JSON.parse(value));
}

function getAll(key) {
  return redis.hgetall(key);
}

function set(key, value, ttl) {
  redis.set(key, JSON.stringify(value), "EX", ttl);
}

function sadd(key, set) {
  // return redis.send_command("SADD", [key, set, ttl]);
  return redis.sadd(key, set);
}

function rpush(key, elements) {
  return redis.send_command("RPUSH", [key, elements]);
}

function pttl(key) {
  return redis.send_command("PTTL", [key]);
}

function scan(pattern) {
  return scanner.scan(pattern);
}

function sunionstore(keys) {
  return redis.send_command("SUNIONSTORE", [keys]);
}

module.exports = {
  get,
  getAll,
  set,
  pttl,
  scan,
  sadd,
  sunionstore,
  rpush,
};
