exports.up = function(knex) {
  return knex.schema.createTable("profile", t => {
    t.string("id").primary();
    t.string("email");
    t.timestamps(false, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("profile");
};
