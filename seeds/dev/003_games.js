const config = {
  tasks: {
    cbtIce: false,
    icyHot: false,
    precum: false,
    buttplug: false,
    dominant: true,
    flicking: false,
    handsOff: false,
    headOnly: false,
    ballSlaps: false,
    bothHands: false,
    shaftOnly: false,
    breathPlay: false,
    randomBeat: false,
    rubNipples: false,
    scratching: false,
    toothpaste: false,
    clothespins: false,
    headPalming: false,
    nondominant: false,
    rubberBands: false,
    overhandGrip: false,
    squeezeBalls: false,
    bindCockBalls: false,
    doubleStrokes: true,
    gripChallenge: false,
    halvedStrokes: true,
    clusterStrokes: false,
    teasingStrokes: true,
    gripAdjustments: true,
    nipplesAndStroke: false,
    randomStrokeSpeed: false,
    accelerationCycles: false,
    redLightGreenLight: false,
  },
  orgasms: { max: 1, min: 1 },
  imageType: ["PICTURE", "GIF", "VIDEO"],
  subreddits: [
    "gonewild",
    "nsfw",
    "realgirls",
    "nsfw_gif",
    "cumsluts",
    "petitegonewild",
    "holdthemoan",
    "anal",
    "creampies",
  ],
  strokeSpeed: { max: 4, min: 0.25 },
  edgeCooldown: 10,
  gameDuration: { max: 15, min: 5 },
  minimumEdges: 0,
  ruinCooldown: 20,
  edgeFrequency: 0,
  ruinedOrgasms: { max: 0, min: 0 },
  slideDuration: 10,
  actionFrequency: 30,
  postOrgasmTorture: false,
  defaultStrokeStyle: "dominant",
  finaleProbabilities: { denied: 0, orgasm: 100, ruined: 0 },
  initialGripStrength: 3,
  postOrgasmTortureDuration: { max: 90, min: 10 },
};

exports.seed = async knex => {
  const existingRecords = await knex("game_config");

  if (existingRecords.length > 0) {
    return;
  }

  await knex("game_config").insert([
    {
      id: "67b83078-6da8-4c25-9faf-999b9a217095",
      config,
      title: "Seed Game 1",
      profile_id: "uMa6fjxVsZn6YD7h8r2zOx7LgDWZuwrL@clients",
      is_public: true,
    },
    {
      id: "f6341bb2-8fe6-48fa-8dfe-3b178bdd5dd7",
      config,
      title: "Seed Game 2",
      profile_id: "uMa6fjxVsZn6YD7h8r2zOx7LgDWZuwrL@clients",
      is_public: true,
    },
    {
      id: "4c18272e-9ec5-4c51-869a-eff8a714a55d",
      config,
      title: "Seed Game 3",
      profile_id: "uMa6fjxVsZn6YD7h8r2zOx7LgDWZuwrL@clients",
      is_public: true,
    },
    {
      id: "543f8e41-5814-47d6-8477-11eb1582dcc3",
      config,
      title: "Seed Game 4",
      profile_id: "google-oauth2|104862859801036244533",
      is_public: true,
    },
    {
      id: "b85260ac-c4d9-4a14-af80-c738fe03a848",
      config,
      title: "Seed Game 5",
      profile_id: "google-oauth2|104862859801036244533",
      is_public: true,
    },
  ]);

  await knex.raw(`TRUNCATE TABLE game_tag CASCADE`);
  await knex("game_tag").insert([
    {
      game_config_id: "67b83078-6da8-4c25-9faf-999b9a217095",
      tag_id: "red",
    },
    {
      game_config_id: "67b83078-6da8-4c25-9faf-999b9a217095",
      tag_id: "green",
    },
    {
      game_config_id: "67b83078-6da8-4c25-9faf-999b9a217095",
      tag_id: "blue",
    },
    {
      game_config_id: "f6341bb2-8fe6-48fa-8dfe-3b178bdd5dd7",
      tag_id: "red",
    },
    {
      game_config_id: "f6341bb2-8fe6-48fa-8dfe-3b178bdd5dd7",
      tag_id: "green",
    },
    {
      game_config_id: "4c18272e-9ec5-4c51-869a-eff8a714a55d",
      tag_id: "blue",
    },
    {
      game_config_id: "543f8e41-5814-47d6-8477-11eb1582dcc3",
      tag_id: "red",
    },
    {
      game_config_id: "b85260ac-c4d9-4a14-af80-c738fe03a848",
      tag_id: "blue",
    },
  ]);
};
