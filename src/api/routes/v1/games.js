const yup = require("yup");
const createError = require("http-errors");
const { Router } = require("express");
const gameDb = require("lib/db/game-config");
const auth = require("api/middleware/auth");
const paginate = require("api/middleware/paginate");
const sortable = require("api/middleware/sortable");
const validate = require("api/middleware/validate");
const { isAlpha, isUuid } = require("lib/util/regex");
const {
  GAME_CONFIG_SCHEMA,
} = require("api/routes/v1/schemas/GAME_CONFIG_SCHEMA");

const router = Router();

const CREATE_GAME_SCHEMA = {
  body: yup
    .object()
    .required()
    .shape({
      title: yup
        .string()
        .min(
          5,
          ({ min }) => `The title must contain at least ${min} characters.`,
        )
        .max(
          50,
          ({ max }) =>
            `The title cannot be greater than ${max} characters long.`,
        )
        .required("Please enter a title."),
      tags: yup
        .array()
        .required()
        .of(
          yup
            .string()
            .required()
            .matches(
              isAlpha,
              "Only lowercase letters and spaces are permitted.",
            )
            .min(
              3,
              ({ min }) => `A tag must be at least ${min} characters long.`,
            )
            .max(
              30,
              ({ max }) =>
                `A tag cannot be greater than ${max} characters long.`,
            )
            .lowercase()
            .required(),
        )
        .min(1, ({ min }) => `You must specify at least ${min} tag.`)
        .dedupe(),
      isPublic: yup.boolean().required(),
      config: GAME_CONFIG_SCHEMA,
    }),
};

const GAME_FILTER_SCHEMA = {
  query: yup.object().shape({
    title: yup.string(),
    createdBy: yup.string(),
    tags: yup
      .array()
      .delimited()
      .of(yup.string())
      .unique(),
  }),
};

const GET_GAME_SCHEMA = {
  params: yup.object().shape({
    gameId: yup
      .string()
      .matches(isUuid, ({ value }) => `game id '${value}' is an invalid uuid.`),
  }),
};

router.post("/", auth(), validate(CREATE_GAME_SCHEMA), async (req, res) => {
  const userId = req.user.sub;
  const game = req.body;
  try {
    const id = await gameDb.create(game, userId);
    res.location(`${req.baseUrl}/${id}`);
    res.status(201).send({
      id,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400).send({ error });
    } else {
      throw error;
    }
  }
});

router.get(
  "/:gameId",
  auth({ credentialsRequired: false }),
  validate(GET_GAME_SCHEMA),
  async (req, res, next) => {
    const userId = req.user && req.user.sub;
    const { gameId } = req.params;

    const game = await gameDb.findById(gameId, userId);

    if (!game) {
      return next(createError.NotFound(`The game ${gameId} doesn't exist!`));
    }

    res.send(game);
  },
);

router.get(
  "/",
  auth({ credentialsRequired: false }),
  paginate,
  sortable(["stars", "title", "updatedAt", "averageGameDuration"]),
  validate(GAME_FILTER_SCHEMA),
  async (req, res) => {
    const userId = req.user && req.user.sub;
    const paginate = req.paginate;
    const sort = req.sort;
    const filters = req.query;

    const games = await gameDb.findAll(userId, paginate, filters, sort);

    res.send(games);
  },
);

module.exports = {
  router,
  CREATE_GAME_SCHEMA,
  GAME_FILTER_SCHEMA,
};
