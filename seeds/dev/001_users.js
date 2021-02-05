exports.seed = async knex => {
  await knex.raw("TRUNCATE TABLE profile CASCADE");

  await knex("profile").insert([
    { id: "google-oauth2|104862859801036244533" },
    { id: "uMa6fjxVsZn6YD7h8r2zOx7LgDWZuwrL@clients" },
  ]);
};
