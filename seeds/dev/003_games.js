const config = {
  gifs: true,
  tasks: {
    cbtIce: true,
    icyHot: true,
    precum: true,
    buttplug: true,
    dominant: true,
    flicking: true,
    handsOff: true,
    headOnly: true,
    ballSlaps: true,
    bothHands: true,
    shaftOnly: true,
    breathPlay: true,
    randomBeat: true,
    rubNipples: true,
    scratching: true,
    toothpaste: true,
    clothespins: true,
    headPalming: true,
    nondominant: true,
    rubberBands: true,
    overhandGrip: true,
    squeezeBalls: true,
    bindCockBalls: true,
    doubleStrokes: true,
    gripChallenge: true,
    halvedStrokes: true,
    clusterStrokes: true,
    pickYourPoison: true,
    teasingStrokes: true,
    gripAdjustments: true,
    nipplesAndStroke: true,
    randomStrokeSpeed: true,
    accelerationCycles: true,
    redLightGreenLight: true,
  },
  videos: true,
  pictures: true,
  redditId: "puppies",
  edgeCooldown: 10,
  minimumEdges: 0,
  ruinCooldown: 20,
  edgeFrequency: 0,
  slideDuration: 10,
  advancedEdging: true,
  advancedOrgasm: true,
  maximumOrgasms: 1,
  actionFrequency: 5,
  loopShortVideos: false,
  maximumGameTime: 20,
  minimumGameTime: 5,
  deniedProbability: 0,
  finalOrgasmDenied: false,
  finalOrgasmRandom: false,
  finalOrgasmRuined: false,
  postOrgasmTorture: false,
  ruinedProbability: 0,
  allowedProbability: 100,
  defaultStrokeStyle: 0,
  fastestStrokeSpeed: 5,
  finalOrgasmAllowed: true,
  slowestStrokeSpeed: 0.25,
  initialGripStrength: 3,
  maximumRuinedOrgasms: 0,
  minimumRuinedOrgasms: 0,
  postOrgasmTortureMaximumTime: 90,
  postOrgasmTortureMinimumTime: 10,
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
