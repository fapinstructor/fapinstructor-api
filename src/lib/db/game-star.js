const knex = require("./connection");

const schema = {
  tableName: "game_star",
  columns: ["game_config_id", "profile_id", "created_at", "updated_at"],
};

async function getStarCount(gameConfigId) {
  const stars = (
    await knex("game_star")
      .count("*")
      .where({ game_config_id: gameConfigId })
      .first()
  ).count;

  return stars;
}

async function deleteStar(gameConfigId, profileId) {
  await knex(schema.tableName)
    .where({ game_config_id: gameConfigId, profile_id: profileId })
    .delete();

  const stars = await getStarCount(gameConfigId);

  await knex("game_config")
    .where({ id: gameConfigId })
    .update({ stars });
}

async function appendStar(gameConfigId, profileId) {
  await knex(schema.tableName).insert({
    game_config_id: gameConfigId,
    profile_id: profileId,
  });

  const stars = await getStarCount(gameConfigId);

  await knex("game_config")
    .where({ id: gameConfigId })
    .update({ stars });
}

module.exports = {
  schema,
  deleteStar,
  appendStar,
};
