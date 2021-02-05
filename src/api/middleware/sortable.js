const yup = require("yup");

/**
 * Create a yup schema from the specified columns that supports ascending
 * and decending sorting
 *
 * @param {*} columnsArg
 */
function createSortableSchema(columnsArg) {
  const columns = columnsArg.reduce(
    (result, column) => [...result, column, `-${column}`],
    [],
  );

  const SORTABLE_SCHEMA = yup.object().shape({
    sort: yup
      .array()
      .delimited()
      .of(yup.mixed().oneOf(columns))
      .unique(),
  });

  return SORTABLE_SCHEMA;
}

function createSortableMiddleware(columnsArg) {
  const schema = createSortableSchema(columnsArg);

  return async function(req, res, next) {
    const { sort, ...query } = req.query;
    req.query = query;

    if (sort && sort.length > 0) {
      try {
        const result = await schema.validate({
          sort: sort.split(","),
        });
        req.sort = result.sort;
      } catch (error) {
        return res.status(400).json({ error });
      }
    }

    next();
  };
}

module.exports = createSortableMiddleware;
