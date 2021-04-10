/**
 * Modify existing forign keys to make cascade delete
 * of a users profile possible.
 */
exports.up = async function(knex) {
  await knex.schema.alterTable("game_config", t => {
    t.dropForeign("profile_id");

    t.foreign("profile_id")
      .references("id")
      .inTable("profile")
      .onDelete("CASCADE");
  });

  await knex.schema.alterTable("game_tag", t => {
    t.dropForeign("game_config_id");

    t.foreign("game_config_id")
      .references("id")
      .inTable("game_config")
      .onDelete("CASCADE");
  });

  await knex.schema.alterTable("game_tag", t => {
    t.dropForeign("game_config_id");

    t.foreign("game_config_id")
      .references("id")
      .inTable("game_config")
      .onDelete("CASCADE");
  });

  await knex.schema.alterTable("game_history", t => {
    t.dropForeign("game_config_id");
    t.foreign("game_config_id")
      .references("id")
      .inTable("game_config")
      .onDelete("CASCADE");

    t.dropForeign("profile_id");
    t.foreign("profile_id")
      .references("id")
      .inTable("profile")
      .onDelete("CASCADE");
  });
};

exports.down = async function(knex) {
  await knex.schema.alterTable("game_config", t => {
    t.dropForeign("profile_id");

    t.foreign("profile_id")
      .references("id")
      .inTable("profile");
  });

  await knex.schema.alterTable("game_tag", t => {
    t.dropForeign("game_config_id");

    t.foreign("game_config_id")
      .references("id")
      .inTable("game_config");
  });

  await knex.schema.alterTable("game_history", t => {
    t.dropForeign("game_config_id");
    t.foreign("game_config_id")
      .references("id")
      .inTable("game_config");

    t.dropForeign("profile_id");
    t.foreign("profile_id")
      .references("id")
      .inTable("profile");
  });
};
