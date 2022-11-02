const router = require('express').Router();

const { login, register, logout } = require('../controllers/auth.cont')

router.post('/login', login)

router.post('/register', register)

router.get('/logout', logout)

module.exports = { authRoute: router }