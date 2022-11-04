const _extend = require('lodash/extend');

const { Order, CartItem } = require('../models/order.model');

// helper
const { BadRequest400 } = require('../helpers/bad-request.error');
const { Unauthorized401 } = require('../helpers/unauthorized.error');
const { Forbidden403 } = require('../helpers/forbidden.error');
const { NotFound404 } = require('../helpers/not-found.error');

const create = async (req, res, next) => {
  try {
    const user = req.profile;

    if (!user || !req.body.order) {
      return next(new BadRequest400('need valid user and order @crtOrder'));
    }

    // req.body.order.user = user;

    const order = await Order.create({ ...req.body.order, user });

    if (!order) return next(new BadRequest400('invalid order @crtOrder'));

    return res.status(201).json(order);
  } catch (err) {
    return next(err);
  }
};

const read = (req, res, next) => {
  if (!req.order) return next(new NotFound404('no order @readOrder'));

  return res.json(req.order);
};

// just update the status
const update = async (req, res, next) => {
  try {
    const { cartItemId, status } = req.body;

    // maybe unnecesary
    if (!cartItemId || !status) {
      return next(
        new BadRequest400('need valid status or id @order-status-update')
      );
    }

    // maybe use _extend
    // cant bcoz cartItem not mounted. ex. req.cart

    const order = await Order.updateOne(
      { 'products._id': cartItemId },
      {
        'products.$.status': status
      }
    );

    return res.json(order);
  } catch (err) {
    return next(err);
  }
};

// rename to ordersByShop?
const listByShop = async (req, res, next) => {
  try {
    if (!req.shop) {
      return next(new NotFound404('no shop'));
    }

    // accessing CartItem
    const orders = await Order.find({ 'products.shop': req.shop._id })
      // show product
      .populate({ path: 'products.product', select: 'name price' })
      .sort('-created')
      .lean()
      .exec();

    return res.json(orders);
  } catch (err) {
    return next(err);
  }
};

//  rename to ordersByUser?
const listByUser = async (req, res, next) => {
  try {
    if (!req.profile) return next(new NotFound404('no user @order-listByUser'));

    const orders = await Order.find({ user: req.profile._id })
      .populate({ path: 'products.product', select: 'name price' })
      .sort('-created')
      .lean()
      .exec();

    return res.json(orders);
  } catch (err) {
    return next(err);
  }
};

const orderById = async (req, res, next, orderId) => {
  try {
    const order = await Order.findById(orderId)
      .populate({ path: 'products.product', select: 'name price' })
      .populate({ path: 'products.shop', select: 'name' })
      .exec();

    if (!order) return next(new NotFound404('order not found @orderById'));

    req.order = order;

    return next();
  } catch (err) {
    return next(err);
  }
};

// what is the use of this?
const getStatusValues = (req, res, next) => {
  return res.json(CartItem.schema.path('status').enumValues);
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
