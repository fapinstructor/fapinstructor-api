exports.up = async function(knex) {
  await knex.schema.createTable("media_type", t => {
    t.integer("id").primary();
    t.text("name").notNullable();
  });

  await knex.schema.createTable("media_content", t => {
    t.bigIncrements("id");
    t.string("source_link").notNullable();
    t.string("direct_link");
    t.integer("media_type_id").notNullable();
    // constraints
    t.foreign("media_type_id")
      .references("id")
      .inTable("media_type");
    // index
    t.index("media_type_id");
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTable("media_content");
  await knex.schema.dropTable("media_type");
};
