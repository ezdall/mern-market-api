const mongoose = require('mongoose');
const _ = require('lodash');
const { genSalt, hash } = require('bcrypt');

// model
const User = require('../models/user.model');

// helper
const { BadRequest400 } = require('../helpers/bad-request.error');
const { Unauthorized401 } = require('../helpers/unauthorized.error');
const { Forbidden403 } = require('../helpers/forbidden.error');
const { NotFound404 } = require('../helpers/not-found.error');

const read = (req, res, next) => {
  const user = req.profile.toObject();

  user.password = undefined;
  user.salt = undefined;

  return res.json({ user });
};

const list = async (req, res, next) => {
  try {
    const users = await User.find()
      .select('name email updated created')
      .lean()
      .exec();

    if (!users?.length) return next(new NotFound404('no users @list'));

    return res.json(users);
  } catch (err) {
    return next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { password } = req.body;
    let user = req.profile;

    if (!user) return next(new NotFound404('no user found @update'));

    user = _.extend(user, req.body);

    if (password) {
      const salt = await genSalt();

      user.salt = salt;
      user.password = await hash(password, salt);
    }

    // user.name = name || user.name;
    // user.email = email || user.email;
    //  user.seller = seller ?? user.seller;

    await user.save();

    user.password = undefined;
    user.salt = undefined;

    return res.json(user);
  } catch (err) {
    return next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const user = req.profile;

    if (!user) return next(new NotFound404('no user found @remove'));

    const deletedUser = await user.deleteOne();

    if (!deletedUser)
      return next(new BadRequest400('invalid delete user @remove'));

    deletedUser.password = undefined;
    deletedUser.salt = undefined;

    return res.json(deletedUser);
  } catch (err) {
    return next(err);
  }
};

const userById = async (req, res, next, userId) => {
  try {
    if (!userId || !mongoose.isValidObjectId(userId)) {
      return next(new BadRequest400('valid id is required @userById'));
    }

    const user = await User.findById(userId).exec();

    if (!user) return next(new NotFound404('User not found @userById'));

    req.profile = user;

    return next();
  } catch (err) {
    return next(err);
  }
};

//  need to transfer
const isSeller = (req, res, next) => {
  const { seller, name } = req.profile;
  const wasSeller = seller && typeof seller === 'boolean';

  if (!wasSeller)
    return next(new Forbidden403(`${name} is not a seller @isSeller`));

  return next();
};

const stripeCustomer = (req, res, next) => {
  console.log('stripeCustomer');

  next();
};

const createCharge = (req, res, next) => {
  console.log('createCharge');

  next();
};

module.exports = {
  read,
  list,
  update,
  remove,
  userById,
  isSeller,
  stripeCustomer,
  createCharge
};
