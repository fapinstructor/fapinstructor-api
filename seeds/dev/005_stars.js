exports.seed = async knex => {
  const existingRecords = await knex("game_star");

  if (existingRecords.length > 0) {
    return;
  }

  await knex("game_star").insert([
    {
      game_config_id: "67b83078-6da8-4c25-9faf-999b9a217095",
      profile_id: "uMa6fjxVsZn6YD7h8r2zOx7LgDWZuwrL@clients",
    },
    {
      game_config_id: "67b83078-6da8-4c25-9faf-999b9a217095",
      profile_id: "google-oauth2|104862859801036244533",
    },
    {
      game_config_id: "f6341bb2-8fe6-48fa-8dfe-3b178bdd5dd7",
      profile_id: "uMa6fjxVsZn6YD7h8r2zOx7LgDWZuwrL@clients",
    },
    {
      game_config_id: "4c18272e-9ec5-4c51-869a-eff8a714a55d",
      profile_id: "google-oauth2|104862859801036244533",
    },
  ]);

  await knex("game_config")
    .where({ id: "67b83078-6da8-4c25-9faf-999b9a217095" })
    .update({ stars: 2 });

  await knex("game_config")
    .where({ id: "f6341bb2-8fe6-48fa-8dfe-3b178bdd5dd7" })
    .update({ stars: 1 });

  await knex("game_config")
    .where({ id: "4c18272e-9ec5-4c51-869a-eff8a714a55d" })
    .update({ stars: 1 });
};
