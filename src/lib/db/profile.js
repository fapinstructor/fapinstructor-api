const knex = require("./connection");

const schema = {
  tableName: "profile",
  columns: ["id", "createdAt", "updatedAt"],
};

async function create(id) {
  const result = await knex(schema.tableName)
    .insert({
      id,
    })
    .returning(schema.columns);

  return result[0];
}

async function findById(id) {
  return knex(schema.tableName)
    .select(schema.columns)
    .where({ id })
    .first();
}

module.exports = {
  schema,
  create,
  findById,
};
