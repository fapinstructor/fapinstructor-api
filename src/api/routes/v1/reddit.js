const { Router } = require("express");
const yup = require("yup");
const validate = require("../../middleware/validate");
const { validSubreddit } = require("../../../lib/util/regex");
const { getLinks, scrapSubreddits } = require("../../../lib/db/reddit");
const { MEDIA_TYPE } = require("../../../lib/media-type");

// TODO: Could probably extract this into some sort of enum schema factory
const getEnumKeys = enumType =>
  Object.entries(enumType).reduce(
    (result, [key, value]) => (value === 0 ? result : [...result, key]),
    [],
  );
const getEnumValues = (enumType, enumKeys) =>
  enumKeys.map(key => enumType[key]);

const router = Router();

const REDDIT_SCHEMA = {
  query: yup.object().shape({
    subreddits: yup
      .array()
      .delimited()
      .of(
        yup
          .string()
          .required()
          .matches(validSubreddit, "Invalid subreddit name")
          .lowercase(),
      )
      .unique()
      .required(),
    mediaTypes: yup
      .array()
      .delimited()
      .of(
        yup
          .string()
          .uppercase()
          .oneOf(getEnumKeys(MEDIA_TYPE)),
      )
      .unique(),
    limit: yup
      .number()
      .max(1000)
      .required(),
  }),
};

router.get("/", validate(REDDIT_SCHEMA), async (req, res) => {
  const { subreddits, mediaTypes, limit } = req.query;

  const failedSubreddits = await scrapSubreddits(subreddits);

  const validSubreddits = subreddits.filter(
    subreddit => !failedSubreddits.includes(subreddit),
  );

  let links = [];
  if (validSubreddits.length > 0) {
    links = await getLinks({
      subreddits: validSubreddits,
      mediaTypes: mediaTypes && getEnumValues(MEDIA_TYPE, mediaTypes),
      limit,
    });
  }

  res.send({
    failedSubreddits,
    links,
  });
});

module.exports = router;
