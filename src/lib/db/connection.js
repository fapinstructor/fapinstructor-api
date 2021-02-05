const knex = require("knex");
const knexfile = require("../../../knexfile");
const log = require("lib/logger").child({ db: "connection" });

// knex extensions
const { attachPaginate } = require("knex-paginate");
attachPaginate();

const connection = knex(knexfile[process.env.NODE_ENV]);

connection
  .raw("SELECT 'test connection';")
  .then(() => {
    log.info(`Connection was successfully established`);
  })
  .catch(error => {
    log.fatal(error);
  });

connection.on("query", data => {
  log.debug("[QUERY]", data.sql, "[BINDINGS]", data.bindings);
});

connection.on("query-error", data => {
  log.error(data);
});

module.exports = connection;
