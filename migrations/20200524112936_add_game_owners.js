exports.up = async function(knex) {
  // Add profile id to the game config table
  await knex.schema.alterTable("game_config", t => {
    t.string("profile_id")
      .notNullable()
      // thefapinstructor
      .defaultTo("google-oauth2|104862859801036244533");

    // constraints
    t.foreign("profile_id")
      .references("id")
      .inTable("profile");
  });

  await knex.schema.alterTable("game_config", t => {
    t.string("profile_id")
      .notNullable()
      .alter();
  });

  // Ability to make game public
  await knex.schema.alterTable("game_config", t => {
    t.boolean("is_public")
      .notNullable()
      .defaultTo(false);
  });
};

exports.down = async function(knex) {
  await knex.schema.alterTable("game_config", t => {
    t.dropColumn("profile_id");
  });

  await knex.schema.alterTable("game_config", t => {
    t.dropColumn("is_public");
  });
};
