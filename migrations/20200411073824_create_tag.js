exports.up = function(knex) {
  return knex.schema.createTable("tag", t => {
    t.text("id").primary();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("tag");
};
