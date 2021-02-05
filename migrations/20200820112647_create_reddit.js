exports.up = async function(knex) {
  await knex.schema.createTable("subreddit", t => {
    t.increments("id");
    t.text("name");
    t.timestamp("updated_at").defaultTo(knex.fn.now());
    // constraints
    t.unique("name");
  });

  await knex.schema.createTable("subreddit_media_content", t => {
    t.integer("media_content_id").unsigned();
    t.integer("subreddit_id").unsigned();
    // constraints
    t.primary(["media_content_id", "subreddit_id"]);
    t.foreign("media_content_id")
      .references("id")
      .inTable("media_content")
      .onDelete("CASCADE");
    t.foreign("subreddit_id")
      .references("id")
      .inTable("subreddit");
    // index
    t.index("subreddit_id");
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTable("subreddit_media_content");
  await knex.schema.dropTable("subreddit");
};
