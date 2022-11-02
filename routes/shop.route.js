const router = require('express').Router();

const { isSeller, userById } = require('../controllers/user.cont')
const { requireLogin, hasAuth } = require('../controllers/auth.cont')
const { list, listByOwner, read, create, update, remove, photo, defaultPhoto, isOwner, shopById } = require('../controllers/shop.cont')

router.get('/shops', list)

router.get('/shop/:shopId', read)

router.route('/shops/by/:userId')
 	.get(requireLogin, hasAuth, listByOwner)
  .post(requireLogin, hasAuth, isSeller, create)
 
router.route('/shops/:shopId')
  .patch(requireLogin, isOwner, update)
  .delete(requireLogin, isOwner, remove)

router.get('/shops/logo/:shopId', photo, defaultPhoto)

router.get('/shops/defaultphoto', defaultPhoto)

router.param('shopId', shopById)
router.param('userId', userById)

module.exports = { shopRoute: router }