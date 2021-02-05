const knex = require("./connection");

const schema = {
  tableName: "game_history",
  columns: ["game_config_id", "profile_id", "created_at", "updated_at"],
};

async function append(gameConfigId, profileId) {
  const exists =
    parseInt(
      (
        await knex(schema.tableName)
          .count("*")
          .where({ game_config_id: gameConfigId, profile_id: profileId })
          .first()
      ).count,
    ) !== 0;

  let result;

  if (exists) {
    result = await knex(schema.tableName)
      .update({ updated_at: knex.fn.now() })
      .where({ game_config_id: gameConfigId, profile_id: profileId })
      .returning(schema.columns);
  } else {
    result = await knex(schema.tableName)
      .insert({
        game_config_id: gameConfigId,
        profile_id: profileId,
      })
      .returning(schema.columns);
  }

  return result[0];
}

module.exports = {
  schema,
  append,
};
