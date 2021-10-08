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

async function findById(id, userId) {
  const query = knex(schema.tableName)
    .select(
      "game_config.id",
      "game_config.config",
      "game_config.title",
      "game_config.stars",
    )
    .where({ id })
    .modify(withTags)
    .first();

  if (userId) {
    query.modify(withStarred, userId);
  } else {
    query.modify(query => {
      query.select(knex.raw("FALSE as starred"));
    });
  }

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
    query.where("game_config.profile_id", filters.createdBy);
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

function withStarred(query, userId, inclusive = true) {
  const starredGames = knex("game_star")
    .select("game_config_id", "profile_id")
    .where({ profile_id: userId })
    .as("game_starred");

  query
    .select(
      knex.raw(
        `coalesce(bool_or(game_starred.game_config_id IS NOT NULL), false) as starred`,
      ),
    )
    .groupBy("game_starred.game_config_id");

  if (inclusive) {
    query.leftJoin(
      starredGames,
      "game_starred.game_config_id",
      "game_config.id",
    );
  } else {
    query.innerJoin(
      starredGames,
      "game_starred.game_config_id",
      "game_config.id",
    );
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

function withAverageGameTime(query) {
  query.select(
    knex.raw(
      "((game_config.config -> 'gameDuration' ->> 'min')::float + (game_config.config -> 'gameDuration' ->> 'max')::float)  / 2 as average_game_duration",
    ),
  );
}

async function findHistory(userId, paginate, filters, sort) {
  const historicGames = knex("game_history")
    .select("game_config_id", "profile_id")
    .where({ profile_id: userId })
    .as("game_history");

  const games = knex(schema.tableName)
    .select(
      "game_config.id",
      "game_config.title",
      "game_config.updated_at",
      "game_config.stars",
    )
    .innerJoin(historicGames, "game_history.game_config_id", "game_config.id")
    .modify(withStarred, userId)
    .modify(withAverageGameTime)
    .modify(withFilters, filters)
    .modify(withTags)
    .modify(withSorting, sort);

  return await games.paginate(paginate);
}

async function findStarred(userId, paginate, filters, sort) {
  const games = knex(schema.tableName)
    .select(
      "game_config.id",
      "game_config.title",
      "game_config.updated_at",
      "game_config.stars",
    )
    .modify(withStarred, userId, false)
    .modify(withAverageGameTime)
    .modify(withFilters, filters)
    .modify(withTags)
    .modify(withSorting, sort);

  return await games.paginate(paginate);
}

async function findAll(userId, paginate, filters, sort) {
  const games = knex(schema.tableName)
    .select(
      "game_config.id",
      "game_config.title",
      "game_config.updated_at",
      "game_config.stars",
    )
    // only show private games if the current user is the creator
    .modify(query => {
      if (filters.createdBy !== userId) {
        query.where("game_config.is_public", true);
      }
    })
    .modify(withAverageGameTime)
    .modify(withFilters, filters)
    .modify(withTags)
    .modify(withSorting, sort);

  if (userId) {
    games.modify(withStarred, userId);
  }

  return await games.paginate(paginate);
}

module.exports = {
  create,
  findById,
  findAll,
  findHistory,
  findStarred,
};
