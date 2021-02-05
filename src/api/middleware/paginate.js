const yup = require("yup");

const schema = yup.object().shape({
  currentPage: yup
    .number()
    .positive()
    .default(1),
  perPage: yup
    .number()
    .moreThan(0)
    .lessThan(101)
    .default(25),
});

const createPaginateMiddleware = async (req, res, next) => {
  const { currentPage, perPage, ...query } = req.query;
  req.query = query;

  req.paginate = await schema.validate({
    currentPage,
    perPage,
  });

  next();
};

module.exports = createPaginateMiddleware;
