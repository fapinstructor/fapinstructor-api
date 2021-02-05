exports.up = function(knex) {
  return knex.schema.createTable("game_tag", t => {
    t.uuid("game_config_id");
    t.string("tag_id");

    // constraints
    t.primary(["game_config_id", "tag_id"]);
    t.foreign("game_config_id")
      .references("id")
      .inTable("game_config");
    t.foreign("tag_id")
      .references("id")
      .inTable("tag");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("game_tag");
};
