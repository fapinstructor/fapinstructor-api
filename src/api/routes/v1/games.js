const yup = require("yup");
const createError = require("http-errors");
const { Router } = require("express");
const gameDb = require("lib/db/game-config");
const auth = require("api/middleware/auth");
const paginate = require("api/middleware/paginate");
const sortable = require("api/middleware/sortable");
const validate = require("api/middleware/validate");
const { isAlpha } = require("lib/util/regex");

const router = Router();

const CREATE_GAME_SCHEMA = {
  body: yup.object().shape({
    title: yup
      .string()
      .min(5)
      .max(50)
      .required(),
    tags: yup
      .array()
      .of(
        yup
          .string()
          .matches(isAlpha, "Only letters and spaces are permitted")
          .min(3, "A tag must be at least 3 characters long")
          .max(30)
          .lowercase()
          .required(),
      )
      .required()
      .dedupe(),
    config: yup.object().required(),
    isPublic: yup.boolean().required(),
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
  sortable(["stars", "title", "updatedAt", "averageGameLength"]),
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
