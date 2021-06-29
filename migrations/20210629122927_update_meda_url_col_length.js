exports.up = async function(knex) {
  await knex.schema.alterTable("media_content", t => {
    t.text("source_link")
      .notNullable()
      .alter();
    t.text("direct_link").alter();
  });
};

exports.down = async function(knex) {
  await knex.schema.alterTable("media_content", t => {
    t.string("source_link")
      .notNullable()
      .alter();
    t.string("direct_link").alter();
  });
};
