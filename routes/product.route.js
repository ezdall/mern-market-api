const router = require('express').Router();

const { requireLogin } = require('../controllers/auth.cont')
const { isOwner, shopById } = require('../controllers/shop.cont')
const { 
  listByShop, listLatest, listCategories, listRelated, photo, defaultPhoto,
  list, read, create, update, remove, productById 
} = require('../controllers/product.cont')

router.route('/products/by/:shopId')
  .get(listByShop)
  .post(requireLogin, isOwner, create)
 

router.route('/products/latest')
  .get(listLatest)

router.route('/products/related/:productId')
  .get(listRelated)

router.route('/products/categories')
  .get(listCategories)

router.route('/products')
  .get(list)

router.route('/products/:productId')
  .get(read)

router.route('/product/image/:productId')
  .get(photo, defaultPhoto)

router.route('/product/defaultphoto')
  .get(defaultPhoto)

router.route('/product/:shopId/:productId')
  .put(requireLogin, isOwner, update)
  .delete(requireLogin, isOwner, remove)

router.param('shopId', shopById)
router.param('productId', productById)

module.exports = { productRoute: router }
