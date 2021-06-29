exports.seed = async knex => {
  const existingRecords = await knex("game_history");

  if (existingRecords.length > 0) {
    return;
  }

  await knex("game_history").insert([
    {
      game_config_id: "67b83078-6da8-4c25-9faf-999b9a217095",
      profile_id: "uMa6fjxVsZn6YD7h8r2zOx7LgDWZuwrL@clients",
    },
    {
      game_config_id: "f6341bb2-8fe6-48fa-8dfe-3b178bdd5dd7",
      profile_id: "uMa6fjxVsZn6YD7h8r2zOx7LgDWZuwrL@clients",
    },
  ]);
};
