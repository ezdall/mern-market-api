





const list = async (req, res, next) => {
	return res.json('shop-list')
}

const listByOwner = async (req, res, next) => {
	return res.json('listByOwner')
}

const read = async (req, res, next) => {
	return res.json(`read ${req.params.shopId}`)
}

const create = async (req, res,next) => {
	return res.json('create')
}

const update = async (req, res,next) => {
return res.json(`upd ${req.params.shopId}`)
}

const remove = async (req, res,next) => {
	return res.json(`delete ${req.params.shopId}`)
}

const photo = async (req, res,next) => {
	console.log('photo')

	return next()
}

const defaultPhoto = async (req, res,next) => {
	return res.json('defaultPhoto')
}

const isOwner = async (req, res, next) => {
	console.log('isOwner')
	return next()
}

const shopById = async (req, res, next) => {
	console.log('shopById')
	return next()
}

module.exports = { 
list, listByOwner, read, create, update, remove, photo, defaultPhoto, isOwner, shopById
}