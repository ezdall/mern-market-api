const create = (req, res, next) => {
  return res.json('create');
};

const read = (req, res, next) => {
  return res.json('read');
};

const update = (req, res, next) => {
  return res.json('update');
};

const listByShop = (req, res, next) => {
  return res.json('listByShop');
};

const listByUser = (req, res, next) => {
  return res.json('listByUser');
};

const orderById = (req, res, next) => {
  console.log('orderById');

  return next();
};

const getStatusValues = (req, res, next) => {
  return res.json('getStatusValues');
};

module.exports = {
  create,
  read,
  update,
  listByShop,
  listByUser,
  orderById,
  getStatusValues
};
