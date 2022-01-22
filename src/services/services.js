const jwt = require('jsonwebtoken')
exports.generateAuthToken = async (param) => {
	const token = jwt.sign({ _id: param.toString() }, process.env.JWT_TOKEN, { expiresIn: '6h' })

	return token    
}

exports.removeItemOnce = (arr, value) =>{
	let index = arr.indexOf(value)
	if (index > -1) {
		arr.splice(index, 1)
	}
	// eslint-disable-next-line no-undef
	refreshTokens = arr
}