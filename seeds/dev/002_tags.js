exports.seed = async knex => {
  await knex.raw("TRUNCATE TABLE tag CASCADE");

  await knex("tag").insert([{ id: "seed" }]);
};
