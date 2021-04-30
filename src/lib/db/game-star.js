const knex = require("./connection");

const schema = {
  tableName: "game_star",
  columns: ["game_config_id", "profile_id", "created_at", "updated_at"],
};

async function deleteStar(gameConfigId, profileId) {
  await knex.transaction(async trx => {
    await trx(schema.tableName)
      .where({ game_config_id: gameConfigId, profile_id: profileId })
      .delete();

    await trx("game_config")
      .where({ id: gameConfigId })
      .decrement({ stars: 1 });
  });
}

async function appendStar(gameConfigId, profileId) {
  await knex.transaction(async trx => {
    await trx(schema.tableName).insert({
      game_config_id: gameConfigId,
      profile_id: profileId,
    });

    await trx("game_config")
      .where({ id: gameConfigId })
      .increment({ stars: 1 });
  });
}

module.exports = {
  schema,
  deleteStar,
  appendStar,
};
