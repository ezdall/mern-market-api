const router = require('express').Router();

const { requireLogin } = require('../controllers/auth.cont');

const { isOwner, shopById } = require('../controllers/shop.cont');

const {
  stripeCustomer,
  createCharge,
  userById
} = require('../controllers/user.cont');

const {
  decreaseQuantity,
  increaseQuantity,
  productById
} = require('../controllers/product.cont');

const {
  create,
  read,
  update,
  orderById,
  listByShop,
  listByUser,
  getStatusValues
} = require('../controllers/order.cont');

router
  .route('/orders/:userId')
  .post(requireLogin, stripeCustomer, decreaseQuantity, create);

router.get('/orders/shop/:shopId', requireLogin, isOwner, listByShop);

router.get('/orders/user/:userId', requireLogin, listByUser);

router.get('/order/status-val', getStatusValues);

router.get('/order/:orderId', read);

router
  .route('/order/:shopId/cancel/:productId')
  .patch(requireLogin, isOwner, increaseQuantity, update);

router
  .route('/order/:orderId/charge/:userId/:shopId')
  .patch(requireLogin, isOwner, createCharge, update);

router.route('/order/status/:shopId').patch(requireLogin, isOwner, update);

router.param('userId', userById);
router.param('shopId', shopById);
router.param('productId', productById);
router.param('orderId', orderById);

module.exports = { orderRoute: router };
