exports.seed = async knex => {
  const existingRecords = await knex("profile");

  if (existingRecords.length > 0) {
    return;
  }

  await knex("profile").insert([
    { id: "google-oauth2|104862859801036244533" },
    { id: "uMa6fjxVsZn6YD7h8r2zOx7LgDWZuwrL@clients" },
  ]);
};
