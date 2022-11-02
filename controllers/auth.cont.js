const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt')
const { compare, hash, genSalt } = require('bcrypt');
const _ = require('lodash');

// model
const User = require('../models/user.model');

// helper
const { BadRequest400 } = require('../helpers/bad-request.error');
const { Unauthorized401 } = require('../helpers/unauthorized.error');
const { Forbidden403 } = require('../helpers/forbidden.error')
const { NotFound404 } = require('../helpers/not-found.error');

/**
 * @desc Register
 * @route POST - /auth/register
 * @access Public
 */

const register = async (req, res, next)=> {
	try {
		const { name, email, password, seller } = req.body

		if(!name || !email || !password || (seller && typeof seller !== 'boolean')){
			return next(new BadRequest400('valid fields are required @register'))
		}

		// async-hash
		const salt = await genSalt();
		const hashPass = await hash(password, salt)

		const newUser = await User.create({...req.body, password: hashPass, salt})

		if(!newUser){
			return next(new BadRequest400('invalid user @register'))
		}

		return res.status(201).json({
			message: `register ${name} successfully!`
		})
	} catch (err){
		return next(err)
	}
}


/**
 * @desc Login
 * @route POST - /auth
 * @access Public
 */

const login = async (req, res, next) =>{
	try{
		const { email, password } = req.body

		if(!email || !password ){
			return next(new BadRequest400('all field required @login'))
		}

		// exec bcoz we need to validatePassword
		const user = await User.findOne({ email }).exec()

		if(!user){
			return next(new NotFound404('User not found @login'))
		}

		const passMatch = await compare(password, user.password);

		if(!passMatch || typeof passMatch !== 'boolean'){
			return next(new Unauthorized401('wrong password @login'))
		}
  
    console.log('password & email match ----- ')

    // generate a access token 
    const accessToken = jwt.sign({ 
  			email: user.email,
  			seller: user.seller
    	}, 
  	  process.env.ACCESS_SECRET,
 	   { expiresIn: '1h' }
    );

    // generate refresh token
    const refreshToken = jwt.sign(
    	{ email: user.email },
    	process.env.REFRESH_SECRET,
    	{ expiresIn: '1d' }
    )

    // persist/cache the refreshToken as 'jwt' in res.cookie with expiry date
    // why await?
    await res.cookie('jwt', refreshToken, {
     httpOnly: true, // accessible only by webserver
     // secure: true, // https
     sameSite: 'None', // cross-site cookie
     maxAge: 7 * 24 * 60 * 60 * 1000 // 
   	});

		// destructure
		const { _id, name, seller } = user;

		return res.json({ 
			accessToken, 
			user: { _id, name, email, seller } 
		})

	} catch(err){
		return next(err)
	}
}

/**
 * @desc Logout
 * @route GET - /auth/logout
 * @access Public
 */

const logout = async (req, res, next) =>{
	try{
		// de-mount
		const cookies = req.cookies

		if(!cookies?.jwt) return res.sendStatus(204) // no content

		// clearing
		res.clearCookie('jwt', { httpOnly: true, sameSite: 'None' })

		return res.json({ message: "logged out" })
	} catch(err){
		return next(err)
	}
}

// checks and decoder of "Bearer xxx" req.headers.authorization
// then "Mount" data to req.auth
const requireLogin = expressJwt({
	secret: process.env.ACCESS_SECRET,
	algorithms: ['HS256'],
	requestProperty: 'auth'
})

module.exports = { login, register, logout,  requireLogin }