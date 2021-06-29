exports.seed = async knex => {
  const existingRecords = await knex("tag");

  if (existingRecords.length > 0) {
    return;
  }

  await knex("tag").insert([{ id: "red" }, { id: "green" }, { id: "blue" }]);
};
