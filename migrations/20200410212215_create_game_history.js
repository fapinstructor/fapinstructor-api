exports.up = function(knex) {
  return knex.schema.createTable("game_history", t => {
    t.uuid("game_config_id");
    t.string("profile_id");
    t.timestamps(false, true);

    // constraints
    t.foreign("game_config_id")
      .references("id")
      .inTable("game_config");
    t.foreign("profile_id")
      .references("id")
      .inTable("profile");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("game_history");
};
