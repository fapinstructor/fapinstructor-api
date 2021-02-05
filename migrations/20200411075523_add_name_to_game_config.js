exports.up = async function(knex) {
  await knex.schema.alterTable("game_config", t => {
    t.text("title")
      .notNullable()
      .defaultTo("No Name");
    t.timestamps(false, true);
  });

  await knex.schema.alterTable("game_config", t => {
    t.text("title")
      .notNullable()
      .alter();
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable("game_config", t => {
    t.dropColumn("title");
    t.dropTimestamps();
  });
};
