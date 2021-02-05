const knex = require("./connection");
const gameTagDb = require("./game-tag");

const schema = {
  tableName: "game_config",
  columns: [
    "id",
    "title",
    "config",
    "profile_id",
    "is_public",
    "created_at",
    "updated_at",
  ],
};

async function create({ title, tags, config, isPublic }, userId) {
  const result = await knex.transaction(async trx => {
    const game = (
      await trx(schema.tableName)
        .insert({
          title,
          config,
          is_public: isPublic,
          profile_id: userId,
        })
        .returning(schema.columns)
    )[0];

    await gameTagDb.addTagsToGame(trx)(game.id, tags);

    return game.id;
  });

  return result;
}

async function findById(id) {
  const query = knex(schema.tableName)
    .select("game_config.*")
    .where({ id })
    .modify(withTags)
    .first();

  return query;
}

function withTags(query) {
  query
    .select(knex.raw("ARRAY_AGG(game_tag.tag_id) tags"))
    .join("game_tag", "game_config.id", "game_tag.game_config_id")
    .groupBy("game_config.id");
}

function withFilters(query, filters) {
  if (filters.title) {
    query.where("title", "ilike", `%${filters.title}%`);
  }

  if (filters.createdBy) {
    query.where("profile_id", filters.createdBy);
  }

  if (filters.tags && filters.tags.length > 0) {
    // must match ALL specified tags
    const tagFilterQuery = knex("game_tag")
      .select("game_config_id")
      .whereIn("game_tag.tag_id", filters.tags)
      .groupBy("game_config_id")
      .having(knex.raw(`count(tag_id) >= ${filters.tags.length}`))
      .as("gt");

    query.rightJoin(tagFilterQuery, "gt.game_config_id", "game_config.id");
  }
}

function withSorting(query, columns) {
  if (!columns) {
    return;
  }

  columns.forEach(column => {
    if (column[0] === "-") {
      query.orderBy(column, "desc");
    } else {
      query.orderBy(column, "asc");
    }
  });
}

async function findHistory(userId, paginate, filters, sort) {
  const allGames = knex(schema.tableName)
    .select("game_config.id", "game_config.title", "game_config.is_public")
    .modify(withTags)
    .as("all_games");

  const gameHistory = knex("game_history")
    .select("all_games.*", "game_history.updated_at")
    .leftJoin(allGames, "game_history.game_config_id", "all_games.id")
    .where("game_history.profile_id", userId)
    .modify(withFilters, filters)
    .modify(withSorting, sort)
    .paginate(paginate);

  return await gameHistory;
}

async function findAll(userId, paginate, filters, sort) {
  const games = knex(schema.tableName)
    .select("game_config.id", "game_config.title", "game_config.updated_at")
    // only show private games if the current user is the creator
    .modify(query => {
      if (filters.createdBy !== userId) {
        query.where("game_config.is_public", true);
      }
    })
    .modify(withFilters, filters)
    .modify(withTags)
    .modify(withSorting, sort)
    .paginate(paginate);

  return await games;
}

module.exports = {
  create,
  findById,
  findAll,
  findHistory,
};
