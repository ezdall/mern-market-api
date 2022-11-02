

const read = (req,res,next) => {
	const { userId } = req.params
	console.log('read:')

	return res.json(`read: ${userId}`)
}

const list = (req, res, next) => {
	console.log('user-list')

	return res.json('user-list')
}

const update = (req, res, next) => {
	const { userId } = req.params
	console.log('update:')

	return res.json(`upd: ${userId}`)
}

const remove = (req, res, next) => {
	const { userId } = req.params
	console.log('remove')

	return res.json(`del: ${userId}`)
}


const userById = (req, res, next, userId) => {

	// const { userId } = req.params
	console.log('-user-by-id-', userId)

	return next()
}

module.exports = { read, list, update, remove, userById }
