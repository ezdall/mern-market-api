const _ = require('lodash');
const mongoose = require('mongoose');

// checking for Moongose obj??
// for what?
function isMongoObj(obj) {
  return _.get(obj, 'constructor.base') instanceof mongoose.Mongoose;
}

module.exports = { isMongoObj };
