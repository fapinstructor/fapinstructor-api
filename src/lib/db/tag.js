const knex = require("./connection");

const schema = {
  tableName: "tag",
  columns: ["id"],
};

async function createTags({ trx = knex, tags }) {
  await trx(schema.tableName).insert(
    tags.map(tag => ({
      id: tag,
    })),
  );
}

async function findAll() {
  const tags = await knex(schema.tableName).select(schema.columns);

  return tags.map(({ id }) => id);
}

function findIn(ids) {
  return knex(schema.tableName)
    .select(schema.columns)
    .whereIn("id", ids);
}

module.exports = {
  schema,
  createTags,
  findAll,
  findIn,
};
