exports.up = async function(knex) {
  await knex.schema.createTable("game_star", t => {
    t.uuid("game_config_id");
    t.string("profile_id");
    t.timestamps(false, true);

    // constraints
    t.primary(["game_config_id", "profile_id"]);

    t.foreign("game_config_id")
      .references("id")
      .inTable("game_config")
      .onDelete("CASCADE");

    t.foreign("profile_id")
      .references("id")
      .inTable("profile")
      .onDelete("CASCADE");
  });

  await knex.schema.alterTable("game_config", t => {
    t.integer("stars")
      .notNullable()
      .defaultTo(0);
  });
};

exports.down = async function(knex) {
  await knex.schema.alterTable("game_config", t => {
    t.dropColumn("stars");
  });

  await knex.schema.dropTable("game_star");

  await knex.raw(`
      DROP FUNCTION IF EXISTS update_stars() CASCADE;
    `);
};
