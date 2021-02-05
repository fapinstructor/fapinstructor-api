exports.up = function(knex) {
  return knex.schema.createTable("game_config", t => {
    t.uuid("id")
      .defaultTo(knex.raw("uuid_generate_v4()"))
      .primary();
    t.jsonb("config").notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("game_config");
};
