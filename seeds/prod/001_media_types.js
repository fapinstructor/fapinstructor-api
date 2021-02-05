exports.seed = async knex => {
  const existingRecords = await knex("media_type");

  if (existingRecords.length === 0) {
    await knex("media_type").insert([
      { id: 0, name: "UNKNOWN" },
      { id: 1, name: "PICTURE" },
      { id: 2, name: "GIF" },
      { id: 3, name: "VIDEO" },
    ]);
  }
};
