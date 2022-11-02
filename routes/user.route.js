const router = require('express').Router();

const { requireLogin, hasAuth } = require('../controllers/auth.cont')
const { list, read, update, remove, userById } = require('../controllers/user.cont')

router.route('/users')
  .get(list)

router.route('/users/:userId')
  .get(requireLogin, read)
  .patch(requireLogin, hasAuth, update)
  .delete(requireLogin, hasAuth, remove)

// router.route('/api/stripe_auth/:userId')
  // .patch(requireSignin, hasAuth, stripe_auth, update)

router.param('userId', userById)

module.exports = { userRoute: router }
