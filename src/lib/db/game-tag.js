const tag = require("./tag");

const schema = {
  tableName: "game_tag",
  columns: ["game_config_id", "tag_id"],
};

const addTagsToGame = trx => async (gameConfigId, tags) => {
  const existingTags = (await tag.findIn(tags)).map(({ id }) => id);
  const newTags = tags.filter(value => !existingTags.includes(value));

  await tag.createTags({ trx, tags: newTags });

  const result = await trx(schema.tableName)
    .insert(
      tags.map(tag => ({
        game_config_id: gameConfigId,
        tag_id: tag,
      })),
    )
    .returning(schema.columns);

  return result;
};

module.exports = {
  schema,
  addTagsToGame,
};
