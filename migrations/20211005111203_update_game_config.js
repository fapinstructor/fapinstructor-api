require("../src/lib/validation/setupYup");
const { validSubreddit } = require("../src/lib/util/regex");
const {
  GAME_CONFIG_SCHEMA,
} = require("../src/api/routes/v1/schemas/GAME_CONFIG_SCHEMA");

const MAX_GAME_DURATION = 60 * 12; // 12 hours

const StrokeStyleString = {
  0: "dominant",
  1: "nondominant",
  2: "headOnly",
  3: "shaftOnly",
  4: "overhandGrip",
  5: "bothHands",
  6: "handsOff",
};

function mapOldConfigToNewConfig(oldConfig) {
  const { gifs, pictures, videos } = oldConfig;
  const mediaTypes = [];

  if (gifs) {
    mediaTypes.push("GIF");
  }
  if (pictures) {
    mediaTypes.push("PICTURE");
  }
  if (videos) {
    mediaTypes.push("VIDEO");
  }

  if (mediaTypes.length === 0) {
    mediaTypes.push("GIF", "PICTURE", "VIDEO");
  }

  const finaleSum =
    oldConfig.allowedProbability +
    oldConfig.deniedProbability +
    oldConfig.ruinedProbability;

  if (finaleSum !== 100) {
    throw new Error("Finale sum doesn't sum to 100");
  }

  let defaultStrokeStyle;

  if (typeof oldConfig.defaultStrokeStyle === "number") {
    defaultStrokeStyle = StrokeStyleString[oldConfig.defaultStrokeStyle];
  } else {
    defaultStrokeStyle = oldConfig.defaultStrokeStyle || "dominant";
  }

  const newConfig = {
    subreddits: oldConfig.redditId
      .split(",")
      .map(r => r.trim())
      // Remove any invalid subreddits.
      .filter(r => validSubreddit.test(r))
      .slice(0, 200),
    slideDuration: Math.min(
      Math.max(oldConfig.slideDuration, 3),
      MAX_GAME_DURATION,
    ),
    imageType: mediaTypes,
    gameDuration: {
      min: Math.min(Math.max(oldConfig.minimumGameTime, 1), MAX_GAME_DURATION),
      max: Math.min(
        Math.max(oldConfig.maximumGameTime, oldConfig.minimumGameTime),
        MAX_GAME_DURATION,
      ),
    },
    finaleProbabilities: {
      orgasm: oldConfig.allowedProbability,
      denied: oldConfig.deniedProbability,
      ruined: oldConfig.ruinedProbability,
    },
    postOrgasmTorture: oldConfig.postOrgasmTorture,
    postOrgasmTortureDuration: {
      min: Math.min(oldConfig.postOrgasmTortureMinimumTime, MAX_GAME_DURATION),
      max: Math.min(
        Math.max(
          oldConfig.postOrgasmTortureMaximumTime,
          oldConfig.postOrgasmTortureMinimumTime,
        ),
        MAX_GAME_DURATION,
      ),
    },
    ruinedOrgasms: {
      min: oldConfig.minimumRuinedOrgasms,
      max: Math.max(
        oldConfig.maximumRuinedOrgasms,
        oldConfig.minimumRuinedOrgasms,
      ),
    },
    edgeCooldown: Math.min(oldConfig.edgeCooldown, MAX_GAME_DURATION),
    ruinCooldown: Math.min(oldConfig.ruinCooldown, MAX_GAME_DURATION),
    minimumEdges: Math.min(oldConfig.minimumEdges, 1000),
    edgeFrequency: Math.min(oldConfig.edgeFrequency, 100),
    strokeSpeed: {
      min: Math.min(oldConfig.slowestStrokeSpeed, 8),
      max: Math.min(
        Math.max(oldConfig.fastestStrokeSpeed, oldConfig.slowestStrokeSpeed),
        8,
      ),
    },
    orgasms: {
      min: oldConfig.minimumOrgasms || 1,
      max: Math.max(
        Math.min(oldConfig.maximumOrgasms || 1, 50),
        oldConfig.minimumOrgasms || 1,
      ),
    },
    gripAdjustments: oldConfig.tasks.gripAdjustments,
    initialGripStrength: oldConfig.initialGripStrength,
    defaultStrokeStyle: defaultStrokeStyle,
    actionFrequency: oldConfig.actionFrequency,
    tasks: Object.entries(oldConfig.tasks)
      .filter(
        ([taskKey, enabled]) =>
          enabled && !["gripAdjustments", "pickYourPoison"].includes(taskKey),
      )
      .map(([taskKey]) => taskKey),
  };

  if (newConfig.subreddits.length === 0) {
    throw new Error("Unable to convert");
  }

  return newConfig;
}

async function validateGameConfig(config) {
  return GAME_CONFIG_SCHEMA.validate(config, { abortEarly: false });
}

exports.up = async function(knex) {
  const result = await knex("game_config").select("id", "config");
  const errors = [];

  await knex.transaction(async transaction => {
    for (let i = 0; i < result.length; i++) {
      const { id, config } = result[i];

      try {
        const newConfig = mapOldConfigToNewConfig(config);

        try {
          const sanitizedConfig = await validateGameConfig(newConfig);

          await transaction("game_config")
            .update({
              config: sanitizedConfig,
            })
            .where({ id });
        } catch (error) {
          errors.push(id);
          console.error(`Failed to migrate ${id}:`, error);
        }
      } catch (error) {
        await transaction("game_config")
          .delete()
          .where({ id });
      }
    }
  });

  if (errors.length > 0) {
    console.error("Failed to migrate the following games:", errors);
  }
};

exports.down = async function(knex) {};
